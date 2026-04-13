import os

from src.saveModel import save_model
from src.data_loader import load_data, test_data
from src.preprocessing import scale_data
from src.model import build_defuelt_model, build_model_from_config
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

    # Сохраняем сырые данные для теста финальной модели
    X_test_raw = X_test.copy()

    # 2. Препроцессинг
    X_train, X_test, scaler = scale_data(X_train, X_test)

    # 3. Модель
    model = build_defuelt_model(X_train.shape[1])
    # model = build_model_from_config(X_train.shape[1])

    # 4. Обучение
    train_model(model, X_train, y_train)

    # 5. Оценка
    evaluate_model(model, X_test, y_test)

    # 6. Сохранение модели с нормализацией
    finishModel = save_model(scaler)

    # 7. Тест модели с нормализацией на сырых данных
    print("\n=== Тест модели с нормализацией на сырых данных ===")
    evaluate_model(finishModel, X_test_raw, y_test)


    


if __name__ == "__main__":
    main()