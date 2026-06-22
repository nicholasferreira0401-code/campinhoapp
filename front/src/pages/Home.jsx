import "../styles/Home.css"

import {
useNavigate
}
from "react-router-dom"


function Home(){

const navigate =
useNavigate();


const destaques=[

"Brasileirão",
"Premier League",
"La Liga",
"Copa do Mundo",
"Campeonato Vôlei",
"Interclasse",
"João",
"Maria",
"Tênis Campeonatinho"

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


<button
onClick={()=>

navigate(
"/meus-campeonatos"

)

}
>
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



<div className="secao">

<h1>

Explorar

</h1>

<p>

Campeonatos populares e usuários em destaque

</p>

</div>



<div className="grid">

{

destaques.map(

(nome,index)=>(

<div

className="card"

key={index}

>

<h3>

{nome}

</h3>

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