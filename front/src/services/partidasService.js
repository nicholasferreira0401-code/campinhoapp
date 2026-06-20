import api from "./api"


export async function criarPartida(
dados
){

const res=

await api.post(

"/api/partidas_df",

dados

)

return res.data

}