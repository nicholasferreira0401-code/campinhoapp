from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

csv_jogadores = "jogadores.csv"



@app.route("/api/add_jogador", methods=["GET"])
def adicionar_jogador():

    nome = request.args.get("jogador")
    time = request.args.get("time")

    # Se não vier, assume 0
    gols = int(request.args.get("gols", 0))
    assistencias = int(request.args.get("assistencias", 0))

    total = gols + assistencias

    # Validações
    if not nome:
        return jsonify({
            "erro": "Informe o parâmetro jogador"
        }), 400

    if not time:
        return jsonify({
            "erro": "Informe o time do jogador"
        }), 400

    # Ler CSV
    df = pd.read_csv(csv_jogadores)

    # Evitar duplicados
    if not df.empty:

        existe = (
            df["jogador"]
            .astype(str)
            .str.lower()
            .eq(nome.lower())
            .any()
        )

        if existe:
            return jsonify({
                "erro": "Jogador já existe"
            }), 400

    # Gerar ID
    novo_id = 1 if df.empty else int(df["ID_jogador"].max()) + 1

    novo = pd.DataFrame([{
        "ID_jogador": novo_id,
        "jogador": nome,
        "time": time,
        "gols": gols,
        "assistencias": assistencias,
        "total": total
    }])

    df = pd.concat([df, novo], ignore_index=True)

    # Salvar
    df.to_csv(csv_jogadores, index=False)

    return jsonify({
        "mensagem": "Jogador adicionado",
        "ID_jogador": novo_id,
        "jogador": nome,
        "time": time,
        "gols": gols,
        "assistencias": assistencias,
        "total": total
    })


if __name__ == "__main__":
    app.run(debug=True)