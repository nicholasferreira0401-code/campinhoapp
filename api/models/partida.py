from database import db


class Partida(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    data = db.Column(
        db.String(20),
        nullable=False
    )

    time1_placar = db.Column(
        db.Integer,
        default=0
    )

    time2_placar = db.Column(
        db.Integer,
        default=0
    )

    vencedor = db.Column(
        db.String(30)
    )


    # gols

    gol_time1 = db.Column(
        db.Text
    )

    gol_time2 = db.Column(
        db.Text
    )


    # assistências

    assistencia_time1 = db.Column(
        db.Text
    )

    assistencia_time2 = db.Column(
        db.Text
    )


    # goleiros

    goleiro_time1 = db.Column(
        db.String(100)
    )

    defesa_time1 = db.Column(
        db.Integer,
        default=0
    )

    goleiro_time2 = db.Column(
        db.String(100)
    )

    defesa_time2 = db.Column(
        db.Integer,
        default=0
    )


    def to_dict(self):

        return {

            "id":
            self.id,

            "data":
            self.data,

            "time1_placar":
            self.time1_placar,

            "time2_placar":
            self.time2_placar,

            "vencedor":
            self.vencedor,

            "gol_time1":
            self.gol_time1,

            "gol_time2":
            self.gol_time2,

            "assistencia_time1":
            self.assistencia_time1,

            "assistencia_time2":
            self.assistencia_time2,

            "goleiro_time1":
            self.goleiro_time1,

            "defesa_time1":
            self.defesa_time1,

            "goleiro_time2":
            self.goleiro_time2,

            "defesa_time2":
            self.defesa_time2

        }