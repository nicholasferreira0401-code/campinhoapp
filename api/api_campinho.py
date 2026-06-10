from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

ARQUIVO = "jogadores.csv"


# Criar arquivo se não existir
if not os.path.exists(ARQUIVO):
    df = pd.DataFrame(columns=["ID_jogador", "jogador"])
    df.to_csv(ARQUIVO, index=False)


@app.route("/api/add_jogador", methods=["GET"])
def adicionar_jogador():

    nome = request.args.get("jogador")

    if not nome:
        return jsonify({
            "erro": "Informe o parâmetro jogador"
        }), 400

    # Ler CSV
    df = pd.read_csv(ARQUIVO)

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
                "mensagem": "Jogador já existe"
            }), 400

    # Gerar ID
    novo_id = 1 if df.empty else df["ID_jogador"].max() + 1

    novo = pd.DataFrame([{
        "ID_jogador": novo_id,
        "jogador": nome
    }])

    df = pd.concat([df, novo], ignore_index=True)

    # Salvar
    df.to_csv(ARQUIVO, index=False)

    return jsonify({
        "mensagem": "Jogador adicionado",
        "ID_jogador": int(novo_id),
        "jogador": nome
    })


if __name__ == "__main__":
    app.run(debug=True)