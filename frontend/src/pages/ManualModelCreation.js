import React from "react";
import NetworkVisualization from "../components/BuildModels/NetworkVisualization";
import LayerConfig from "../components/BuildModels/LayerConfig";
import OptimizerConfig from "../components/BuildModels/OptimizerConfig";
import MetricsConfig from "../components/BuildModels/MetricsConfig";
import ResultDisplay from "../components/BuildModels/ResultDisplay";

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
  handleStartTraining,
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

        {!result ? (
          <button type="submit" disabled={loading}>
            {loading ? "Создание..." : "Создать модель"}
          </button>
        ) : (
          <button type="button" className="start-training-btn" onClick={handleStartTraining} disabled={loading}>
            {loading ? "Запуск..." : "Начать обучение"}
          </button>
        )}
      </form>
      <ResultDisplay error={error} result={result} />
    </div>
  );
}

export default ManualModelCreation;
