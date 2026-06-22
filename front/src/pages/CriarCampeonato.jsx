import {
useState
}
from "react"

import {
useNavigate
}
from "react-router-dom"

import "../styles/CriarCampeonato.css"


function CriarCampeonato(){

const navigate =
useNavigate()


const[
nome,
setNome
]=
useState("")


const[
descricao,
setDescricao
]=
useState("")


async function criar(){

if(
!nome
){

alert(
"Digite um nome"
)

return

}


try{

await fetch(

"http://127.0.0.1:5000/api/campeonatos",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify({

nome,

descricao

})

}

)


navigate("/")

}

catch{

alert(
"Erro ao criar"
)

}

}


return(

<div className="criar">

<div className="card">

<h1>

🏆 Criar Campeonato

</h1>


<input

placeholder="Nome"

value={nome}

onChange={(e)=>

setNome(
e.target.value
)

}

/>


<textarea

placeholder=

"Descrição"

value={descricao}

onChange={(e)=>

setDescricao(
e.target.value
)

}

/>


<button

onClick={criar}

>

Criar

</button>

</div>

</div>

)

}


export default CriarCampeonato