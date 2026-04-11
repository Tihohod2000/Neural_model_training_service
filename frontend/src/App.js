import React from "react";
import BuildModels from "./pages/BuildModels"
import LoginPage from "./pages/login"

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <LoginPage />;
  }

  return (
    <div className="App">
      <BuildModels>
      </BuildModels>
    </div>
  );
}

export default App;
