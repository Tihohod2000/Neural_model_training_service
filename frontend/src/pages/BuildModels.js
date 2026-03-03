import React, { useState, useMemo } from "react";
import "./BuildModels.css";

function BuildModels() {
  const [inputDim, setInputDim] = useState(10);
  const [layers, setLayers] = useState([
    { type: "Dense", units: 64, activation: "relu" },
  ]);
  const [optimizer, setOptimizer] = useState("adam");
  const [learningRate, setLearningRate] = useState(0.001);
  const [loss, setLoss] = useState("binary_crossentropy");
  const [metrics, setMetrics] = useState(["accuracy"]);

  const optimizers = [
    { value: "adam", label: "Adam" },
    { value: "sgd", label: "SGD" },
    { value: "rmsprop", label: "RMSprop" },
    { value: "adagrad", label: "Adagrad" },
    { value: "adadelta", label: "Adadelta" },
    { value: "adamax", label: "Adamax" },
    { value: "nadam", label: "Nadam" },
    { value: "ftrl", label: "Ftrl" },
  ];

  const lossFunctions = [
    { value: "binary_crossentropy", label: "Binary Crossentropy" },
    { value: "categorical_crossentropy", label: "Categorical Crossentropy" },
    { value: "sparse_categorical_crossentropy", label: "Sparse Categorical Crossentropy" },
    { value: "mse", label: "MSE (Mean Squared Error)" },
    { value: "mae", label: "MAE (Mean Absolute Error)" },
    { value: "huber", label: "Huber" },
    { value: "hinge", label: "Hinge" },
    { value: "squared_hinge", label: "Squared Hinge" },
  ];

  // Вычисляем структуру сети для визуализации
  const networkStructure = useMemo(() => {
    const structure = [inputDim]; // входной слой
    layers.forEach((layer) => {
      if (layer.type === "Dense") {
        structure.push(layer.units || 0);
      }
      // Dropout не добавляем в визуализацию как отдельный слой
    });
    structure.push(1); // выходной слой
    return structure;
  }, [inputDim, layers]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addLayer = () => {
    setLayers([...layers, { type: "Dense", units: 32, activation: "relu" }]);
  };

  const removeLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const updateLayer = (index, field, value) => {
    const updated = layers.map((layer, i) =>
      i === index ? { ...layer, [field]: value } : layer
    );
    setLayers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/create-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_dim: inputDim,
          layers: layers,
          compile: {
            optimizer: {
              type: optimizer,
              learning_rate: learningRate,
            },
            loss: loss,
            metrics: metrics,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Ошибка: ${response.status}`);
      }else{
        alert("Модель создана!!!")
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="build-models-page">
      <h1>Создание нейронной модели</h1>

      {/* Визуализация нейронной сети */}
      <div className="network-visualization">
        <svg viewBox="0 0 800 400" className="network-svg">
          {networkStructure.map((neurons, layerIndex) => {
            const x = 100 + layerIndex * 150;
            const spacing = Math.min(30, 300 / Math.max(neurons, 1));
            const startY = (400 - (neurons - 1) * spacing) / 2;

            const connections = [];
            if (layerIndex > 0 && networkStructure[layerIndex - 1]) {
              const prevX = 100 + (layerIndex - 1) * 150;
              const prevSpacing = Math.min(30, 300 / Math.max(networkStructure[layerIndex - 1], 1));
              const prevStartY = (400 - (networkStructure[layerIndex - 1] - 1) * prevSpacing) / 2;

              for (let prevIdx = 0; prevIdx < networkStructure[layerIndex - 1]; prevIdx++) {
                const prevY = prevStartY + prevIdx * prevSpacing;
                for (let currIdx = 0; currIdx < neurons; currIdx++) {
                  const currY = startY + currIdx * spacing;
                  connections.push(
                    <line
                      key={`connection-${layerIndex}-${prevIdx}-${currIdx}`}
                      x1={prevX + 15}
                      y1={prevY}
                      x2={x - 15}
                      y2={currY}
                      className="connection"
                      style={{
                        animationDelay: `${(layerIndex * 10 + prevIdx + currIdx) * 0.05}s`,
                      }}
                    />
                  );
                }
              }
            }

            return (
              <g key={`layer-group-${layerIndex}`}>
                {connections}
                {Array.from({ length: neurons }).map((_, neuronIdx) => {
                  const y = startY + neuronIdx * spacing;
                  const isInput = layerIndex === 0;
                  const isOutput = layerIndex === networkStructure.length - 1;
                  const isHidden = !isInput && !isOutput;

                  return (
                    <g key={`neuron-${layerIndex}-${neuronIdx}`} className="neuron-group">
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        className={`neuron ${isInput ? 'input-neuron' : isOutput ? 'output-neuron' : 'hidden-neuron'}`}
                        style={{
                          animationDelay: `${(layerIndex * 5 + neuronIdx) * 0.1}s`,
                        }}
                      />
                      {isHidden && (
                        <text
                          x={x}
                          y={y + 4}
                          className="neuron-label"
                          textAnchor="middle"
                        >
                          {layers.filter(l => l.type === 'Dense')[layerIndex - 1]?.units || ''}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text
                  x={x}
                  y={380}
                  className="layer-label"
                  textAnchor="middle"
                >
                  {layerIndex === 0 ? `Вход (${neurons})` :
                   layerIndex === networkStructure.length - 1 ? `Выход (${neurons})` :
                   `Слой ${layerIndex} (${neurons})`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Размерность входа (input_dim):</label>
          <input
            type="number"
            value={inputDim}
            onChange={(e) => setInputDim(parseInt(e.target.value) || 0)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Слои:</label>
          {layers.map((layer, index) => (
            <div key={index} className="layer-row">
              <select
                value={layer.type}
                onChange={(e) => updateLayer(index, "type", e.target.value)}
              >
                <option value="Dense">Dense</option>
                <option value="Dropout">Dropout</option>
              </select>
              {layer.type !== "Dropout" && (
                <>
                  <input
                    type="number"
                    placeholder="Units"
                    value={layer.units || ""}
                    onChange={(e) =>
                      updateLayer(index, "units", parseInt(e.target.value) || 0)
                    }
                    min="1"
                  />
                  <input
                    type="text"
                    placeholder="Activation"
                    value={layer.activation || ""}
                    onChange={(e) =>
                      updateLayer(index, "activation", e.target.value)
                    }
                  />
                </>
              )}
              {layer.type === "Dropout" && (
                <input
                  type="number"
                  placeholder="Rate"
                  value={layer.rate || ""}
                  onChange={(e) =>
                    updateLayer(index, "rate", parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="1"
                  step="0.1"
                />
              )}
              <button type="button" onClick={() => removeLayer(index)}>
                Удалить
              </button>
            </div>
          ))}
          <button type="button" onClick={addLayer}>
            Добавить слой
          </button>
        </div>

        <div className="form-group">
          <label>Оптимизатор:</label>
          <select
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
          >
            {optimizers.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Learning Rate:</label>
          <input
            type="number"
            step="0.0001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Функция потерь (loss):</label>
          <select
            value={loss}
            onChange={(e) => setLoss(e.target.value)}
          >
            {lossFunctions.map((loss) => (
              <option key={loss.value} value={loss.value}>
                {loss.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Метрики (через запятую):</label>
          <input
            type="text"
            value={metrics.join(", ")}
            onChange={(e) =>
              setMetrics(
                e.target.value.split(",").map((m) => m.trim()).filter(Boolean)
              )
            }
            placeholder="accuracy, precision, recall..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Создание..." : "Создать модель"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h2>Результат:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default BuildModels;