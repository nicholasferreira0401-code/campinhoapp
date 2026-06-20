from database import db


class Goleiro(db.Model):

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

    defesas = db.Column(
        db.Integer,
        default=0
    )