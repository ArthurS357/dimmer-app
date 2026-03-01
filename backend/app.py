from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# O estado agora inclui o relé (relay_on)
state = {"intensity": 0, "power": True, "relay_on": False}

# Nível de intensidade que aciona o relé
RELAY_THRESHOLD = 50


@app.route("/api/intensity", methods=["POST"])
def set_intensity():
    data = request.get_json()
    if "intensity" in data:
        state["intensity"] = data["intensity"]

        # Lógica do relé: ativa se a intensidade for maior ou igual ao limite
        state["relay_on"] = state["intensity"] >= RELAY_THRESHOLD

        return jsonify({"ok": True, "state": state})
    return jsonify({"error": "Parâmetro 'intensity' ausente"}), 400


@app.route("/api/toggle", methods=["POST"])
def toggle():
    state["power"] = not state["power"]
    # Se desligar a energia geral, desliga o relé também
    if not state["power"]:
        state["relay_on"] = False
    else:
        # Se ligar, reavalia a condição do relé
        state["relay_on"] = state["intensity"] >= RELAY_THRESHOLD

    return jsonify({"ok": True, "state": state})


@app.route("/api/status", methods=["GET"])
def status():
    return jsonify(state)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
