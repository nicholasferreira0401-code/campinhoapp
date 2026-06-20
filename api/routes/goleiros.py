from flask import Blueprint
from flask import request
from flask import jsonify

from database import db

from models.goleiro import Goleiro


goleiros_bp = Blueprint(
    "goleiros",
    __name__
)


# ==========================
# LISTAR GOLEIROS
# ==========================

@goleiros_bp.route(
    "/api/goleiros_df",
    methods=["GET"]
)
def listar_goleiros():

    goleiros = (

        Goleiro.query

        .order_by(
            Goleiro.defesas.desc()
        )

        .all()

    )

    return jsonify([

        {

            "id":
            g.id,

            "nome":
            g.nome,

            "time":
            g.time,

            "defesas":
            g.defesas

        }

        for g in goleiros

    ])


# ==========================
# ADICIONAR GOLEIRO
# ==========================

@goleiros_bp.route(
    "/api/add_goleiro",
    methods=["POST"]
)
def add_goleiro():

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
            "Informe goleiro e time"

        }), 400


    existe = (

        Goleiro.query

        .filter(

            db.func.lower(

                Goleiro.nome

            )

            ==

            nome.lower()

        )

        .first()

    )


    if existe:

        return jsonify({

            "mensagem":
            "Goleiro já existe"

        })


    novo = Goleiro(

        nome=nome,

        time=time,

        defesas=0

    )

    db.session.add(
        novo
    )

    db.session.commit()

    return jsonify({

        "mensagem":
        "Goleiro criado",

        "id":
        novo.id

    }), 201


# ==========================
# TOP GOLEIROS
# ==========================

@goleiros_bp.route(
    "/api/top_goleiros",
    methods=["GET"]
)
def top_goleiros():

    goleiros = (

        Goleiro.query

        .order_by(
            Goleiro.defesas.desc()
        )

        .limit(5)

        .all()

    )

    return jsonify([

        {

            "id":
            g.id,

            "nome":
            g.nome,

            "time":
            g.time,

            "defesas":
            g.defesas

        }

        for g in goleiros

    ])


# ==========================
# BUSCAR GOLEIRO
# ==========================

@goleiros_bp.route(
    "/api/goleiros/<int:id>",
    methods=["GET"]
)
def buscar_goleiro(id):

    goleiro = (

        Goleiro.query

        .get(id)

    )

    if not goleiro:

        return jsonify({

            "erro":
            "Goleiro não encontrado"

        }), 404


    return jsonify({

        "id":
        goleiro.id,

        "nome":
        goleiro.nome,

        "time":
        goleiro.time,

        "defesas":
        goleiro.defesas

    })


# ==========================
# REMOVER GOLEIRO
# ==========================

@goleiros_bp.route(
    "/api/goleiros/<int:id>",
    methods=["DELETE"]
)
def remover_goleiro(id):

    goleiro = (

        Goleiro.query

        .get(id)

    )

    if not goleiro:

        return jsonify({

            "erro":
            "Goleiro não encontrado"

        }), 404


    db.session.delete(
        goleiro
    )

    db.session.commit()

    return jsonify({

        "mensagem":
        "Goleiro removido"

    })