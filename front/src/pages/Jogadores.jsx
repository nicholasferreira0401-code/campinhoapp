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

          j.jogador

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

          g.jogador

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

<select

value={time}

onChange={

(e)=>

setTime(

e.target.value

)

}

>

<option value="">

Todos

</option>

<option value="time1">

time1

</option>

<option value="time2">

time2

</option>

</select>

<input

type="text"

className="campo-busca"

placeholder="Buscar jogador ou goleiro..."

value={busca}

onChange={

(e)=>

setBusca(

e.target.value

)

}

/>

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

nome={jogador.jogador}

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

nome={goleiro.jogador}

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