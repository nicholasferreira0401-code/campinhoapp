import React from 'react';

function CardGoleiro({

  nome,
  time,
  defesas

}) {

  const defesasValidas =
    parseInt(
      defesas,
      10
    ) || 0;

  const classeTime =
    time
      ? time
          .toLowerCase()
          .replace(
            /\s+/g,
            '-'
          )
      : 'sem-time';

  return (

    <div className={`card ${classeTime}`}>

      <h2>
        🧤 {nome}
      </h2>

      <div className="card-detalhes">

        <p>
          <strong>Time:</strong>
          {' '}
          {time}
        </p>

        <p className="total-destaque">

          <strong>
            Defesas:
          </strong>

          {' '}

          {defesasValidas}

        </p>

      </div>

    </div>

  );

}

export default CardGoleiro;