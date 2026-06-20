from flask import Blueprint
from flask import request
from flask import jsonify

from database import db

from models.jogador import Jogador


jogadores_bp = Blueprint(
    "jogadores",
    __name__
)


# ==========================
# LISTAR JOGADORES
# ==========================

@jogadores_bp.route(
    "/api/jogadores_df",
    methods=["GET"]
)
def listar_jogadores():

    jogadores = (

        Jogador.query

        .order_by(
            Jogador.gols.desc()
        )

        .all()

    )

    return jsonify([

        {

            "id":
            j.id,

            "nome":
            j.nome,

            "time":
            j.time,

            "gols":
            j.gols,

            "assistencias":
            j.assistencias,

            "total":
            j.gols +

            j.assistencias

        }

        for j in jogadores

    ])


# ==========================
# ADICIONAR JOGADOR
# ==========================

@jogadores_bp.route(
    "/api/add_jogador",
    methods=["POST"]
)
def add_jogador():

    dados = request.get_json()

    if not dados:

        return jsonify({

            "erro":
            "JSON inválido"

        }), 400


    nome = (

        dados

        .get(
            "jogador",
            ""
        )

        .strip()

    )

    time = (

        dados

        .get(
            "time",
            ""
        )

        .strip()

    )


    if not nome or not time:

        return jsonify({

            "erro":
            "Informe jogador e time"

        }), 400


    existe = (

        Jogador.query

        .filter(

            db.func.lower(

                Jogador.nome

            )

            ==

            nome.lower()

        )

        .first()

    )


    if existe:

        return jsonify({

            "mensagem":
            "Jogador já existe"

        })


    novo = Jogador(

        nome=nome,

        time=time,

        gols=0,

        assistencias=0

    )

    db.session.add(
        novo
    )

    db.session.commit()

    return jsonify({

        "mensagem":
        "Jogador criado",

        "id":
        novo.id

    }), 201


# ==========================
# TOP 5
# ==========================

@jogadores_bp.route(
    "/api/top",
    methods=["GET"]
)
def top_jogadores():

    jogadores = (

        Jogador.query

        .all()

    )

    ranking = sorted(

        jogadores,

        key=lambda x:

        x.gols +

        x.assistencias,

        reverse=True

    )[:5]

    return jsonify([

        {

            "id":
            j.id,

            "nome":
            j.nome,

            "time":
            j.time,

            "gols":
            j.gols,

            "assistencias":
            j.assistencias,

            "total":
            j.gols +

            j.assistencias

        }

        for j in ranking

    ])


# ==========================
# BUSCAR POR ID
# ==========================

@jogadores_bp.route(
    "/api/jogadores/<int:id>",
    methods=["GET"]
)
def buscar_jogador(id):

    jogador = (

        Jogador.query

        .get(id)

    )

    if not jogador:

        return jsonify({

            "erro":
            "Jogador não encontrado"

        }), 404


    return jsonify({

        "id":
        jogador.id,

        "nome":
        jogador.nome,

        "time":
        jogador.time,

        "gols":
        jogador.gols,

        "assistencias":
        jogador.assistencias,

        "total":
        jogador.gols +

        jogador.assistencias

    })


# ==========================
# REMOVER
# ==========================

@jogadores_bp.route(
    "/api/jogadores/<int:id>",
    methods=["DELETE"]
)
def remover_jogador(id):

    jogador = (

        Jogador.query

        .get(id)

    )

    if not jogador:

        return jsonify({

            "erro":
            "Jogador não encontrado"

        }), 404


    db.session.delete(
        jogador
    )

    db.session.commit()

    return jsonify({

        "mensagem":
        "Jogador removido"

    })