import React, {
  useEffect,
  useState
} from 'react';

import CardJogador from '../components/CardJogador';
import CardGoleiro from '../components/CardGoleiro';

function Jogadores() {

  const [
    jogadores,
    setJogadores
  ] = useState([]);

  const [
    goleiros,
    setGoleiros
  ] = useState([]);

  const [
    busca,
    setBusca
  ] = useState('');

  const [
    time,
    setTime
  ] = useState('');

  useEffect(() => {

    carregar();

  }, []);

  async function carregar() {

    try {

      const respostaJogadores =
        await fetch(
          'http://127.0.0.1:5000/api/jogadores_df'
        );

      const dadosJogadores =
        await respostaJogadores.json();

      setJogadores(

        dadosJogadores.sort(

          (a, b) =>

            (b.total || 0)

            -

            (a.total || 0)

        )

      );

      const respostaGoleiros =

        await fetch(

          'http://127.0.0.1:5000/api/goleiros_df'

        );

      const dadosGoleiros =

        await respostaGoleiros.json();
  
      setGoleiros(

        dadosGoleiros.sort(

          (a, b) =>

            (b.defesas || 0)

            -

            (a.defesas || 0)

        )

      );

    }

    catch (erro) {

      console.log(

        erro

      );

    }

  }

  // filtros centralizados

  const jogadoresFiltrados =

    jogadores.filter(

      j =>

        (

          j.nome

          ?.toLowerCase()

          .includes(

            busca.toLowerCase()

          )

        )

        &&

        (

          !time

          ||

          j.time === time

        )

    );



  const goleirosFiltrados =

    goleiros.filter(

      g =>

        (

          g.nome

          ?.toLowerCase()

          .includes(

            busca.toLowerCase()

          )

        )

        &&

        (

          !time

          ||

          g.time === time

        )

    );


  return (

<div className="pagina-jogadores">
<div className="filtro-container">

  <div className="select-wrapper">
    <span>⚽</span>

    <select
      value={time}
      onChange={(e)=>setTime(e.target.value)}
    >
      <option value="">
        Todos
      </option>

      <option value="time1" class>
        Time 1
      </option>

      <option value="time2">
        Time 2
      </option>
    </select>
  </div>

  <div className="busca-wrapper">

    <span className="icone">
      🔎
    </span>

    <input
      type="text"
      placeholder="Buscar jogador ou goleiro..."
      value={busca}
      onChange={(e)=>setBusca(e.target.value)}
    />

  </div>

  <button
    className="btn-limpar"
    onClick={()=>{
      setBusca('');
      setTime('');
    }}
  >
    ↻ Limpar
  </button>

</div>

<div className="lista-cards">

<div className="titulo-secao">

<h1>

⚽ Jogadores de Linha

</h1>

</div>

{

jogadoresFiltrados.map(

(

jogador,

index

)=>(

<CardJogador

key={`j-${index}`}

nome={jogador.nome}

time={jogador.time}

posicao={index+1}

gols={jogador.gols}

assistencias={jogador.assistencias}

total={jogador.total}

/>

)

)

}

<div className="titulo-secao">

<h1>

🧤 Goleiros

</h1>

</div>

{

goleirosFiltrados.map(

(

goleiro,

index

)=>(

<CardGoleiro

key={`g-${index}`}

nome={goleiro.nome}

time={goleiro.time}

defesas={goleiro.defesas}

/>

)

)

}

</div>

</div>

);

}

export default Jogadores;