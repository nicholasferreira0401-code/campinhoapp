from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_jogadores = os.path.join(BASE_DIR, "jogadores.csv")
csv_partidas = os.path.join(BASE_DIR, "partidas.csv")
csv_goleiros = os.path.join(BASE_DIR, "goleiro.csv")

# =====================
# CRIAR CSV SE NÃO EXISTIR
# =====================

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
        "time2_placar",
        "vencedor",
        "gol_time1",
        "gol_time2",
        "assistencia_time1",
        "assistencia_time2"
    ]).to_csv(csv_partidas, index=False)

if not os.path.exists(csv_goleiros):
    pd.DataFrame(columns=[
        "ID",
        "jogador",
        'time',
        "defesas"

    ]).to_csv(csv_goleiros, index=False)


# =====================
# ATUALIZAR OU CRIAR JOGADOR
# =====================

def atualizar_jogador(df, nome, campo, time):

    if not nome:
        return df

    nome = nome.strip()

    idx = (
        df["jogador"]
        .astype(str)
        .str.lower()
        ==
        nome.lower()
    )

    if idx.any():

        df.loc[idx, campo] += 1

        # atualizar time caso esteja vazio
        time_atual = (
            str(
                df.loc[idx, "time"]
                .iloc[0]
            )
            .strip()
            .lower()
        )

        if time_atual in ["", ""]:

            df.loc[idx, "time"] = time

    else:

        novo_id = (
            1
            if df.empty
            else int(df["ID_jogador"].max()) + 1
        )

        novo = {
            "ID_jogador": novo_id,
            "jogador": nome,
            "time": time,
            "gols": 0,
            "assistencias": 0,
            "total": 0
        }

        novo[campo] = 1
        novo["total"] = 1

        df.loc[len(df)] = novo

    return df


# =====================
# ATUALIZAR OU CRIAR GOLEIRO
# =====================

def atualizar_goleiro(df, nome, time):

    if not nome:
        return df

    nome = nome.strip()

    idx = (
        df["jogador"]
        .astype(str)
        .str.lower()
        ==
        nome.lower()
    )

    if idx.any():

        df.loc[idx, "defesas"] += 1

        # atualizar time caso esteja vazio
        time_atual = (
            str(
                df.loc[idx, "time"]
                .iloc[0]
            )
            .strip()
            .lower()
        )

        if time_atual in ["", ""]:

            df.loc[idx, "time"] = time

    else:

        novo_id = (
            1
            if df.empty
            else int(df["ID"].max()) + 1
        )

        novo = {
            "ID": novo_id,
            "jogador": nome,
            "time": time,
            "defesas": 1
        }

        df.loc[len(df)] = novo

    return df


# =====================
# ADICIONAR JOGADOR
# =====================

@app.route("/api/add_jogador", methods=["GET"])
def add_jogador():

    nome = request.args.get("jogador")
    time = request.args.get("time")

    if not nome:
        return jsonify({
            "erro": "Informe jogador"
        }), 400

    if not time:
        return jsonify({
            "erro": "Informe time"
        }), 400

    df = pd.read_csv(csv_jogadores)

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
        })

    novo_id = (
        1
        if df.empty
        else int(df["ID_jogador"].max()) + 1
    )

    novo = pd.DataFrame([{
        "ID_jogador": novo_id,
        "jogador": nome,
        "time": time,
        "gols": 0,
        "assistencias": 0,
        "total": 0
    }])

    df = pd.concat(
        [df, novo],
        ignore_index=True
    )

    df.to_csv(
        csv_jogadores,
        index=False
    )

    return jsonify({
        "mensagem": "Jogador criado",
        "jogador": nome
    })


# =====================
# ADICIONAR GOLEIRO
# =====================

@app.route("/api/add_goleiro", methods=["GET"])
def add_goleiro():

    nome = request.args.get("jogador")
    time = request.args.get("time")

    if not nome:
        return jsonify({
            "erro": "Informe jogador"
        }), 400

    if not time:
        return jsonify({
            "erro": "Informe time"
        }), 400

    df = pd.read_csv(csv_goleiros)

    existe = (
        df["jogador"]
        .astype(str)
        .str.lower()
        .eq(nome.lower())
        .any()
    )

    if existe:

        return jsonify({
            "mensagem": "Goleiro já existe"
        })

    novo_id = (
        1
        if df.empty
        else int(df["ID"].max()) + 1
    )

    novo = pd.DataFrame([{
        "ID": novo_id,
        "jogador": nome,
        "time": time,
        "defesas": 0
    }])

    df = pd.concat(
        [df, novo],
        ignore_index=True
    )

    df.to_csv(
        csv_goleiros,
        index=False
    )

    return jsonify({
        "mensagem": "Goleiro criado",
        "jogador": nome
    })



