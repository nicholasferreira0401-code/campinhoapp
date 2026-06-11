import "../styles/formulario.css"
import {
useState
}
from "react"

export default function AddJogador(){

const[
jogador,
setJogador
]=useState("")

const[
time,
setTime
]=useState("")

const[
msg,
setMsg
]=useState("")

async function enviar(e){

e.preventDefault()

await fetch(

"http://127.0.0.1:5000/api/add_jogador?"

+

new URLSearchParams({

jogador,
time

})

)

setMsg(
"Jogador salvo"
)

setJogador("")
setTime("")

}

return(

<div
className="container-form"
>

<div
className="card-form"
>

<h1>

Adicionar Jogador

</h1>

<form
className="form"
onSubmit={enviar}
>

<label>

Nome

</label>

<input

value={jogador}

onChange={
e=>
setJogador(
e.target.value
)
}

/>

<label>

Time

</label>

<input

value={time}

onChange={
e=>
setTime(
e.target.value
)
}

/>

<button
className="botao"
>

Salvar

</button>

</form>

<div
className="msg"
>

{msg}

</div>

</div>

</div>

)

}