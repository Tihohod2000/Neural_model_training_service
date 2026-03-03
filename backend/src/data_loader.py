import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from config import TEST_SIZE, RANDOM_STATE


def generate_data(n_samples: int = 1000, n_features: int = 20):
    """Генерация синтетических данных для тестирования."""
    X, y = make_classification(
        n_samples=n_samples,
        n_features=n_features,
        n_informative=15,
        n_redundant=5,
        random_state=RANDOM_STATE
    )
    return X, y

def test_data():
    X, y = generate_data(n_samples=1000, n_features=20)   
    return train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

def load_data(path: str):
    df = pd.read_csv(path)

    X = df.drop("target", axis=1).values
    y = df["target"].values

    return train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE
    )