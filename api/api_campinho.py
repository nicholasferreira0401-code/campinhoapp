from flask import Flask, request, jsonify
import pandas as pd
import os
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
        if time_atual in ["", "nan", "none"]:
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
        if time_atual in ["", "nan", "none"]:
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
# Certifique-se de adicionar 'GET' na lista de métodos permitidos
@app.route("/api/partidas", methods=["GET", "POST"])
def gerenciar_partidas():
    
    # --- COMPORTAMENTO GET (Listar Partidas na Tabela/Dashboard) ---
    if request.method == "GET":
        try:
            df = pd.read_csv(csv_partidas)
            # Trata valores nulos para não quebrar o JSON do React
            df = df.astype(object).where(pd.notnull(df), None)
            return jsonify(df.to_dict(orient="records")), 200
        except Exception as e:
            return jsonify({"erro": f"Erro ao ler partidas: {str(e)}"}), 500

    # --- COMPORTAMENTO POST (Adicionar Nova Partida via Formulário) ---
    if request.method == "POST":
        dados = request.get_json()
        if not dados:
            return jsonify({"erro": "Nenhum dado enviado"}), 400

        data = dados.get("data")
        time1 = dados.get("time1_placar")
        time2 = dados.get("time2_placar")
        
        jogador1 = dados.get("gol_time1")
        jogador2 = dados.get("gol_time2")
        assist1 = dados.get("assistente_time1")
        assist2 = dados.get("assistente_time2")

        nome_goleiro1 = dados.get("goleiro_time1")
        defesa1 = dados.get("defesa_time1", 0)
        nome_goleiro2 = dados.get("goleiro_time2")
        defesa2 = dados.get("defesa_time2", 0)

        try:
            time1 = int(time1) if time1 is not None else 0
            time2 = int(time2) if time2 is not None else 0
            defesa1 = int(defesa1) if defesa1 is not None else 0
            defesa2 = int(defesa2) if defesa2 is not None else 0
        except ValueError:
            return jsonify({"erro": "Placares e defesas devem ser números válidos"}), 400

        if not data:
            return jsonify({"erro": "Informe uma data válida"}), 400

        data_convertida = pd.to_datetime(data, errors="coerce")
        if pd.isna(data_convertida):
            return jsonify({"erro": "Data inválida"}), 400

        # Carrega os arquivos CSV existentes
        partidas = pd.read_csv(csv_partidas)
        jogadores = pd.read_csv(csv_jogadores)
        goleiros = pd.read_csv(csv_goleiros)

        jogadores["gols"] = pd.to_numeric(jogadores["gols"], errors="coerce").fillna(0).astype(int)
        jogadores["assistencias"] = pd.to_numeric(jogadores["assistencias"], errors="coerce").fillna(0).astype(int)
        goleiros["defesas"] = pd.to_numeric(goleiros["defesas"], errors="coerce").fillna(0).astype(int)

        # Atualiza estatísticas dos jogadores
        for scorer in parse_nomes(jogador1):
            jogadores = atualizar_jogador(jogadores, scorer, "gols", "time1")
        for scorer in parse_nomes(jogador2):
            jogadores = atualizar_jogador(jogadores, scorer, "gols", "time2")
        for assistente in parse_nomes(assist1):
            jogadores = atualizar_jogador(jogadores, assistente, "assistencias", "time1")
        for assistente in parse_nomes(assist2):
            jogadores = atualizar_jogador(jogadores, assistente, "assistencias", "time2")

        jogadores["total"] = jogadores["gols"] + jogadores["assistencias"]

        # Atualiza estatísticas dos goleiros
        if nome_goleiro1 and defesa1 > 0:
            goleiros = atualizar_goleiro(goleiros, nome_goleiro1, defesa1, "time1")
        if nome_goleiro2 and defesa2 > 0:
            goleiros = atualizar_goleiro(goleiros, nome_goleiro2, defesa2, "time2")

        # Define quem venceu o confronto
        vencedor = "time1" if time1 > time2 else "time2" if time2 > time1 else "empate"

        # Incrementa o ID da partida de forma dinâmica
        novo_id = 1 if partidas.empty else int(partidas["ID"].max()) + 1
        
        # Monta a estrutura final mantendo compatibilidade com o CSV
        nova_partida_dict = {
            "ID": novo_id,
            "data": data_convertida.strftime("%d/%m/%Y"),
            "time1_placar": time1,
            "time2_placar": time2,
            "vencedor": vencedor,
            "gol_time1": jogador1 if jogador1 else None,
            "gol_time2": jogador2 if jogador2 else None,
            "assistente_time1": assist1 if assist1 else None, # Ajustado para o plural padrão
            "assistente_time2": assist2 if assist2 else None, # Ajustado para o plural padrão
            "goleiro_time1": nome_goleiro1 if nome_goleiro1 else None,
            "defesa_time1": defesa1,
            "goleiro_time2": nome_goleiro2 if nome_goleiro2 else None,
            "defesa_time2": defesa2
        }

        # Concatena a nova linha no dataframe de partidas
        nova = pd.DataFrame([nova_partida_dict])
        partidas = pd.concat([partidas, nova], ignore_index=True)

        # Salva as atualizações de volta nos arquivos CSV
        partidas.to_csv(csv_partidas, index=False)
        jogadores.to_csv(csv_jogadores, index=False)
        goleiros.to_csv(csv_goleiros, index=False)

        return jsonify(nova_partida_dict), 201
    
    
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
    app.run(debug=True)