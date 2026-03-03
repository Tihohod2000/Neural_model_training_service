import React from "react";

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

function OptimizerConfig({ optimizer, setOptimizer, learningRate, setLearningRate, loss, setLoss }) {
  return (
    <>
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
    </>
  );
}

export default OptimizerConfig;
