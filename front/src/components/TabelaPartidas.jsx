import React from "react"

function TabelaPartidas({ dados = [] }) {

  const formatarVencedor = (vencedor) => {
    if (vencedor === "time1") return "🏆 Time 1"
    if (vencedor === "time2") return "🏆 Time 2"
    if (vencedor === "empate") return "🤝 Empate"
    return vencedor || "-"
  }

  if (
    !Array.isArray(dados) ||
    dados.length === 0
  ) {
    return (
      <p className="tabela-vazia">
        Nenhuma partida registrada.
      </p>
    )
  }

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>ID</th>
          <th>Data</th>
          <th>Placar</th>
          <th>Gol T1</th>
          <th>Gol T2</th>
          <th>Assist. T1</th>
          <th>Assist. T2</th>
          <th>Vencedor</th>
        </tr>
      </thead>

      <tbody>
        {dados.map((p, index) => (

          <tr
            key={
              p.ID ??
              `${p.data}-${p.time1_placar}-${p.time2_placar}-${index}`
            }
          >

            <td>{p.ID ?? "-"}</td>

            <td>{p.data ?? "-"}</td>

            <td>
              <strong>
                {p.time1_placar ?? 0}
              </strong>

              {" × "}

              <strong>
                {p.time2_placar ?? 0}
              </strong>
            </td>

            <td>{p.gol_time1 || "-"}</td>

            <td>{p.gol_time2 || "-"}</td>

            <td>
              {p.assistencia_time1 ||
              p.assistente_time1 ||
              "-"}
            </td>

            <td>
              {p.assistencia_time2 ||
              p.assistente_time2 ||
              "-"}
            </td>

            <td>
              {formatarVencedor(
                p.vencedor
              )}
            </td>

          </tr>

        ))}
      </tbody>
    </table>
  )
}

export default TabelaPartidas