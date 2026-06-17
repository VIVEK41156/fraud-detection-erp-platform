from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Model
# -----------------------------
model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")

# -----------------------------
# Health Check
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Fraud ML Service Running"
    })

# -----------------------------
# Predict Fraud
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        features = np.array([
            [
                float(data["amount"]),
                float(data["locationRisk"]),
                float(data["deviceRisk"]),
                float(data["merchantRisk"]),
                float(data["velocityRisk"]),
                float(data["spendingSpike"])
            ]
        ])

        scaled_features = scaler.transform(features)

        prediction = model.predict(scaled_features)[0]
        probability = model.predict_proba(scaled_features)[0][1]

        return jsonify({
            "success": True,
            "isFraud": bool(prediction),
            "riskScore": round(float(probability) * 100, 2)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# -----------------------------
# Start Server (Render Compatible)
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )