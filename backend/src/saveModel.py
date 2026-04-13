from tensorflow import keras
from config import MODEL_PATH


def save_model(scaler):
    # Загружаем лучшую сохранённую модель
    old_model = keras.models.load_model(MODEL_PATH)
    
    # Получаем параметры scaler
    mean = scaler.mean_
    variance = scaler.var_

    # Получаем размерность входа из модели
    input_dim = old_model.input_shape[-1]
    
    # Новый вход
    inputs = keras.Input(shape=(input_dim,))
    
    # Слой нормализации
    norm_layer = keras.layers.Normalization(
        mean=mean,
        variance=variance
    )
    
    x = norm_layer(inputs)
    outputs = old_model(x)
    
    final_model = keras.Model(inputs, outputs)
    
    # Сохраняем финальную модель
    final_model.save("models/finish_model_with_norm.keras")
    
    # Проверка сохранённой модели
    print("\n=== Проверка модели с нормализацией ===")
    loaded_model = keras.models.load_model("models/finish_model_with_norm.keras")
    
    # Проверка архитектуры
    print(f"Входной размер: {loaded_model.input_shape}")
    print(f"Выходной размер: {loaded_model.output_shape}")
    print(f"Количество слоёв: {len(loaded_model.layers)}")
    print(f"Первый слой: {loaded_model.layers[0].name} ({type(loaded_model.layers[0]).__name__})")
    print(f"Второй слой: {loaded_model.layers[1].name} ({type(loaded_model.layers[1]).__name__})")
    
    # print("\n✅ Модель успешно сохранена и проверена!")
    
    return final_model