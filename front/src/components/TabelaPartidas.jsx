import React from 'react';

function TabelaPartidas({ dados }) {
  // Função auxiliar para deixar o texto do vencedor mais bonito na tela
  const formatarVencedor = (vencedor) => {
    if (vencedor === 'time1') return '🏆 Time 1';
    if (vencedor === 'time2') return '🏆 Time 2';
    if (vencedor === 'empate') return '🤝 Empate';
    return vencedor; // Caso venha outro formato
  };

  // Garante que a tabela não quebre se "dados" não for um array ou estiver vazio
  if (!dados || dados.length === 0) {
    return <p className="tabela-vazia">Nenhuma partida registrada até o momento.</p>;
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
        {dados.map((p) => (
          <tr key={p.ID}>
            <td>{p.ID}</td>
            <td>{p.data}</td>
            <td className="placar-celula">
              <strong>{p.time1_placar}</strong> × <strong>{p.time2_placar}</strong>
            </td>
            <td>{p.gol_time1 || '-'}</td>
            <td>{p.gol_time2 || '-'}</td>
            <td>{p.assistencia_time1 || '-'}</td>
            <td>{p.assistencia_time2 || '-'}</td>
            <td className={`vencedor-${p.vencedor}`}>
              {formatarVencedor(p.vencedor)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TabelaPartidas;