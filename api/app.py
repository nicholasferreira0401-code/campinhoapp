from flask import Flask
from flask_cors import CORS

from .database import db


# modelos
from .models.jogador import Jogador
from .models.goleiro import Goleiro
from .models.partida import Partida
from .models.Usuario import Usuario
from .models.campeonato import Campeonato

# rotas
from .routes.jogadores import jogadores_bp
from .routes.goleiros import goleiros_bp
from .routes.partidas import partidas_bp
from .routes.auth import auth_bp


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

# JWT (vamos usar depois)

app.config[
"JWT_SECRET_KEY"
] = "campinho-secret"


# =====================
# EXTENSÕES
# =====================

db.init_app(app)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173"
            ]
        }
    }
)


# =====================
# ROTAS
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

app.register_blueprint(
auth_bp)


# =====================
# BANCO
# =====================

with app.app_context():

    db.create_all()


# =====================
# START
# =====================

if __name__=="__main__":

    app.run(
        debug=True
    )