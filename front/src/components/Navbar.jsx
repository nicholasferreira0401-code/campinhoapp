import { Link, useLocation } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  const location = useLocation()

  // Função para verificar se o link está ativo e aplicar a classe de destaque
  const isLinkAtivo = (pathname) => location.pathname === pathname ? "active" : ""

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
        <Link to="/" className={isLinkAtivo("/")}>
          Dashboard
        </Link>
        <Link to="/partidas" className={isLinkAtivo("/partidas")}>
          Partidas
        </Link>
        <Link to="/jogadores" className={isLinkAtivo("/jogadores")}>
          Jogadores
        </Link>
        <Link to="/add-partida" className={isLinkAtivo("/add-partida")}>
          Adicionar Partida
        </Link>
        <Link to="/add-jogador" className={isLinkAtivo("/add-jogador")}>
          Adicionar Jogador
        </Link>
      </nav>

      <div className="sidebar-footer">
        <span>© 2026 Campinho</span>
      </div>
    </aside>
  )
}