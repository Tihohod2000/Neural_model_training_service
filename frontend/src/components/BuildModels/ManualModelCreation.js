import React from "react";
import NetworkVisualization from "./NetworkVisualization";
import LayerConfig from "./LayerConfig";
import OptimizerConfig from "./OptimizerConfig";
import MetricsConfig from "./MetricsConfig";
import ResultDisplay from "./ResultDisplay";

function ManualModelCreation({
  networkStructure,
  layers,
  inputDim,
  setInputDim,
  addLayer,
  removeLayer,
  updateLayer,
  optimizer,
  setOptimizer,
  learningRate,
  setLearningRate,
  loss,
  setLoss,
  metrics,
  setMetrics,
  handleSubmit,
  loading,
  error,
  result,
}) {
  return (
    <div>
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

export default ManualModelCreation;
