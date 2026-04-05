# Базовый образ Python
FROM python:3.11-slim

# Рабочая директория
WORKDIR /app

# Копирование зависимостей
COPY requirements.txt .

# Установка зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода
COPY . .

# Создание директории для моделей
RUN mkdir -p models uploads

# Порт
EXPOSE 8000

# Запуск сервера
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
