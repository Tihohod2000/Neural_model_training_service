import React, { useState, useMemo } from "react";
import "./BuildModels.css";
import ManualModelCreation from "./ManualModelCreation";
import LoadingAndCreatingModel from "./LoadingAndCreatingModel";

function BuildModels() {
  const [inputDim, setInputDim] = useState(10);
  const [layers, setLayers] = useState([
    { type: "Dense", units: 64, activation: "relu" },
  ]);

  const [outLayer, setoutLayer] = useState(1)
  const [optimizer, setOptimizer] = useState("adam");
  const [learningRate, setLearningRate] = useState(0.001);
  const [loss, setLoss] = useState("binary_crossentropy");
  const [metrics, setMetrics] = useState(["accuracy"]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentPages, setCurrentPages] = useState(1);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({
    features: [],
    target: null,
  });

  const networkStructure = useMemo(() => {
    const structure = [inputDim];
    layers.forEach((layer) => {
      if (layer.type === "Dense") {
        structure.push(layer.units || 0);
      }
    });
    structure.push(outLayer);
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
      }

      const data = await response.json();
      setResult(data);
      alert("Модель создана!!!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/uploadCSV", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Ошибка: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      alert("Файл успешно загружен!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnsSelected = (columns) => {
    setSelectedColumns(columns);
  };

  return (
    <div className="build-models-page">
      <h1>Создание нейронной модели</h1>
      <div className="SelectConfigMaker">
        <button onClick={() => setCurrentPages(0)}>
          Создать вручную
        </button>
        <button onClick={() => setCurrentPages(1)}>
          Создать на основе CSV
        </button>
      </div>

      {currentPages === 0 ? (
        <ManualModelCreation
          networkStructure={networkStructure}
          layers={layers}
          inputDim={inputDim}
          setInputDim={setInputDim}
          addLayer={addLayer}
          removeLayer={removeLayer}
          updateLayer={updateLayer}
          optimizer={optimizer}
          setOptimizer={setOptimizer}
          learningRate={learningRate}
          setLearningRate={setLearningRate}
          loss={loss}
          setLoss={setLoss}
          metrics={metrics}
          setMetrics={setMetrics}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          result={result}
        />
      ) : (
        <LoadingAndCreatingModel
          onFileLoaded={handleCsvUpload}
          onColumnsSelected={handleColumnsSelected}
          setCurrentPages={setCurrentPages}
          loading={loading}
          error={error}
          result={result}
          inputDim={inputDim}
          setInputDim={setInputDim}
        />
      )}

    </div>
  );
}

export default BuildModels;
