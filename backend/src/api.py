from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional, List, Union
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers as keras_layers
import joblib
from src.model import build_model_from_config
from src.schemas import *

app = FastAPI(title="ML Prediction API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
scaler = None






@app.on_event("startup")
async def load_model_and_scaler():
    """Загрузка модели и скалера при старте."""
    global model, scaler
    model = keras.models.load_model("models/model.h5")
    scaler = joblib.load("models/scaler.pkl")
    print(f"Input_shape: {model.input_shape[1]}")
    # print(model.summary())


@app.get("/health")
async def health_check():
    """Проверка доступности сервиса."""
    return {"status": "ok"}




@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Предсказание для одного набора признаков."""
    try:
        features = np.array(request.features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        probability = float(model.predict(features_scaled, verbose=0)[0][0])
        prediction = 1 if probability > 0.5 else 0

        return {"prediction": prediction, "probability": probability}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/create-model")
async def create_model(params: ModelParameters):
    global model
    try:
        model = build_model_from_config(params)

        return {
            "message": "Model created successfully",
            "input_dim": params.input_dim,
            "num_layers": len(params.layers),
            "total_params": model.count_params()
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
@app.post("/makemodel")
async def makemodel():
    return "model was made"
