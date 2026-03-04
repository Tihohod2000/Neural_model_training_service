import React, { useState } from "react";
import "./LoadingAndCreatingModel.css";

function LoadingAndCreatingModel({ onFileLoaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1 ГБ в байтах

  const handleFile = (selectedFile) => {
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Пожалуйста, загрузите файл формата CSV");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Размер файла не должен превышать 1 ГБ");
      setFile(null);
      return;
    }

    setFile(selectedFile);

    if (onFileLoaded) {
      onFileLoaded(selectedFile);
    }
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
          <button type="button" className="select-file-btn">
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

      {file && (
        <div className="next-step">
          <p>Файл готов к обработке</p>
        </div>
      )}
    </div>
  );
}

export default LoadingAndCreatingModel;
