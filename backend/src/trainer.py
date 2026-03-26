import pandas as pd
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from config import EPOCHS, BATCH_SIZE, MODEL_PATH


def train_model(model, X_train, y_train):
    """Обучение модели с callbacks."""

    callbacks = [
        EarlyStopping(patience=5, restore_best_weights=True),
        ModelCheckpoint(MODEL_PATH, save_best_only=True)
    ]

    history = model.fit(
        X_train,
        y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=0.2,
        callbacks=callbacks,
        verbose=1
    )

    return history


def train_model_from_csv(model, csv_path, feature_columns, target_column):
    """
    Обучение модели на данных из CSV файла.
    
    Args:
        model: Keras модель для обучения
        csv_path: Путь к CSV файлу
        feature_columns: Список колонок-признаков
        target_column: Название целевой колонки
    """
    # Загрузка данных
    df = pd.read_csv(csv_path)
    
    # Разделение на признаки и целевую переменную
    X = df[feature_columns].values
    y = df[target_column].values
    
    # Нормализация признаков
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    callbacks = [
        EarlyStopping(patience=5, restore_best_weights=True),
        ModelCheckpoint(MODEL_PATH, save_best_only=True)
    ]
    
    history = model.fit(
        X_scaled,
        y,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=0.2,
        callbacks=callbacks,
        verbose=1
    )
    
    return history, scaler