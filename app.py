from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  

@app.route("/")
def home():
    return "Crime Prediction System Running Online"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
