from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

csv_jogadores = "jogadores.csv"
csv_partidas = "partidas.csv"


# Criar CSVs
if not os.path.exists(csv_jogadores):
    pd.DataFrame(columns=[
        "ID_jogador",
        "jogador",
        "time",
        "gols",
        "assistencias",
        "total"
    ]).to_csv(csv_jogadores, index=False)


if not os.path.exists(csv_partidas):
    pd.DataFrame(columns=[
        "ID",
        "data",
        "time1_placar",
        "time2_placar"
    ]).to_csv(csv_partidas, index=False)


@app.route("/api/add_jogador", methods=["GET"])
def adicionar_jogador():

    nome = request.args.get("jogador")
    time = request.args.get("time")

    gols = request.args.get("gols", type=int, default=0)
    assistencias = request.args.get(
        "assistencias",
        type=int,
        default=0
    )

    if not nome:
        return jsonify({"erro": "Informe jogador"}), 400

    if not time:
        return jsonify({"erro": "Informe time"}), 400

    total = gols + assistencias

    df = pd.read_csv(csv_jogadores)

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

    df.to_csv(csv_jogadores, index=False)

    return jsonify(novo.iloc[0].to_dict())


@app.route("/api/partidas", methods=["GET"])
def add_partida():

    data = request.args.get("data")

    time1 = request.args.get(
        "time1_placar",
        type=int
    )

    time2 = request.args.get(
        "time2_placar",
        type=int
    )

    if not data:
        return jsonify({
            "erro": "Informe data"
        }), 400

    if time1 is None or time2 is None:
        return jsonify({
            "erro": "Informe os dois placares"
        }), 400

    df = pd.read_csv(csv_partidas)

    data = pd.to_datetime(
        data,
        errors="coerce"
    )

    if pd.isna(data):
        return jsonify({
            "erro": "Data inválida"
        }), 400

    novo_id = 1 if df.empty else int(df["ID"].max()) + 1

    nova = pd.DataFrame([{
        "ID": novo_id,
        "data": data.strftime("%d-%m-%y"),
        "time1_placar": time1,
        "time2_placar": time2
    }])

    df = pd.concat([df, nova], ignore_index=True)

    df.to_csv(csv_partidas, index=False)

    return jsonify({
        "mensagem": "Partida adicionada",
        "ID": novo_id
    })


if __name__ == "__main__":
    app.run(debug=True)