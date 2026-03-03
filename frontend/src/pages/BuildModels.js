import React, { useState, useMemo } from "react";
import "./BuildModels.css";
import NetworkVisualization from "../components/BuildModels/NetworkVisualization";
import LayerConfig from "../components/BuildModels/LayerConfig";
import OptimizerConfig from "../components/BuildModels/OptimizerConfig";
import MetricsConfig from "../components/BuildModels/MetricsConfig";
import ResultDisplay from "../components/BuildModels/ResultDisplay";

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

  const networkStructure = useMemo(() => {
    const structure = [inputDim];
    layers.forEach((layer) => {
      if (layer.type === "Dense") {
        structure.push(layer.units || 0);
      }
    });
    structure.push(1);
    return structure;
  }, [inputDim, layers]);

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
      } else {
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

      <NetworkVisualization networkStructure={networkStructure} layers={layers} />

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

        <LayerConfig
          layers={layers}
          addLayer={addLayer}
          removeLayer={removeLayer}
          updateLayer={updateLayer}
        />

        <OptimizerConfig
          optimizer={optimizer}
          setOptimizer={setOptimizer}
          learningRate={learningRate}
          setLearningRate={setLearningRate}
          loss={loss}
          setLoss={setLoss}
        />

        <MetricsConfig metrics={metrics} setMetrics={setMetrics} />

        <button type="submit" disabled={loading}>
          {loading ? "Создание..." : "Создать модель"}
        </button>
      </form>

      <ResultDisplay error={error} result={result} />
    </div>
  );
}

export default BuildModels;
