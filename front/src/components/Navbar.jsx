import { Link } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar(){

return(

<nav className="navbar">

<h2>
⚽ Campinho
</h2>

<div className="links">

<Link to="/">
Dashboard
</Link>

<Link to="/jogadores">
Jogadores
</Link>

<Link to="/partidas">
Partidas
</Link>

<Link to="/add-jogador">
Adicionar Jogador
</Link>

<Link to="/add-partida">
Adicionar Partida
</Link>

</div>

</nav>

)

}