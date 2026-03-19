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
    # Обучение модели
    history, scaler = train_model_from_csv(
        model=model,
        csv_path=csv_path,
        feature_columns=feature_columns,
        target_column=target_column
    )
    
    return history, scaler