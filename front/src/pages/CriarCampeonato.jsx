import { useState } from "react"
import "../styles/CriarCampeonato.css"

function CriarCampeonato(){

const [dados,setDados]=useState({

nome:"",
esporte:"Futebol",
descricao:"",

privado:false

})

function alterar(e){

const{

name,
value,
type,
checked

}=e.target

setDados({

...dados,

[name]:

type==="checkbox"

? checked

: value

})

}


async function criar(e){

e.preventDefault()

try{

const res=

await fetch(

"http://127.0.0.1:5000/campeonatos",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify(

dados

)

}

)

const json=

await res.json()

alert(

"Campeonato criado"

)

console.log(

json

)

}catch{

alert(

"Erro ao criar"

)

}

}

return(

<div className="criar-page">

<form
onSubmit={criar}
className="criar-box"
>

<h1>

Criar Campeonato

</h1>


<input

name="nome"

placeholder="Nome"

value={dados.nome}

onChange={alterar}

/>


<select

name="esporte"

value={dados.esporte}

onChange={alterar}

>

<option>

Futebol

</option>

<option>

Vôlei

</option>

<option>

Tênis

</option>

<option>

Basquete

</option>

</select>


<textarea

name="descricao"

placeholder="Descrição"

value={dados.descricao}

onChange={alterar}

/>


<label>

<input

type="checkbox"

name="privado"

checked={dados.privado}

onChange={alterar}

/>

Privado

</label>


<button>

Criar

</button>

</form>

</div>

)

}

export default CriarCampeonato