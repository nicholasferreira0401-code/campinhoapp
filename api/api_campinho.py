from flask import Flask, request, jsonify
import pandas as pd
import os
import re
from flask_cors import CORS

app = Flask(__name__)
# Permite chamadas de qualquer origem (inclusive localhost:5173) e trata o preflight de CORS de forma nativa
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_jogadores = os.path.join(BASE_DIR, "jogadores.csv")
csv_partidas = os.path.join(BASE_DIR, "partidas.csv")
csv_goleiros = os.path.join(BASE_DIR, "goleiro.csv")

# =====================
# CRIAR CSV SE NÃO EXISTIR
# =====================

if not os.path.exists(csv_jogadores):
    pd.DataFrame(columns=[
        "ID_jogador", "jogador", "time", "gols", "assistencias", "total"
    ]).to_csv(csv_jogadores, index=False)

if not os.path.exists(csv_partidas):
    pd.DataFrame(columns=[
        "ID", "data", "time1_placar", "time2_placar", "vencedor",
        "gol_time1", "gol_time2", "assistencia_time1", "assistencia_time2",
        "goleiro_time1", "defesa_time1", "goleiro_time2", "defesa_time2"
    ]).to_csv(csv_partidas, index=False)

if not os.path.exists(csv_goleiros):
    pd.DataFrame(columns=[
        "ID", "jogador", "time", "defesas"
    ]).to_csv(csv_goleiros, index=False)


# =====================
# FUNÇÕES AUXILIARES
# =====================

def atualizar_jogador(df, nome, campo, time):
    if not nome:
        return df

    nome = str(nome).strip()
    idx = df["jogador"].astype(str).str.lower() == nome.lower()

    if idx.any():
        df.loc[idx, campo] += 1
        time_atual = str(df.loc[idx, "time"].iloc[0]).strip().lower()
        if time_atual in ["", "nan", "none", "nulo", "não definido"]:
            df.loc[idx, "time"] = time
    else:
        novo_id = 1 if df.empty else int(df["ID_jogador"].max()) + 1
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


def parse_nomes(valor):
    if not valor:
        return []
    texto = str(valor)
    partes = [p.strip() for p in re.split(r"[;,\n]+", texto) if p.strip()]
    return partes


def atualizar_goleiro(df, nome, quantidade_defesas, time):
    if not nome or quantidade_defesas <= 0:
        return df

    nome = str(nome).strip()
    idx = df["jogador"].astype(str).str.lower() == nome.lower()

    if idx.any():
        df.loc[idx, "defesas"] += quantidade_defesas
        time_atual = str(df.loc[idx, "time"].iloc[0]).strip().lower()
        if time_atual in ["", "nan", "none", "nulo", "não definido"]:
            df.loc[idx, "time"] = time
    else:
        novo_id = 1 if df.empty else int(df["ID"].max()) + 1
        novo = {
            "ID": novo_id,
            "jogador": nome,
            "time": time,
            "defesas": quantidade_defesas
        }
        df.loc[len(df)] = novo

    return df


# =====================
# ROTAS DE ADIÇÃO INDIVIDUAL
# =====================

@app.route("/api/add_jogador", methods=["GET"])
def add_jogador():
    nome = request.args.get("jogador")
    time = request.args.get("time")

    if not nome or not time:
        return jsonify({"erro": "Informe jogador e time"}), 400

    df = pd.read_csv(csv_jogadores)
    existe = df["jogador"].astype(str).str.lower().eq(nome.lower()).any()

    if existe:
        return jsonify({"mensagem": "Jogador já existe"})

    novo_id = 1 if df.empty else int(df["ID_jogador"].max()) + 1
    novo = pd.DataFrame([{
        "ID_jogador": novo_id,
        "jogador": nome,
        "time": time,
        "gols": 0,
        "assistencias": 0,
        "total": 0
    }])

    df = pd.concat([df, novo], ignore_index=True)
    df.to_csv(csv_jogadores, index=False)

    return jsonify({"mensagem": "Jogador criado", "jogador": nome})


@app.route("/api/add_goleiro", methods=["GET"])
def add_goleiro():
    nome = request.args.get("jogador")
    time = request.args.get("time")

    if not nome or not time:
        return jsonify({"erro": "Informe jogador e time"}), 400

    df = pd.read_csv(csv_goleiros)
    existe = df["jogador"].astype(str).str.lower().eq(nome.lower()).any()

    if existe:
        return jsonify({"mensagem": "Goleiro já existe"})

    novo_id = 1 if df.empty else int(df["ID"].max()) + 1
    novo = pd.DataFrame([{
        "ID": novo_id,
        "jogador": nome,
        "time": time,
        "defesas": 0
    }])

    df = pd.concat([df, novo], ignore_index=True)
    df.to_csv(csv_goleiros, index=False)

    return jsonify({"mensagem": "Goleiro criado", "jogador": nome})


# =====================
# ROTAS PRINCIPAIS (PARTIDAS UNIFICADAS GET E POST)
# =====================

# =====================
# ROTAS PRINCIPAIS (PARTIDAS UNIFICADAS GET E POST)
# =====================

@app.route("/api/partidas_df", methods=["GET", "POST", "OPTIONS"])
def gerenciar_partidas():

    if request.method == "OPTIONS":
        return "", 204

    # ==================
    # GET
    # ==================
    # ==================
    # GET
    # ==================
    if request.method == "GET":

        try:

            if (
                not os.path.exists(csv_partidas)
                or os.stat(csv_partidas).st_size == 0
            ):
                return jsonify([])

            df = pd.read_csv(
                csv_partidas,
                keep_default_na=False
            )

            if df.empty:
                return jsonify([])

            # ordenar corretamente
            if "data" in df.columns:

                df["data_ord"] = pd.to_datetime(
                    df["data"],
                    errors="coerce",
                    dayfirst=True
                )

                df["ID"] = pd.to_numeric(
                    df["ID"],
                    errors="coerce"
                )

                df = (
                    df
                    .sort_values(
                        by=["data_ord", "ID"],
                        ascending=[False, False],
                        na_position="last"
                    )
                    .drop(columns=["data_ord"])
                )

            else:

                df["ID"] = pd.to_numeric(
                    df["ID"],
                    errors="coerce"
                )

                df = df.sort_values(
                    by="ID",
                    ascending=False
                )

            # últimas partidas
            df = df.head(30)

            df = df.fillna("")

            return jsonify(
                df.to_dict(
                    orient="records"
                )
            )

        except Exception as e:

            return jsonify({
                "erro": str(e)
            }), 500

    # ==================
    # POST
    # ==================

    if request.method == "POST":
        
        try:

            dados = request.get_json()

            if not dados:
                return jsonify({
                    "erro": "Dados inválidos"
                }), 400

            partidas = pd.read_csv(csv_partidas)

            novo_id = (
                1
                if partidas.empty
                else int(
                    partidas["ID"].max()
                ) + 1
            )

            time1 = int(
                dados.get(
                    "time1_placar",
                    0
                )
            )

            time2 = int(
                dados.get(
                    "time2_placar",
                    0
                )
            )

            vencedor = (
                "Time 1"
                if time1 > time2
                else "Time 2"
                if time2 > time1
                else "Empate"
            )

            nova = {

                "ID":
                novo_id,

                "data": pd.to_datetime(
                    dados.get("data"),
                    dayfirst=True,
                    errors="coerce"
                ).strftime("%d/%m/%Y"),

                "time1_placar":
                time1,

                "time2_placar":
                time2,

                "vencedor":
                vencedor,

                "gol_time1":
                dados.get(
                    "gol_time1"
                ),

                "gol_time2":
                dados.get(
                    "gol_time2"
                ),

                "assistencia_time1":
                dados.get(
                    "assistencia_time1"
                ),

                "assistencia_time2":
                dados.get(
                    "assistencia_time2"
                ),

                "goleiro_time1":
                dados.get(
                    "goleiro_time1"
                ),

                "defesa_time1":
                dados.get(
                    "defesa_time1"
                ),

                "goleiro_time2":
                dados.get(
                    "goleiro_time2"
                ),

                "defesa_time2":
                dados.get(
                    "defesa_time2"
                )
            }

            partidas = pd.concat(
                [
                    partidas,
                    pd.DataFrame(
                        [nova]
                    )
                ],
                ignore_index=True
            )

            # =====================
            # ATUALIZAR JOGADORES
            # =====================

            # =====================
            # ATUALIZAR JOGADORES
            # =====================

            jogadores = pd.read_csv(
                csv_jogadores,
                keep_default_na=False
            )

            for nome in parse_nomes(
                dados.get("gol_time1")
            ):
                jogadores = atualizar_jogador(
                    jogadores,
                    nome,
                    "gols",
                    "time1"
                )

            for nome in parse_nomes(
                dados.get("gol_time2")
            ):
                jogadores = atualizar_jogador(
                    jogadores,
                    nome,
                    "gols",
                    "time2"
                )

            for nome in parse_nomes(
                dados.get("assistencia_time1")
            ):
                jogadores = atualizar_jogador(
                    jogadores,
                    nome,
                    "assistencias",
                    "time1"
                )

            for nome in parse_nomes(
                dados.get("assistencia_time2")
            ):
                jogadores = atualizar_jogador(
                    jogadores,
                    nome,
                    "assistencias",
                    "time2"
                )

            # recalcular total

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

            jogadores["total"] = (
                jogadores["gols"]
                +
                jogadores["assistencias"]
            )

            # salvar

            partidas.to_csv(
                csv_partidas,
                index=False
            )

            jogadores.to_csv(
                csv_jogadores,
                index=False
            )

            return jsonify(
                nova
            ), 201
        
        except Exception as e:

            return jsonify({
                "erro": str(e)
            }), 500
# =====================
# ROTAS DE CONSULTA RESTANTES
# =====================

@app.route("/api/goleiros_df", methods=["GET"])
def goleiros_df():
    df = pd.read_csv(csv_goleiros)
    df = df.where(pd.notnull(df), None)
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/jogadores_df", methods=["GET"])
def jogadores_df():
    df = pd.read_csv(csv_jogadores)
    df = df.where(pd.notnull(df), None)
    return jsonify(df.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)