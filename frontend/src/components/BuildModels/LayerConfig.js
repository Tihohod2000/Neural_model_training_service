import React from "react";

const activationFunctions = [
  { value: "relu", label: "ReLU" },
  { value: "sigmoid", label: "Sigmoid" },
  { value: "tanh", label: "Tanh" },
  { value: "softmax", label: "Softmax" },
  { value: "softplus", label: "Softplus" },
  { value: "elu", label: "ELU" },
  { value: "selu", label: "SELU" },
  { value: "gelu", label: "GELU" },
  { value: "swish", label: "Swish" },
  { value: "mish", label: "Mish" },
  { value: "linear", label: "Linear" },
  { value: "leaky_relu", label: "Leaky ReLU" },
  { value: "prelu", label: "PReLU" },
  { value: "exponential", label: "Exponential" },
  { value: "hard_sigmoid", label: "Hard Sigmoid" },
];

function LayerConfig({ layers, addLayer, removeLayer, updateLayer }) {
  return (
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
              <select
                value={layer.activation || "relu"}
                onChange={(e) =>
                  updateLayer(index, "activation", e.target.value)
                }
              >
                {activationFunctions.map((act) => (
                  <option key={act.value} value={act.value}>
                    {act.label}
                  </option>
                ))}
              </select>
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
  );
}

export default LayerConfig;
