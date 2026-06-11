import {
useEffect,
useState
}
from "react"

import CardJogador
from "../components/CardJogador"

function Jogadores(){

const[
dados,
setDados

]=useState([])

useEffect(()=>{

fetch(
"http://127.0.0.1:5000/api/jogadores_df"
)

.then(
r=>r.json()
)

.then(
setDados
)

},[])

return(

<div>

<h1>

Jogadores

</h1>

<div className="lista">

{

dados.map(
(j)=>(
<CardJogador

key={
j.ID_jogador
}

nome={
j.jogador
}

time={
j.time
}

gols={
j.gols
}

assistencias={
j.assistencias
}

total={
j.total
}

/>
)
)

}

</div>

</div>

)

}

export default Jogadores