import GraficoGols from "../components/GraficoGols"

import {
useEffect,
useState
}
from "react"

import {
Link
}
from "react-router-dom"

export default function Dashboard(){

const [partidas,setPartidas]=useState([])
const [jogadores,setJogadores]=useState([])

useEffect(()=>{

fetch(
"http://127.0.0.1:5000/api/partidas_df"
)
.then(
r=>r.json()
)
.then(
setPartidas
)

fetch(
"http://127.0.0.1:5000/api/jogadores_df"
)
.then(
r=>r.json()
)
.then(
setJogadores
)

},[])

const totalGols=

partidas.reduce(

(acc,p)=>

acc+

Number(
p.time1_placar||0
)

+

Number(
p.time2_placar||0
),

0

)

return(

<div className="dashboard">

<h1>
⚽ Campinho Dashboard
</h1>

<div className="cards">

<div className="card">

<h3>
Partidas
</h3>

<h2>
{partidas.length}
</h2>

</div>

<div className="card">

<h3>
Jogadores
</h3>

<h2>
{jogadores.length}
</h2>

</div>

<div className="card">

<h3>
Gols
</h3>

<h2>
{totalGols}
</h2>

</div>

</div>

<br/>

<GraficoGols
partidas={partidas}
/>

<br/>

<div
style={{
display:"flex",
gap:"20px"
}}
>

<Link
to="/add-jogador"
>

➕ Adicionar Jogador

</Link>

<Link
to="/add-partida"
>

⚽ Adicionar Partida

</Link>

</div>

</div>

)

}