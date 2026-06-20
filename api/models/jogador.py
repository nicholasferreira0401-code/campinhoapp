from database import db

class Jogador(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100)
    )

    time = db.Column(
        db.String(100)
    )

    gols = db.Column(
        db.Integer,
        default=0
    )

    assistencias = db.Column(
        db.Integer,
        default=0
    )