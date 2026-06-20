import api from "./api"


export async function listarJogadores() {

    const res = await api.get(
        "/api/jogadores_df"
    )

    return res.data
}


export async function adicionarJogador(
    dados
) {

    const res = await api.post(

        "/api/add_jogador",

        dados

    )

    return res.data
}


export async function topJogadores() {

    const res = await api.get(
        "/api/top"
    )

    return res.data
}