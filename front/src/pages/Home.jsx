import "../styles/Home.css"

import {
useNavigate
}
from "react-router-dom"


function Home(){

const navigate =
useNavigate();


const campeonatos=[

{
id:1,
nome:"Brasileirão"
},

{
id:2,
nome:"Premier League"
},

{
id:3,
nome:"La Liga"
},

{
id:4,
nome:"Copa do Mundo"
},

{
id:5,
nome:"Campeonato Vôlei"
},

{
id:6,
nome:"Interclasse"
},

{
id:7,
nome:"João"
},

{
id:8,
nome:"Maria"
},

{
id:9,
nome:"Tênis Campeonatinho"
}

];


return(

<div className="home">

<aside className="sidebar">

<div className="perfil">

<h2>

⚽ Campinho

</h2>

</div>


<nav>

<button>

👤 Dados da Conta

</button>

<button>

🏆 Meus Campeonatos

</button>

<button>

⭐ Seguindo

</button>

<button>

👥 Amigos

</button>

<button

onClick={()=>

navigate(

"/criar"

)

}

>

➕ Criar

</button>

</nav>

</aside>


<section className="conteudo">

<div className="busca">

<input

placeholder=

"Buscar usuário, campeonatos, jogadores, gráficos..."

/>

<button>

Limpar

</button>

</div>



<div className="grid">

{

campeonatos.map(

(c)=>(

<div

className="card"

key={c.id}

onClick={()=>

navigate(

`/campeonato/${c.id}`

)

}

>

{c.nome}

</div>

)

)

}

</div>

</section>

</div>

)

}


export default Home