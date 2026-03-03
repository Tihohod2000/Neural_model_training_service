from sklearn.metrics import accuracy_score


def evaluate_model(model, X_test, y_test):
    predictions = (model.predict(X_test) > 0.5).astype(int)
    acc = accuracy_score(y_test, predictions)

    print(f"Test Accuracy: {acc:.4f}")
    return acc