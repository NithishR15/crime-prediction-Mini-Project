from flask import Flask
import os

app = Flask(__name__)

@app.route("http://localhost:5173/")
def home():
    return "Crime Prediction System Running Online"

if __name__ == "__main__":
    app.run(host="http://localhost:5173/", port=int(os.environ.get("PORT", 5000)))
