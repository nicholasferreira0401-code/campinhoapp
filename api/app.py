from flask import Flask
from flask_cors import CORS

from database import db


# importar modelos
from models.jogador import Jogador
from models.goleiro import Goleiro
from models.partida import Partida


# importar rotas
from routes.jogadores import jogadores_bp
from routes.goleiros import goleiros_bp
from routes.partidas import partidas_bp


app = Flask(__name__)


# =====================
# CONFIG
# =====================

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "sqlite:///campinho.db"

app.config[
    "SQLALCHEMY_TRACK_MODIFICATIONS"
] = False


# =====================
# INICIAR EXTENSÕES
# =====================

db.init_app(app)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# =====================
# REGISTRAR ROTAS
# =====================

app.register_blueprint(
    jogadores_bp
)

app.register_blueprint(
    goleiros_bp
)

app.register_blueprint(
    partidas_bp
)


# =====================
# CRIAR BANCO
# =====================

with app.app_context():

    db.create_all()


# =====================
# START
# =====================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )