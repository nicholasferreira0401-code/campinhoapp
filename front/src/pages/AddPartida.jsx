import "../styles/formulario.css"
import { useState } from "react"

export default function AddPartida(){

const [data,setData]=useState("")

const [placar1,setPlacar1]=useState("")
const [placar2,setPlacar2]=useState("")

const [gol1,setGol1]=useState("")
const [gol2,setGol2]=useState("")

const [assist1,setAssist1]=useState("")
const [assist2,setAssist2]=useState("")

const [defesa1,setDefesa1]=useState("")
const [defesa2,setDefesa2]=useState("")

const [msg,setMsg]=useState("")

async function enviar(e){

e.preventDefault()

const resposta =
await fetch(

"http://127.0.0.1:5000/api/partidas?"

+

new URLSearchParams({

data,

time1_placar:placar1,

time2_placar:placar2,

gol_time1:gol1,

gol_time2:gol2,

assistente_time1:assist1,

assistente_time2:assist2,

defesa_time1:defesa1,

defesa_time2:defesa2

})

)

if(resposta.ok){

setMsg(
"✅ Partida cadastrada"
)

}else{

setMsg(
"❌ Erro ao salvar"
)

}

}

return(

<div className="container-form">

<div className="card-form">

<h1>

⚽ Nova Partida

</h1>

<form
className="form"
onSubmit={enviar}
>

<label>Data</label>

<input
type="date"
onChange={
e=>
setData(
e.target.value
)
}
/>

<label>Placar Time 1</label>

<input
type="number"
onChange={
e=>
setPlacar1(
e.target.value
)
}
/>

<label>Placar Time 2</label>

<input
type="number"
onChange={
e=>
setPlacar2(
e.target.value
)
}
/>

<label>Gol Time 1</label>

<input
placeholder="Nome jogador"
onChange={
e=>
setGol1(
e.target.value
)
}
/>

<label>Gol Time 2</label>

<input
placeholder="Nome jogador"
onChange={
e=>
setGol2(
e.target.value
)
}
/>

<label>Assistente Time 1</label>

<input
onChange={
e=>
setAssist1(
e.target.value
)
}
/>

<label>Assistente Time 2</label>

<input
onChange={
e=>
setAssist2(
e.target.value
)
}
/>

<label>Defesas Goleiro Time 1</label>

<input
type="number"
onChange={
e=>
setDefesa1(
e.target.value
)
}
/>

<label>Defesas Goleiro Time 2</label>

<input
type="number"
onChange={
e=>
setDefesa2(
e.target.value
)
}
/>

<button
className="botao"
>

Salvar Partida

</button>

</form>

<div className="msg">

{msg}

</div>

</div>

</div>

)

}