import { Link } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">⚽</div>
        <div>
          <h1>Campinho App</h1>
          <p>Painel</p>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/partidas">Partidas</Link>
        <Link to="/jogadores">Jogadores</Link>
        <Link to="/add-partida">Adicionar Partida</Link>
        <Link to="/add-jogador">Adicionar Jogador</Link>
      </nav>

      <div className="sidebar-footer">
        <span>© 2026 Campinho</span>
      </div>
    </aside>
  )
}
