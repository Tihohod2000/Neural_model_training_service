from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional, List, Union
from src.saveModel import save_model
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers as keras_layers
import joblib
from src.model import build_model_from_config
from src.trainer import train_model_from_csv
from src.schemas import *
import os
import pandas as pd
import io

app = FastAPI(title="ML Prediction API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Максимальный размер файла: 1 ГБ
MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024  # 1 GB в байтах
UPLOAD_DIR = "uploads"

# Создаём директорию для загрузок, если не существует
os.makedirs(UPLOAD_DIR, exist_ok=True)

model = None
scaler = None


@app.on_event("startup")
async def load_model_and_scaler():
    """Загрузка модели и скалера при старте."""
    global model, scaler
    try:
        model = keras.models.load_model("models/model.h5")
        scaler = joblib.load("models/scaler.pkl")
        print(f"Input_shape: {model.input_shape[1]}")
    except FileNotFoundError:
        print("Модель и скалер не найдены. Создайте новую модель через /create-model или /start-training")
        model = None
        scaler = None


@app.get("/health")
async def health_check():
    """Проверка доступности сервиса."""
    return {"status": "ok"}

@app.post("/start-training")
async def start_training(request: ModelParametersAndTrainingRequest):
    """Начать обучение модели на загруженном CSV файле."""
    global model, scaler

    try:
        # Создание модели с правильным input_dim
        model = build_model_from_config(request.configModel)

        # Путь к CSV файлу
        csv_path = os.path.join(UPLOAD_DIR, request.params.file_name)

        if not os.path.exists(csv_path):
            raise HTTPException(status_code=404, detail=f"Файл {request.params.file_name} не найден")

        # Обучение модели
        history, scaler = train_model_from_csv(
            model=model,
            csv_path=csv_path,
            feature_columns=request.params.selectedFeatures,
            target_column=request.params.selectedTarget
        )

        # Сохранение скалера
        # scaler_path = os.path.join("models", "scaler.pkl")
        # joblib.dump(scaler, scaler_path)

        save_model(scaler)

        return {
            "message": "Обучение завершено",
            "epochs_trained": len(history.history['loss']),
            "final_loss": float(history.history['loss'][-1]),
            "final_val_loss": float(history.history['val_loss'][-1]) if 'val_loss' in history.history else None
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обучении: {str(e)}")


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
# async def create_model(params: ModelParameters):
#     global model
#     try:
#         model = build_model_from_config(params)

#         return {
#             "message": "Model created successfully",
#             "input_dim": params.input_dim,
#             "num_layers": len(params.layers),
#             "total_params": model.count_params()
#         }

#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/uploadCSV")
async def upload_csv(file: UploadFile = File(...)):
    """Загрузка CSV файла на сервер (макс. 1 ГБ)."""
    try:
        # Проверка расширения файла
        if not file.filename.endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Неверный формат файла. Загрузите файл с расширением .csv"
            )

        # Чтение файла в память для проверки размера
        contents = await file.read()
        file_size = len(contents)

        # Проверка размера файла
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Файл слишком большой. Максимальный размер: 1 ГБ. Размер файла: {file_size / (1024 * 1024 * 1024):.2f} ГБ"
            )

        if file_size == 0:
            raise HTTPException(status_code=400, detail="Файл пуст")

        # Сохранение файла на сервер
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        # Чтение заголовков CSV
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), nrows=0)
        headers = list(df.columns)

        return {
            "message": "Файл успешно загружен",
            "filename": file.filename,
            "size_bytes": file_size,
            "size_mb": round(file_size / (1024 * 1024), 2),
            "path": file_path,
            "headers": headers
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла: {str(e)}")


@app.post("/makemodel")
async def makemodel():
    return "model was made"
