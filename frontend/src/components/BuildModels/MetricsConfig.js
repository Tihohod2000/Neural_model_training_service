import React from "react";

function MetricsConfig({ metrics, setMetrics }) {
  return (
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
  );
}

export default MetricsConfig;
