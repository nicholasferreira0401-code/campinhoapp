import "../styles/formulario.css"
import { useState } from "react"

export default function AddPartida(){
  const [data, setData] = useState("")
  
  // Time 1 - Gols e Assists
  const [goladores1, setGoladores1] = useState([])
  const [novoGolador1, setNovoGolador1] = useState({ nome: "", gols: 0 })
  
  const [assist1, setAssist1] = useState([])
  const [novoAssist1, setNovoAssist1] = useState({ nome: "", assists: 0 })
  
  // Time 2 - Gols e Assists
  const [goladores2, setGoladores2] = useState([])
  const [novoGolador2, setNovoGolador2] = useState({ nome: "", gols: 0 })
  
  const [assist2, setAssist2] = useState([])
  const [novoAssist2, setNovoAssist2] = useState({ nome: "", assists: 0 })
  
  // Goleiros
  const [goleiro1, setGoleiro1] = useState("")
  const [defesa1, setDefesa1] = useState(0)
  
  const [goleiro2, setGoleiro2] = useState("")
  const [defesa2, setDefesa2] = useState(0)
  
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("")

  // Calcular placar automaticamente
  const placar1 = goladores1.reduce((sum, g) => sum + g.gols, 0)
  const placar2 = goladores2.reduce((sum, g) => sum + g.gols, 0)

  // Adicionar golador
  function adicionarGolador(time) {
    if (time === 1) {
      if (novoGolador1.nome.trim() && novoGolador1.gols > 0) {
        setGoladores1([...goladores1, novoGolador1])
        setNovoGolador1({ nome: "", gols: 0 })
      }
    } else {
      if (novoGolador2.nome.trim() && novoGolador2.gols > 0) {
        setGoladores2([...goladores2, novoGolador2])
        setNovoGolador2({ nome: "", gols: 0 })
      }
    }
  }

  // Remover golador
  function removerGolador(time, index) {
    if (time === 1) {
      setGoladores1(goladores1.filter((_, i) => i !== index))
    } else {
      setGoladores2(goladores2.filter((_, i) => i !== index))
    }
  }

  // Adicionar assistente
  function adicionarAssistente(time) {
    if (time === 1) {
      if (novoAssist1.nome.trim() && novoAssist1.assists > 0) {
        setAssist1([...assist1, novoAssist1])
        setNovoAssist1({ nome: "", assists: 0 })
      }
    } else {
      if (novoAssist2.nome.trim() && novoAssist2.assists > 0) {
        setAssist2([...assist2, novoAssist2])
        setNovoAssist2({ nome: "", assists: 0 })
      }
    }
  }

  // Remover assistente
  function removerAssistente(time, index) {
    if (time === 1) {
      setAssist1(assist1.filter((_, i) => i !== index))
    } else {
      setAssist2(assist2.filter((_, i) => i !== index))
    }
  }

  async function enviar(e) {
    e.preventDefault()

    if (!data) {
      setMsg("Preencha a data antes de salvar.")
      setMsgType("error")
      return
    }

    // CORREÇÃO DO REPEAT: Agora repete gerando itens separados por vírgula corretamente
    const formatarLista = (lista, chaveValor) => {
      return lista.flatMap(item => Array(item[chaveValor]).fill(item.nome)).join(", ")
    }

    const golString1 = formatarLista(goladores1, "gols")
    const golString2 = formatarLista(goladores2, "gols")
    const assistString1 = formatarLista(assist1, "assists")
    const assistString2 = formatarLista(assist2, "assists")

    // Corpo da requisição estruturado em formato JSON
    const dadosPartida = {
      data,
      time1_placar: placar1,
      time2_placar: placar2,
      gol_time1: golString1 || "-",
      gol_time2: golString2 || "-",
      assistente_time1: assistString1 || "-",
      assistente_time2: assistString2 || "-",
      defesa_time1: defesa1 || 0,
      defesa_time2: defesa2 || 0,
      goleiro_time1: goleiro1 || "-",
      goleiro_time2: goleiro2 || "-"
    }

    try {
      // CORREÇÃO DO FETCH: Mudado para POST enviando JSON no body
      const resposta = await fetch(`http://127.0.0.1:5000/api/partidas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosPartida)
      })
      
      const dados = await resposta.json()

      if (resposta.ok) {
        setMsg("✅ Partida cadastrada com sucesso.")
        setMsgType("success")
        
        // Limpar formulário
        setData("")
        setGoladores1([])
        setGoladores2([])
        setAssist1([])
        setAssist2([])
        setGoleiro1("")
        setDefesa1(0)
        setGoleiro2("")
        setDefesa2(0)
      } else {
        setMsg(`❌ ${dados.erro || dados.mensagem || "Erro ao salvar partida."}`)
        setMsgType("error")
      }
    } catch (erro) {
      setMsg(`❌ ${erro.message || "Falha ao conectar com a API."}`)
      setMsgType("error")
    }
  }

  return(
    <div className="container-form">
      <div className="card-form">
        <h1>⚽ Nova Partida</h1>

        <form className="form" onSubmit={enviar}>
          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />

          {/* TIME 1 - GOLS */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
            <h3 style={{ marginTop: 0, color: "#ffffff" }}>⚽ Time 1 - Gols</h3>
            
            {goladores1.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {goladores1.map((g, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    {/* CORREÇÃO DE COR: color mudado para #ffffff */}
                    <span style={{ flex: 1, color: "#ffffff" }}>
                      {g.nome}: {g.gols} {g.gols === 1 ? "gol" : "gols"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerGolador(1, idx)}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Nome do jogador"
                value={novoGolador1.nome}
                onChange={e => setNovoGolador1({ ...novoGolador1, nome: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="1"
                placeholder="Gols"
                value={novoGolador1.gols || ""}
                onChange={e => setNovoGolador1({ ...novoGolador1, gols: parseInt(e.target.value) || 0 })}
                style={{ width: "60px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <button
                type="button"
                onClick={() => adicionarGolador(1)}
                style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
          </div>

          {/* TIME 1 - ASSISTS */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
            <h3 style={{ marginTop: 0, color: "#ffffff" }}>🎯 Time 1 - Assistências</h3>
            
            {assist1.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {assist1.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    {/* CORREÇÃO DE COR: color mudado para #ffffff */}
                    <span style={{ flex: 1, color: "#ffffff" }}>
                      {a.nome}: {a.assists} {a.assists === 1 ? "assistência" : "assistências"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerAssistente(1, idx)}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Nome do jogador"
                value={novoAssist1.nome}
                onChange={e => setNovoAssist1({ ...novoAssist1, nome: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="1"
                placeholder="Assists"
                value={novoAssist1.assists || ""}
                onChange={e => setNovoAssist1({ ...novoAssist1, assists: parseInt(e.target.value) || 0 })}
                style={{ width: "60px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <button
                type="button"
                onClick={() => adicionarAssistente(1)}
                style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
          </div>

          {/* TIME 2 - GOLS */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
            <h3 style={{ marginTop: 0, color: "#ffffff" }}>⚽ Time 2 - Gols</h3>
            
            {goladores2.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {goladores2.map((g, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    {/* CORREÇÃO DE COR: color mudado para #ffffff */}
                    <span style={{ flex: 1, color: "#ffffff" }}>
                      {g.nome}: {g.gols} {g.gols === 1 ? "gol" : "gols"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerGolador(2, idx)}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Nome do jogador"
                value={novoGolador2.nome}
                onChange={e => setNovoGolador2({ ...novoGolador2, nome: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="1"
                placeholder="Gols"
                value={novoGolador2.gols || ""}
                onChange={e => setNovoGolador2({ ...novoGolador2, gols: parseInt(e.target.value) || 0 })}
                style={{ width: "60px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <button
                type="button"
                onClick={() => adicionarGolador(2)}
                style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
          </div>

          {/* TIME 2 - ASSISTS */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
            <h3 style={{ marginTop: 0, color: "#ffffff" }}>🎯 Time 2 - Assistências</h3>
            
            {assist2.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {assist2.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    {/* CORREÇÃO DE COR: color mudado para #ffffff */}
                    <span style={{ flex: 1, color: "#ffffff" }}>
                      {a.nome}: {a.assists} {a.assists === 1 ? "assistência" : "assistências"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerAssistente(2, idx)}
                      style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Nome do jogador"
                value={novoAssist2.nome}
                onChange={e => setNovoAssist2({ ...novoAssist2, nome: e.target.value })}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="1"
                placeholder="Assists"
                value={novoAssist2.assists || ""}
                onChange={e => setNovoAssist2({ ...novoAssist2, assists: parseInt(e.target.value) || 0 })}
                style={{ width: "60px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <button
                type="button"
                onClick={() => adicionarAssistente(2)}
                style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
          </div>

          {/* PLACAR */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd", textAlign: "center" }}>
            <h2 style={{ color: "#ffffff", marginTop: 0 }}>
              Placar: <span style={{ color: "#2563eb", fontSize: "1.4em" }}>{placar1} x {placar2}</span>
            </h2>
          </div>

          {/* GOLEIROS */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #ddd" }}>
            <h3 style={{ marginTop: 0, color: "#ffffff" }}>🧤 Goleiros</h3>
            
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ffffff" }}>Goleiro Time 1</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Nome do goleiro"
                value={goleiro1}
                onChange={e => setGoleiro1(e.target.value)}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="0"
                placeholder="Defesas"
                value={defesa1}
                onChange={e => setDefesa1(parseInt(e.target.value) || 0)}
                style={{ width: "80px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
            </div>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ffffff" }}>Goleiro Time 2</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Nome do goleiro"
                value={goleiro2}
                onChange={e => setGoleiro2(e.target.value)}
                style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
              <input
                type="number"
                min="0"
                placeholder="Defesas"
                value={defesa2}
                onChange={e => setDefesa2(parseInt(e.target.value) || 0)}
                style={{ width: "80px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", color: "#000" }}
              />
            </div>
          </div>

          <button className="botao" style={{ marginTop: "24px" }}>
            Salvar Partida
          </button>
        </form>

        <div className={`msg ${msgType}`}>
          {msg}
        </div>
      </div>
    </div>
  )
}