from flask import Blueprint
from flask import request

from ..database import db
from ..models.Usuario import Usuario

from flask_bcrypt import Bcrypt


bcrypt = Bcrypt()


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


@auth_bp.post(
    "/register"
)
def registrar():

    dados = request.json


    usuario_existente = (

        Usuario

        .query

        .filter_by(

            email=dados["email"]

        )

        .first()

    )


    if usuario_existente:

        return {

            "erro":

            "Email já cadastrado"

        }, 400


    senha_hash = (

        bcrypt

        .generate_password_hash(

            dados["senha"]

        )

        .decode(

            "utf-8"

        )

    )


    novo = Usuario(

        nome=dados["nome"],

        email=dados["email"],

        senha=senha_hash

    )


    db.session.add(

        novo

    )

    db.session.commit()


    return {

        "ok": True

    }, 201


@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    dados = request.json


    usuario = (

        Usuario

        .query

        .filter_by(

            email=dados["email"]

        )

        .first()

    )


    if not usuario:

        return {

            "erro":

            "Usuário não encontrado"

        }, 401


    senha_ok = (

        bcrypt

        .check_password_hash(

            usuario.senha,

            dados["senha"]

        )

    )


    if not senha_ok:

        return {

            "erro":

            "Senha incorreta"

        }, 401


    return {

        "token":

        "usuario-logado",

        "usuario":{

            "id":

            usuario.id,

            "nome":

            usuario.nome,

            "email":

            usuario.email

        }

    }, 200