const URL =
"http://127.0.0.1:5000"

export async function buscarPartidas(){

    const res =
    await fetch(
        `${URL}/api/partidas`
    )

    return await res.json()

}