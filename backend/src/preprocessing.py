from sklearn.preprocessing import StandardScaler
import joblib


def scale_data(X_train, X_test, save_path="models/scaler.pkl"):
    scaler = StandardScaler()

    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    joblib.dump(scaler, save_path)

    return X_train, X_test, scaler