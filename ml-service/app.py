from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Model
# -----------------------------
model = joblib.load(
    "model/model.pkl"
)

scaler = joblib.load(
    "model/scaler.pkl"
)

# -----------------------------
# Health Check
# -----------------------------
@app.route("/")
def home():
    return jsonify({
        "message":
        "Fraud ML Service Running"
    })


# -----------------------------
# Predict Fraud
# -----------------------------
@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:
        data = request.json

        features = np.array([
            [
                data["amount"],
                data["locationRisk"],
                data["deviceRisk"],
                data["merchantRisk"],
                data["velocityRisk"],
                data["spendingSpike"]
            ]
        ])

        scaled_features = (
            scaler.transform(
                features
            )
        )

        prediction = (
            model.predict(
                scaled_features
            )[0]
        )

        probability = (
            model.predict_proba(
                scaled_features
            )[0][1]
        )

        return jsonify({
            "success": True,
            "isFraud":
            bool(prediction),
            "riskScore":
            round(
                probability * 100,
                2
            )
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(
        debug=True,
        port=8000
    )