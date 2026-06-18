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
    
    # --- COMPORTAMENTO GET (Listar Partidas na Tabela/Dashboard) ---
    if request.method == "GET":
        try:
            if not os.path.exists(csv_partidas) or os.stat(csv_partidas).st_size == 0:
                return jsonify([]), 200
                
            df = pd.read_csv(csv_partidas)
            
            # Força a conversão de qualquer NaN residual do arquivo para None (null no JSON)
            df = df.replace({pd.NA: None, float('nan'): None})
            df = df.where(pd.notnull(df), None)
            
            return jsonify(df.to_dict(orient="records")), 200
        except Exception as e:
            return jsonify({"erro": f"Erro ao ler partidas: {str(e)}"}), 500

    # --- COMPORTAMENTO POST (Adicionar Nova Partida via Formulário) ---
    if request.method == "POST":
        dados = request.get_json()
        if not dados:
            return jsonify({"erro": "Nenhum dado enviado"}), 400

        # O único item estritamente obrigatório é a data
        data = dados.get("data")
        if not data or str(data).strip() == "":
            return jsonify({"erro": "Informe uma data válida"}), 400

        data_convertida = pd.to_datetime(data, errors="coerce")
        if pd.isna(data_convertida):
            return jsonify({"erro": "Data inválida"}), 400

        # Função interna rápida para tratar números vazios, nulos ou strings inválidas
        def normalizar_int(valor):
            if valor is None or str(valor).strip() == "":
                return 0
            try:
                return int(valor)
            except ValueError:
                return 0

        # Função interna para tratar strings vazias
        def normalizar_txt(valor):
            if valor is None or str(valor).strip() == "":
                return None
            return str(valor).strip()

        # Coleta e normaliza de forma segura todos os campos do request
        time1 = normalizar_int(dados.get("time1_placar"))
        time2 = normalizar_int(dados.get("time2_placar"))
        defesa1 = normalizar_int(dados.get("defesa_time1"))
        defesa2 = normalizar_int(dados.get("defesa_time2"))

        jogador1 = normalizar_txt(dados.get("gol_time1"))
        jogador2 = normalizar_txt(dados.get("gol_time2"))
        assist1 = normalizar_txt(dados.get("assistente_time1"))
        assist2 = normalizar_txt(dados.get("assistente_time2"))

        nome_goleiro1 = normalizar_txt(dados.get("goleiro_time1"))
        nome_goleiro2 = normalizar_txt(dados.get("goleiro_time2"))

        # Carrega os arquivos CSV existentes
        partidas = pd.read_csv(csv_partidas)
        jogadores = pd.read_csv(csv_jogadores)
        goleiros = pd.read_csv(csv_goleiros)

        # Força tipagem correta nas tabelas de histórico antes de atualizar
        jogadores["gols"] = pd.to_numeric(jogadores["gols"], errors="coerce").fillna(0).astype(int)
        jogadores["assistencias"] = pd.to_numeric(jogadores["assistencias"], errors="coerce").fillna(0).astype(int)
        goleiros["defesas"] = pd.to_numeric(goleiros["defesas"], errors="coerce").fillna(0).astype(int)

        # Processa os nomes apenas se existirem dados válidos
        if jogador1:
            for scorer in parse_nomes(jogador1):
                jogadores = atualizar_jogador(jogadores, scorer, "gols", "Time 1")
        if jogador2:
            for scorer in parse_nomes(jogador2):
                jogadores = atualizar_jogador(jogadores, scorer, "gols", "Time 2")
        if assist1:
            for assistente in parse_nomes(assist1):
                jogadores = atualizar_jogador(jogadores, assistente, "assistencias", "Time 1")
        if assist2:
            for assistente in parse_nomes(assist2):
                jogadores = atualizar_jogador(jogadores, assistente, "assistencias", "Time 2")

        jogadores["total"] = jogadores["gols"] + jogadores["assistencias"]

        # Atualiza goleiros se houver nome válido e defesas maiores que 0
        if nome_goleiro1 and defesa1 > 0:
            goleiros = atualizar_goleiro(goleiros, nome_goleiro1, defesa1, "Time 1")
        if nome_goleiro2 and defesa2 > 0:
            goleiros = atualizar_goleiro(goleiros, nome_goleiro2, defesa2, "Time 2")

        # Define o resultado da partida
        vencedor = "Time 1" if time1 > time2 else "Time 2" if time2 > time1 else "empate"
        novo_id = 1 if partidas.empty else int(partidas["ID"].max()) + 1
        
        # Cria a estrutura limpa trocando qualquer lacuna por None (vazio real no CSV)
        nova_partida_dict = {
            "ID": novo_id,
            "data": data_convertida.strftime("%d/%m/%Y"),
            "time1_placar": time1,
            "time2_placar": time2,
            "vencedor": vencedor,
            "gol_time1": jogador1,
            "gol_time2": jogador2,
            "assistencia_time1": assist1, 
            "assistencia_time2": assist2, 
            "goleiro_time1": nome_goleiro1,
            "defesa_time1": defesa1,
            "goleiro_time2": nome_goleiro2,
            "defesa_time2": defesa2
        }

        # Concatena a nova linha usando dicionário direto para evitar geração de NaNs ocultos
        nova = pd.DataFrame([nova_partida_dict])
        partidas = pd.concat([partidas, nova], ignore_index=True)

        # Salva de volta nos arquivos locais
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
    app.run(host="127.0.0.1", port=5000, debug=True)