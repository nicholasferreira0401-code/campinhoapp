import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GraficoGols from "../components/GraficoGols"

export default function Dashboard() {
  const [partidas, setPartidas] = useState([])
  const [jogadores, setJogadores] = useState([])
  
  const [newData, setNewData] = useState("")
  const [newGoladores1, setNewGoladores1] = useState([])
  const [novoGolador1, setNovoGolador1] = useState({ nome: "", gols: 0 })
  const [newAssist1, setNewAssist1] = useState([])
  const [novoAssist1, setNovoAssist1] = useState({ nome: "", assists: 0 })
  const [newGoladores2, setNewGoladores2] = useState([])
  const [novoGolador2, setNovoGolador2] = useState({ nome: "", gols: 0 })
  const [newAssist2, setNewAssist2] = useState([])
  const [novoAssist2, setNovoAssist2] = useState({ nome: "", assists: 0 })
  const [newGoleiro1, setNewGoleiro1] = useState("")
  const [newDefesa1, setNewDefesa1] = useState(0)
  const [newGoleiro2, setNewGoleiro2] = useState("")
  const [newDefesa2, setNewDefesa2] = useState(0)
  const [formMsg, setFormMsg] = useState("")
  const [formMsgType, setFormMsgType] = useState("")

  // Função para carregar os jogadores atualizados
  function carregarJogadores() {
    fetch("http://127.0.0.1:5000/api/jogadores_df")
      .then((r) => r.json())
      .then(setJogadores)
      .catch(() => setJogadores([]))
  }

  // Função para carregar as partidas atualizadas
  function carregarPartidas() {
    fetch("http://127.0.0.1:5000/api/partidas_df")
      .then((r) => r.json())
      .then(setPartidas)
      .catch(() => setPartidas([]))
  }

  useEffect(() => {
    carregarPartidas()
    carregarJogadores()
  }, [])

  const placar1 = newGoladores1.reduce((sum, g) => sum + g.gols, 0)
  const placar2 = newGoladores2.reduce((sum, g) => sum + g.gols, 0)

  function joinRepeatedNames(items, key) {
    return items.flatMap((item) => Array(item[key]).fill(item.nome)).join(", ")
  }

  function getBadgeClass(vencedor) {
    if (!vencedor) return "badge badge-draw"
    const v = vencedor.toLowerCase()
    if (v.includes("time1") || v.includes("time 1")) return "badge badge-team1"
    if (v.includes("time2") || v.includes("time 2")) return "badge badge-team2"
    if (v.includes("empate")) return "badge badge-draw"
    return "badge badge-draw"
  }

  async function handleAddPartida(event) {
    event.preventDefault()
    setFormMsg("")
    setFormMsgType("")

    if (!newData) {
      setFormMsg("Preencha a data antes de salvar.")
      setFormMsgType("error")
      return
    }

    const payload = {
      data: newData,
      time1_placar: parseInt(placar1) || 0,
      time2_placar: parseInt(placar2) || 0,
      gol_time1: joinRepeatedNames(newGoladores1, "gols"),
      gol_time2: joinRepeatedNames(newGoladores2, "gols"),
      assistente_time1: joinRepeatedNames(newAssist1, "assists"),
      assistente_time2: joinRepeatedNames(newAssist2, "assists"),
      goleiro_time1: newGoleiro1 || "",
      defesa_time1: parseInt(newDefesa1) || 0,
      goleiro_time2: newGoleiro2 || "",
      defesa_time2: parseInt(newDefesa2) || 0,
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/partidas_df", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const novaPartidaSalva = await response.json()

      if (!response.ok) {
        setFormMsg(novaPartidaSalva.erro || "Erro ao registrar a partida.")
        setFormMsgType("error")
        return
      }

      // Re-busca completa de dados da API para sincronizar Cards, Tabela e Artilharia de uma vez só!
      carregarPartidas()
      carregarJogadores()

      setFormMsg("✅ Partida, Artilharia e Defesas salvas com sucesso!")
      setFormMsgType("success")

      // Limpeza dos campos do formulário
      setNewData("")
      setNewGoladores1([])
      setNewAssist1([])
      setNewGoladores2([])
      setNewAssist2([])
      setNewGoleiro1("")
      setNewDefesa1(0)
      setNewGoleiro2("")
      setNewDefesa2(0)

    } catch (error) {
      setFormMsg("Falha crítica ao conectar com o servidor da API.")
      setFormMsgType("error")
    }
  }

  // Cálculos matemáticos dos Cards baseados no estado re-renderizado
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

  // Ordenação das partidas para exibir os últimos resultados
  // 1. Filtra as partidas para ignorar repetições com os mesmos dados exatos
  // 1. Filtra as partidas usando as propriedades exatas que vêm do seu backend (assistente_timeX)
  const partidasSemRepetidos = partidas.filter((partida, index, self) => {
    return index === self.findIndex((p) => 
      p.data === partida.data &&
      p.time1_placar === partida.time1_placar &&
      p.time2_placar === partida.time2_placar &&
      p.gol_time1 === partida.gol_time1 &&
      p.gol_time2 === partida.gol_time2 &&
      (p.assistente_time1 || p.assistencia_time1) === (partida.assistente_time1 || partida.assistencia_time1) &&
      (p.assistente_time2 || p.assistencia_time2) === (partida.assistente_time2 || partida.assistencia_time2)
    )
  })

  // 2. Ordena colocando as datas mais recentes de Verdade (pelo Objeto Date) no topo
  const ultimasPartidas = [...partidasSemRepetidos]
    .sort((a, b) => {
      const parseDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== "string") return new Date(0);
        
        const parts = dateStr.trim().split('/');
        if (parts.length !== 3) return new Date(0);
        
        const dia = parseInt(parts[0], 10);
        const mes = parseInt(parts[1], 10);
        const ano = parseInt(parts[2], 10);
        
        return new Date(ano, mes - 1, dia);
      };

      const dateA = parseDate(a.data).getTime();
      const dateB = parseDate(b.data).getTime();

      // Se as datas forem diferentes, a mais recente (ex: Junho/2026) fica no topo
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      
      // Se a data for exatamente igual, o maior ID desempata no topo
      return Number(b.ID || 0) - Number(a.ID || 0);
    })
    .slice(0, 5);
    
  const topJogadores = [...jogadores]
    .sort((a, b) =>
      Number(b.total || 0) - Number(a.total || 0) ||
      Number(b.gols || 0) - Number(a.gols || 0)
    )
    .slice(0, 5)

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
                  <th>Placar</th>
                  <th>Gols Time 1</th>
                  <th>Gols Time 2</th>
                  <th>Assist. T1</th>
                  <th>Assist. T2</th>
                  <th>Vencedor</th>
                </tr>
              </thead>
              <tbody>
                {ultimasPartidas.map((p) => (
                  <tr key={p.ID || `${p.data}-${p.time1_placar}`}>
                    <td>{p.ID}</td>
                    <td>{p.data}</td>
                    <td>{p.time1_placar} x {p.time2_placar}</td>
                    <td>{p.gol_time1 || "-"}</td>
                    <td>{p.gol_time2 || "-"}</td>
                    <td>{p.assistencia_time1 || p.assistente_time1 || "-"}</td>
                    <td>{p.assistencia_time2 || p.assistente_time2 || "-"}</td>
                    <td>
                      <span className={getBadgeClass(p.vencedor)}>
                        {p.vencedor === "time1" ? "Time 1" : p.vencedor === "time2" ? "Time 2" : p.vencedor || "-"}
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

              <div style={{ marginTop: "16px", gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>⚽ Time 1 - Gols</h3>
                {newGoladores1.map((g, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1, color: "#0f172a" }}>
                      {g.nome}: {g.gols} {g.gols === 1 ? "gol" : "gols"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewGoladores1(newGoladores1.filter((_, i) => i !== idx))}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    placeholder="Nome do jogador"
                    value={novoGolador1.nome}
                    onChange={(e) => setNovoGolador1({ ...novoGolador1, nome: e.target.value })}
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Gols"
                    value={novoGolador1.gols || ""}
                    onChange={(e) => setNovoGolador1({ ...novoGolador1, gols: parseInt(e.target.value) || 0 })}
                    style={{ width: "72px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (novoGolador1.nome.trim() && novoGolador1.gols > 0) {
                        setNewGoladores1([...newGoladores1, novoGolador1])
                        setNovoGolador1({ nome: "", gols: 0 })
                      }
                    }}
                    style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px", gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>🎯 Time 1 - Assistências</h3>
                {newAssist1.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1, color: "#0f172a" }}>
                      {a.nome}: {a.assists} {a.assists === 1 ? "assistência" : "assistências"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewAssist1(newAssist1.filter((_, i) => i !== idx))}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    placeholder="Nome do jogador"
                    value={novoAssist1.nome}
                    onChange={(e) => setNovoAssist1({ ...novoAssist1, nome: e.target.value })}
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Assists"
                    value={novoAssist1.assists || ""}
                    onChange={(e) => setNovoAssist1({ ...novoAssist1, assists: parseInt(e.target.value) || 0 })}
                    style={{ width: "72px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (novoAssist1.nome.trim() && novoAssist1.assists > 0) {
                        setNewAssist1([...newAssist1, novoAssist1])
                        setNovoAssist1({ nome: "", assists: 0 })
                      }
                    }}
                    style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px", gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>⚽ Time 2 - Gols</h3>
                {newGoladores2.map((g, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1, color: "#0f172a" }}>
                      {g.nome}: {g.gols} {g.gols === 1 ? "gol" : "gols"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewGoladores2(newGoladores2.filter((_, i) => i !== idx))}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    placeholder="Nome do jogador"
                    value={novoGolador2.nome}
                    onChange={(e) => setNovoGolador2({ ...novoGolador2, nome: e.target.value })}
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Gols"
                    value={novoGolador2.gols || ""}
                    onChange={(e) => setNovoGolador2({ ...novoGolador2, gols: parseInt(e.target.value) || 0 })}
                    style={{ width: "72px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (novoGolador2.nome.trim() && novoGolador2.gols > 0) {
                        setNewGoladores2([...newGoladores2, novoGolador2])
                        setNovoGolador2({ nome: "", gols: 0 })
                      }
                    }}
                    style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px", gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>🎯 Time 2 - Assistências</h3>
                {newAssist2.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1, color: "#0f172a" }}>
                      {a.nome}: {a.assists} {a.assists === 1 ? "assistência" : "assistências"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewAssist2(newAssist2.filter((_, i) => i !== idx))}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    placeholder="Nome do jogador"
                    value={novoAssist2.nome}
                    onChange={(e) => setNovoAssist2({ ...novoAssist2, nome: e.target.value })}
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Assists"
                    value={novoAssist2.assists || ""}
                    onChange={(e) => setNovoAssist2({ ...novoAssist2, assists: parseInt(e.target.value) || 0 })}
                    style={{ width: "72px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (novoAssist2.nome.trim() && novoAssist2.assists > 0) {
                        setNewAssist2([...newAssist2, novoAssist2])
                        setNovoAssist2({ nome: "", assists: 0 })
                      }
                    }}
                    style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "12px", gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#0f172a" }}>
                  Placar: <strong>{placar1} x {placar2}</strong>
                </div>
              </div>

              <div style={{ marginTop: "16px", gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>🧤 Goleiros</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", marginBottom: "6px", color: "#0f172a" }}>Goleiro Time 1</label>
                    <input
                      type="text"
                      placeholder="Nome do goleiro"
                      value={newGoleiro1}
                      onChange={(e) => setNewGoleiro1(e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "8px" }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Defesas"
                      value={newDefesa1}
                      onChange={(e) => setNewDefesa1(parseInt(e.target.value) || 0)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", marginBottom: "6px", color: "#0f172a" }}>Goleiro Time 2</label>
                    <input
                      type="text"
                      placeholder="Nome do goleiro"
                      value={newGoleiro2}
                      onChange={(e) => setNewGoleiro2(e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "8px" }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Defesas"
                      value={newDefesa2}
                      onChange={(e) => setNewDefesa2(parseInt(e.target.value) || 0)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="button-primary" style={{ marginTop: "20px" }}>
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