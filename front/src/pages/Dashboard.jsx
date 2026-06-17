import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GraficoGols from "../components/GraficoGols"

export default function Dashboard() {
  const [partidas, setPartidas] = useState([])
  const [jogadores, setJogadores] = useState([])

  const [newData, setNewData] = useState("")
  const [newPlacar1, setNewPlacar1] = useState("")
  const [newPlacar2, setNewPlacar2] = useState("")
  const [newGol1, setNewGol1] = useState("")
  const [newGol2, setNewGol2] = useState("")
  const [newAssist1, setNewAssist1] = useState("")
  const [newAssist2, setNewAssist2] = useState("")
  const [formMsg, setFormMsg] = useState("")
  const [formMsgType, setFormMsgType] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/partidas_df")
      .then((r) => r.json())
      .then(setPartidas)
      .catch(() => setPartidas([]))

    fetch("http://127.0.0.1:5000/api/jogadores_df")
      .then((r) => r.json())
      .then(setJogadores)
      .catch(() => setJogadores([]))
  }, [])

  async function handleAddPartida(event) {
    event.preventDefault()
    setFormMsg("")
    setFormMsgType("")

    if (!newData || newPlacar1 === "" || newPlacar2 === "") {
      setFormMsg("Preencha a data e os dois placares.")
      setFormMsgType("error")
      return
    }

    const params = new URLSearchParams({
      data: newData,
      time1_placar: newPlacar1,
      time2_placar: newPlacar2,
      gol_time1: newGol1,
      gol_time2: newGol2,
      assistente_time1: newAssist1,
      assistente_time2: newAssist2,
    })

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/partidas?${params}`)
      const data = await response.json()

      if (!response.ok) {
        setFormMsg(data.erro || data.mensagem || "Erro ao registrar a partida.")
        setFormMsgType("error")
        return
      }

      const novaPartida = {
        ID: data.ID,
        data: data.data,
        time1_placar: Number(newPlacar1),
        time2_placar: Number(newPlacar2),
        vencedor: data.vencedor,
        gol_time1: newGol1 || null,
        gol_time2: newGol2 || null,
        assistencia_time1: newAssist1 || null,
        assistencia_time2: newAssist2 || null,
      }

      setPartidas((prev) => [novaPartida, ...prev])
      setFormMsg("✅ Partida adicionada com sucesso.")
      setFormMsgType("success")
      setNewData("")
      setNewPlacar1("")
      setNewPlacar2("")
      setNewGol1("")
      setNewGol2("")
      setNewAssist1("")
      setNewAssist2("")
    } catch (error) {
      setFormMsg(error.message || "Falha ao conectar com a API.")
      setFormMsgType("error")
    }
  }

  const totalPartidas = partidas.length
  const totalJogadores = jogadores.length
  const totalGols = partidas.reduce(
    (acc, p) => acc + Number(p.time1_placar || 0) + Number(p.time2_placar || 0),
    0
  )
  const totalAssistencias = partidas.reduce((acc, p) => {
    const a1 = p.assistencia_time1 || p.assistente_time1 || p.assist1 || null
    const a2 = p.assistencia_time2 || p.assistente_time2 || p.assist2 || null
    return acc + (a1 ? 1 : 0) + (a2 ? 1 : 0)
  }, 0)

  const ultimasPartidas = [...partidas]
    .sort((a, b) => {
      const dateA = new Date(a.data).getTime()
      const dateB = new Date(b.data).getTime()
      if (!isNaN(dateA) && !isNaN(dateB)) return dateB - dateA
      return Number(b.ID || 0) - Number(a.ID || 0)
    })
    .slice(0, 5)

  const topJogadores = [...jogadores]
    .sort((a, b) =>
      Number(b.total || 0) - Number(a.total || 0) ||
      Number(b.gols || 0) - Number(a.gols || 0)
    )
    .slice(0, 5)

  function getBadgeClass(vencedor) {
    if (!vencedor) return "badge badge-draw"
    if (vencedor.toLowerCase().includes("time 1")) return "badge badge-team1"
    if (vencedor.toLowerCase().includes("time 2")) return "badge badge-team2"
    if (vencedor.toLowerCase().includes("empate")) return "badge badge-draw"
    return "badge badge-draw"
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Painel de controle</p>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Veja as principais métricas do campinho, últimas partidas e os melhores jogadores.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link to="/add-partida" className="button-primary">
            Registrar partida
          </Link>
          <Link to="/add-jogador" className="button-secondary">
            Registrar jogador
          </Link>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total de partidas</span>
          <h2>{totalPartidas}</h2>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total de jogadores</span>
          <h2>{totalJogadores}</h2>
        </div>
        <div className="metric-card">
          <span className="metric-label">Gols marcados</span>
          <h2>{totalGols}</h2>
        </div>
        <div className="metric-card">
          <span className="metric-label">Assistências</span>
          <h2>{totalAssistencias}</h2>
        </div>
      </div>

      <div className="dashboard-main">
        <section className="panel panel-table">
          <div className="panel-header">
            <h2>Últimas partidas</h2>
            <Link to="/partidas">Ver todas as partidas</Link>
          </div>
          <div className="table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Time 1</th>
                  <th>Placar</th>
                  <th>Time 2</th>
                  <th>Vencedor</th>
                </tr>
              </thead>
              <tbody>
                {ultimasPartidas.map((p) => (
                  <tr key={p.ID || `${p.data}-${p.time1_placar}`}>
                    <td>{p.ID}</td>
                    <td>{p.data}</td>
                    <td>{p.time1}</td>
                    <td>{p.time1_placar} x {p.time2_placar}</td>
                    <td>{p.time2}</td>
                    <td>
                      <span className={getBadgeClass(p.vencedor)}>
                        {p.vencedor || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel panel-form">
          <div className="panel-header">
            <h2>Adicionar partida</h2>
          </div>
          <form className="form-preview" onSubmit={handleAddPartida}>
            <div className="form-grid">
              <label>Data</label>
              <input
                type="date"
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                required
              />
              <label>Time 1 - Placar</label>
              <input
                type="number"
                min="0"
                value={newPlacar1}
                onChange={(e) => setNewPlacar1(e.target.value)}
                required
              />
              <label>Time 2 - Placar</label>
              <input
                type="number"
                min="0"
                value={newPlacar2}
                onChange={(e) => setNewPlacar2(e.target.value)}
                required
              />
              <label>Gol Time 1</label>
              <input
                value={newGol1}
                onChange={(e) => setNewGol1(e.target.value)}
                placeholder="Jogador que fez o gol"
              />
              <label>Gol Time 2</label>
              <input
                value={newGol2}
                onChange={(e) => setNewGol2(e.target.value)}
                placeholder="Jogador que fez o gol"
              />
              <label>Assistência Time 1</label>
              <input
                value={newAssist1}
                onChange={(e) => setNewAssist1(e.target.value)}
                placeholder="Jogador que deu assistência"
              />
              <label>Assistência Time 2</label>
              <input
                value={newAssist2}
                onChange={(e) => setNewAssist2(e.target.value)}
                placeholder="Jogador que deu assistência"
              />
            </div>
            <button type="submit" className="button-primary">
              Registrar partida
            </button>
            {formMsg && (
              <div className={`msg ${formMsgType}`}>
                {formMsg}
              </div>
            )}
          </form>
        </aside>
      </div>

      <section className="panel panel-ranking">
        <div className="panel-header">
          <h2>Jogadores em destaque</h2>
          <Link to="/jogadores">Ver todos os jogadores</Link>
        </div>
        <div className="player-table-wrapper">
          <table className="player-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jogador</th>
                <th>Time</th>
                <th>Gols</th>
                <th>Assistências</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topJogadores.map((j, index) => (
                <tr key={j.ID_jogador || j.jogador || index}>
                  <td>{index + 1}</td>
                  <td>{j.jogador}</td>
                  <td>{j.time}</td>
                  <td>{j.gols}</td>
                  <td>{j.assistencias}</td>
                  <td>{j.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <GraficoGols partidas={partidas} />
    </div>
  )
}
