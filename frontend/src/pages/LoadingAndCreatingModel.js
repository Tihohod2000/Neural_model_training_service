import React, { useState } from "react";
import "./LoadingAndCreatingModel.css";

function LoadingAndCreatingModel({ onFileLoaded, onColumnsSelected, loading, error, result }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1 ГБ в байтах

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      alert("Пожалуйста, загрузите файл формата CSV");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Размер файла не должен превышать 1 ГБ");
      setFile(null);
      return;
    }

    setFile(selectedFile);

    if (onFileLoaded) {
      onFileLoaded(selectedFile);
    }
  };

  const handleFileLoaded = (uploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile);

    fetch("/uploadCSV", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.headers) {
          setHeaders(data.headers);
        }
      })
      .catch((err) => {
        console.error("Ошибка при загрузке:", err);
      });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
      handleFileLoaded(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
      handleFileLoaded(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFeatureChange = (header) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(header)) {
        return prev.filter((h) => h !== header);
      }
      return [...prev, header];
    });
  };

  const handleSelectAllFeatures = () => {
    setSelectedFeatures(headers);
  };

  const handleDeselectAllFeatures = () => {
    setSelectedFeatures([]);
  };

  const handleTargetChange = (header) => {
    setSelectedTarget(header);
  };

  // Вызываем callback при изменении выбранных колонок
  React.useEffect(() => {
    if (onColumnsSelected && headers.length > 0) {
      onColumnsSelected({
        features: selectedFeatures,
        target: selectedTarget,
      });
    }
  }, [selectedFeatures, selectedTarget]);

  return (
    <div className="loading-model-container">
      <h2>Загрузка CSV файла</h2>
      <p className="description">
        Загрузите файл с данными для обучения модели (макс. 1 ГБ)
      </p>

      <div
        className={`drop-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="csv-file-input"
          accept=".csv"
          onChange={handleInputChange}
          hidden
        />
        <label htmlFor="csv-file-input" className="file-input-label">
          <div className="upload-icon">📁</div>
          <p>Перетащите CSV файл сюда</p>
          <p>или</p>
          <button
            type="button"
            className="select-file-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("csv-file-input").click();
            }}
          >
            Выбрать файл
          </button>
          <p className="file-size-limit">Максимальный размер: 1 ГБ</p>
        </label>
      </div>

      {file && (
        <div className="file-info">
          <div className="file-details">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
          <button
            type="button"
            className="remove-file-btn"
            onClick={() => setFile(null)}
          >
            ✕
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Загрузка...</div>}

      {headers.length > 0 && (
        <div className="column-selection">
          <h3>Выбор колонок для обучения</h3>

          <div className="selection-section">
            <h4>Целевая переменная (выход)</h4>
            <p className="selection-hint">Выберите одну колонку, которую модель будет предсказывать</p>
            <select
              className="target-select"
              value={selectedTarget || ""}
              onChange={(e) => handleTargetChange(e.target.value)}
            >
              <option value="" disabled>-- Выберите целевую колонку --</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div className="selection-section">
            <h4>Признаки (вход)</h4>
            <p className="selection-hint">Выберите колонки, которые будут использоваться как входные данные</p>
            <div className="selection-buttons">
              <button
                type="button"
                className="select-btn"
                onClick={handleSelectAllFeatures}
              >
                Выбрать все
              </button>
              <button
                type="button"
                className="select-btn"
                onClick={handleDeselectAllFeatures}
              >
                Сбросить все
              </button>
            </div>
            <div className="features-grid">
              {headers.map((header) => (
                <label key={header} className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(header)}
                    onChange={() => handleFeatureChange(header)}
                    disabled={header === selectedTarget}
                  />
                  <span className={header === selectedTarget ? "disabled" : ""}>
                    {header}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="selection-summary">
            <p>
              <strong>Выбрано признаков:</strong> {selectedFeatures.length}
            </p>
            <p>
              <strong>Целевая переменная:</strong>{" "}
              {selectedTarget || "не выбрана"}
            </p>
          </div>

          <button
            type="button"
            className="continue-btn"
            disabled={selectedFeatures.length === 0 || !selectedTarget}
          >
            Продолжить обучение модели
          </button>
        </div>
      )}
    </div>
  );
}

export default LoadingAndCreatingModel;
