import { useEffect, useState } from "react"
// Importa o componente reaproveitável que você já possui
import TabelaPartidas from "../components/TabelaPartidas"

export default function Partidas() {
  const [partidas, setPartidas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch("http://127.0.0.1:5000/api/partidas_df")
        const dados = await resposta.json()
        
        console.log("API:", dados)
        setPartidas(dados)
      } catch (erro) {
        console.log("Erro ao carregar partidas:", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  return (
    <div className="page-container" style={{ padding: "20px" }}>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h1>Histórico de Partidas</h1>
        <p style={{ color: "#64748b" }}>Confira o relatório completo de todos os confrontos registrados.</p>
      </div>

      {carregando ? (
        <p className="carregando">Carregando histórico de confrontos...</p>
      ) : (
        // Encapsula toda a lógica da tabela usando o seu componente dedicado
        <TabelaPartidas dados={partidas} />
      )}
    </div>
  )
}