# =====================
# ADICIONAR PARTIDA
# =====================

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

    jogador1 = request.args.get(
        "gol_time1"
    )

    jogador2 = request.args.get(
        "gol_time2"
    )

    assist1 = request.args.get(
        "assistente_time1"
    )

    assist2 = request.args.get(
        "assistente_time2"
    )
    defesa1 = request.args.get(
        "defesa_time1")
    
    defesa2 = request.args.get(
        "defesa_time2")

    if not data:

        return jsonify({
            "erro": "Informe data"
        }), 400

    if time1 is None or time2 is None:

        return jsonify({
            "erro": "Informe placares"
        }), 400

    data = pd.to_datetime(
        data,
        errors="coerce"
    )

    if pd.isna(data):

        return jsonify({
            "erro": "Data inválida"
        }), 400

    partidas = pd.read_csv(
        csv_partidas
    )

    jogadores = pd.read_csv(
        csv_jogadores
    )

    goleiros = pd.read_csv(
        csv_goleiros
    )

    if goleiros.empty:

        goleiros = pd.DataFrame(columns=[
            "ID",
            "jogador",
            "time",
            "defesas"
        ])

    if jogadores.empty:

        jogadores = pd.DataFrame(columns=[
            "ID_jogador",
            "jogador",
            "time",
            "gols",
            "assistencias",
            "total"
        ])

    jogadores["gols"] = (
        pd.to_numeric(
            jogadores["gols"],
            errors="coerce"
        )
        .fillna(0)
        .astype(int)
    )

    jogadores["assistencias"] = (
        pd.to_numeric(
            jogadores["assistencias"],
            errors="coerce"
        )
        .fillna(0)
        .astype(int)
    )

    # atualizar automaticamente
    jogadores = atualizar_jogador(
        jogadores,
        jogador1,
        "gols",
        "time1"
    )

    jogadores = atualizar_jogador(
        jogadores,
        jogador2,
        "gols",
        "time2"
    )

    jogadores = atualizar_jogador(
        jogadores,
        assist1,
        "assistencias",
        "time1"
    )

    jogadores = atualizar_jogador(
        jogadores,
        assist2,
        "assistencias",
        "time2"
    )

    # atualizar goleiros automaticamente
    goleiros["defesas"] = (
        pd.to_numeric(
            goleiros["defesas"],
            errors="coerce"
        )
        .fillna(0)
        .astype(int)
    )

    goleiros = atualizar_goleiro(
        goleiros,
        defesa1,
        "time1"
    )

    goleiros = atualizar_goleiro(
        goleiros,
        defesa2,
        "time2"
    )

    jogadores["total"] = (
        jogadores["gols"]
        +
        jogadores["assistencias"]
    )

    vencedor = (
        "time1"
        if time1 > time2
        else
        "time2"
        if time2 > time1
        else
        "empate"
    )

    novo_id = (
        1
        if partidas.empty
        else int(partidas["ID"].max()) + 1
    )

    nova = pd.DataFrame([{
        "ID": novo_id,
        "data": data.strftime("%d/%m/%Y"),
        "time1_placar": time1,
        "time2_placar": time2,
        "vencedor": vencedor,
        "gol_time1": jogador1,
        "gol_time2": jogador2,
        "assistencia_time1": assist1,
        "assistencia_time2": assist2,
        "defesa_time1": defesa1,
        "defesa_time2": defesa2
    }])

    partidas = pd.concat(
        [partidas, nova],
        ignore_index=True
    )

    partidas.to_csv(
        csv_partidas,
        index=False
    )

    jogadores.to_csv(
        csv_jogadores,
        index=False
    )

    goleiros.to_csv(
        csv_goleiros,
        index=False
    )

    return jsonify({
        "mensagem": "Partida registrada",
        "ID": novo_id,
        "vencedor": vencedor,
        "data": data.strftime("%d/%m/%Y"),
        "jogador1": jogador1,
        "jogador2": jogador2,
        "assistente1": assist1,
        "assistente2": assist2,
        "defesa1": defesa1,
        "defesa2": defesa2
    })

@app.route("/api/jogadores_df", methods=["GET"])
def jogadores_df():
    return jsonify(
        pd.read_csv(csv_jogadores).to_dict(orient="records")
    )

@app.route("/api/goleiros_df", methods=["GET"])
def goleiros_df():
    return jsonify(
        pd.read_csv(csv_goleiros).to_dict(orient="records")
    )

@app.route('/api/partidas_df', methods=["GET"])
def partidas_df():
    return jsonify(
        pd.read_csv(csv_partidas).to_dict(orient="records")
    )


if __name__ == "__main__":
    app.run(debug=True)