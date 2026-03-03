import os

from src.data_loader import load_data, test_data
from src.preprocessing import scale_data
from src.model import build_model, build_model_from_config
from src.trainer import train_model
from src.evaluator import evaluate_model

os.makedirs("models", exist_ok=True)

def main(use_synthetic: bool = True):
    """Запуск пайплайна обучения модели."""

    # 1. Загрузка данных
    if use_synthetic:
        X_train, X_test, y_train, y_test =  test_data()
    else:
        X_train, X_test, y_train, y_test = load_data("data/dataset.csv")

    # 2. Препроцессинг
    X_train, X_test = scale_data(X_train, X_test)

    # 3. Модель
    model = build_model(X_train.shape[1])
    model2 = build_model_from_config(X_train.shape[1])

    # 4. Обучение
    train_model(model2, X_train, y_train)

    # 5. Оценка
    evaluate_model(model2, X_test, y_test)


if __name__ == "__main__":
    main()