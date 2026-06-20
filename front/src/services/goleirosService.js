import api from "./api"


export async function listarGoleiros() {

    const res = await api.get(
        "/api/goleiros_df"
    )

    return res.data
}


export async function adicionarGoleiro(
    dados
) {

    const res = await api.post(

        "/api/add_goleiro",

        dados

    )

    return res.data
}


export async function topGoleiros() {

    const res = await api.get(
        "/api/top_goleiros"
    )

    return res.data
}