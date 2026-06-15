import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# -----------------------------
# Generate Dummy Fraud Dataset
# -----------------------------
np.random.seed(42)

data_size = 5000

data = {
    "amount": np.random.randint(
        100,
        100000,
        data_size
    ),

    "locationRisk":
    np.random.randint(
        0, 2, data_size
    ),

    "deviceRisk":
    np.random.randint(
        0, 2, data_size
    ),

    "merchantRisk":
    np.random.randint(
        0, 2, data_size
    ),

    "velocityRisk":
    np.random.randint(
        0, 2, data_size
    ),

    "spendingSpike":
    np.random.randint(
        0, 2, data_size
    ),

    "isFraud":
    np.random.randint(
        0, 2, data_size
    ),
}

df = pd.DataFrame(data)

# -----------------------------
# Features & Target
# -----------------------------
X = df.drop(
    "isFraud",
    axis=1
)

y = df["isFraud"]

# -----------------------------
# Scaling
# -----------------------------
scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = (
    train_test_split(
        X_scaled,
        y,
        test_size=0.2,
        random_state=42
    )
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

# -----------------------------
# Accuracy
# -----------------------------
predictions = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Model Accuracy: {accuracy}"
)

# -----------------------------
# Save Model
# -----------------------------
os.makedirs(
    "model",
    exist_ok=True
)

joblib.dump(
    model,
    "model/model.pkl"
)

joblib.dump(
    scaler,
    "model/scaler.pkl"
)

print(
    "Model saved successfully!"
)