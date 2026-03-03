import React, { useState } from "react";

function BuildModels() {
  const [inputDim, setInputDim] = useState(10);
  const [layers, setLayers] = useState([
    { type: "Dense", units: 64, activation: "relu" },
  ]);
  const [optimizer, setOptimizer] = useState("adam");
  const [learningRate, setLearningRate] = useState(0.001);
  const [loss, setLoss] = useState("binary_crossentropy");
  const [metrics, setMetrics] = useState(["accuracy"]);

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
          <input
            type="text"
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
            placeholder="adam, sgd, rmsprop..."
          />
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
          <input
            type="text"
            value={loss}
            onChange={(e) => setLoss(e.target.value)}
            placeholder="binary_crossentropy, mse, categorical_crossentropy..."
          />
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