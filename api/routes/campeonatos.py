from flask import Blueprint
from flask import request

from ..database import db
from ..models.campeonato import Campeonato


campeonato_bp= Blueprint("campeonato", __name__)


@campeonato_bp.post("/campeonatos")

def criar():

    dados=     request.json


    novo=    Campeonato(

    nome=

    dados["nome"],

    esporte=

    dados["esporte"],

    descricao=

    dados["descricao"],

    privado=

    dados["privado"]

    )

    db.session.add(

    novo

    )

    db.session.commit()


    return{

    "id":

    novo.id

    }