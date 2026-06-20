from flask import Blueprint
from flask import request
from flask import jsonify

from database import db

from models.partida import Partida
from models.jogador import Jogador
from models.goleiro import Goleiro

import re


partidas_bp = Blueprint(
    "partidas",
    __name__
)


# ======================
# AUXILIAR
# ======================

def parse_nomes(valor):

    if not valor:
        return []

    return [

        p.strip()

        for p in re.split(
            r"[;,\n]+",
            str(valor)
        )

        if p.strip()

    ]


def atualizar_jogador(
    nome,
    campo,
    time
):

    if not nome:
        return

    jogador = (

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

    if jogador:

        setattr(
            jogador,
            campo,
            getattr(
                jogador,
                campo
            ) + 1
        )

    else:

        jogador = Jogador(

            nome=nome,

            time=time,

            gols=0,

            assistencias=0

        )

        setattr(
            jogador,
            campo,
            1
        )

        db.session.add(
            jogador
        )


def atualizar_goleiro(
    nome,
    defesas,
    time
):

    if not nome:
        return

    goleiro = (

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

    if goleiro:

        goleiro.defesas += int(
            defesas
        )

    else:

        db.session.add(

            Goleiro(

                nome=nome,

                time=time,

                defesas=defesas

            )
        )


# ======================
# LISTAR PARTIDAS
# ======================

@partidas_bp.route(
    "/api/partidas_df",
    methods=["GET"]
)
def listar_partidas():

    partidas = (

        Partida.query

        .order_by(
            Partida.id.desc()
        )

        .limit(30)

        .all()

    )

    return jsonify([

        p.to_dict()

        for p in partidas

    ])


# ======================
# NOVA PARTIDA
# ======================

@partidas_bp.route(
    "/api/partidas_df",
    methods=["POST"]
)
def criar_partida():

    try:

        dados = request.get_json()

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

            else

            "Time 2"

            if time2 > time1

            else

            "Empate"

        )

        partida = Partida(

            data=dados.get(
                "data"
            ),

            time1_placar=time1,

            time2_placar=time2,

            vencedor=vencedor,

            gol_time1=dados.get(
                "gol_time1"
            ),

            gol_time2=dados.get(
                "gol_time2"
            ),

            assistencia_time1=dados.get(
                "assistencia_time1"
            ),

            assistencia_time2=dados.get(
                "assistencia_time2"
            ),

            goleiro_time1=dados.get(
                "goleiro_time1"
            ),

            defesa_time1=int(
                dados.get(
                    "defesa_time1",
                    0
                )
            ),

            goleiro_time2=dados.get(
                "goleiro_time2"
            ),

            defesa_time2=int(
                dados.get(
                    "defesa_time2",
                    0
                )
            )

        )

        db.session.add(
            partida
        )

        # gols

        for nome in parse_nomes(
            dados.get(
                "gol_time1"
            )
        ):

            atualizar_jogador(
                nome,
                "gols",
                "time1"
            )


        for nome in parse_nomes(
            dados.get(
                "gol_time2"
            )
        ):

            atualizar_jogador(
                nome,
                "gols",
                "time2"
            )


        # assistências

        for nome in parse_nomes(
            dados.get(
                "assistencia_time1"
            )
        ):

            atualizar_jogador(
                nome,
                "assistencias",
                "time1"
            )


        for nome in parse_nomes(
            dados.get(
                "assistencia_time2"
            )
        ):

            atualizar_jogador(
                nome,
                "assistencias",
                "time2"
            )


        atualizar_goleiro(

            dados.get(
                "goleiro_time1"
            ),

            dados.get(
                "defesa_time1",
                0
            ),

            "time1"

        )


        atualizar_goleiro(

            dados.get(
                "goleiro_time2"
            ),

            dados.get(
                "defesa_time2",
                0
            ),

            "time2"

        )


        db.session.commit()

        return jsonify({

            "mensagem":
            "Partida criada"

        }), 201


    except Exception as e:

        db.session.rollback()

        return jsonify({

            "erro":
            str(e)

        }), 500