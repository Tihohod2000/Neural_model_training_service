import React from "react";

function ResultDisplay({ error, result }) {
  return (
    <>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h2>Результат:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default ResultDisplay;
