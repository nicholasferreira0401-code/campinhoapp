import React from 'react';

function CardJogador({
  nome,
  time,
  gols,
  assistencias,
  total
}) {
  // Garante que os valores sejam números (evita o bug de concatenar strings como "1" + "1" = "11")
  const golsValidos = parseInt(gols, 10) || 0;
  const assistenciasValidas = parseInt(assistencias, 10) || 0;
  
  // Se o total não vier pronto da API, calcula a soma corretamente
  const totalValido = total !== undefined && total !== null 
    ? parseInt(total, 10) 
    : (golsValidos + assistenciasValidas);

  // Simplifica a classe CSS: se "Time 1", vira "time-1". Se não houver, "sem-time"
  const classeTime = time 
    ? time.toLowerCase().replace(/\s+/g, '-') 
    : 'sem-time';

  return (
    <div className={`card ${classeTime}`}>
      <h2>⚽ {nome || 'Jogador Anônimo'}</h2>
      <div className="card-detalhes">
        <p><strong>Time:</strong> {time || 'Não definido'}</p>
        <p><strong>Gols:</strong> {golsValidos}</p>
        <p><strong>Assistências:</strong> {assistenciasValidas}</p>
        <p className="total-destaque"><strong>Total (G+A):</strong> {totalValido}</p>
      </div>
    </div>
  );
}

export default CardJogador;