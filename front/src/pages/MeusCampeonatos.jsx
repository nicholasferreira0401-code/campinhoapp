import { useNavigate } from "react-router-dom"

export default function MeusCampeonatos(){

const navigate =
useNavigate()

// depois você troca pelos dados da API
const campeonatos=[

{
id:1,
nome:"Meu Interclasse"
},

{
id:2,
nome:"Campeonato Empresa"
},

{
id:3,
nome:"Fut Sábado"
}

]

return(

<div className="dashboard">

<div className="dashboard-header">

<div>

<p className="eyebrow">

Meus campeonatos

</p>

<h1>

🏆 Campeonatos Criados

</h1>

</div>

<button
className="button-secondary"
onClick={()=>
navigate("/")
}
>

← Voltar

</button>

</div>


<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fill,minmax(280px,1fr))",
gap:"24px"
}}
>

{

campeonatos.map(

(c)=>(

<div

key={c.id}

className="metric-card"

style={{
cursor:"pointer"
}}

onClick={()=>

navigate(
`/campeonato/${c.id}`
)

}

>

<h2>

{c.nome}

</h2>

<p>

Abrir Dashboard

</p>

</div>

)

)

}

</div>

</div>

)

}