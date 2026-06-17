import { useEffect, useState } from "react";
import CardJogador from "../components/CardJogador";

function Jogadores() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/jogadores_df")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao buscar dados");
        return r.json();
      })
      .then((dadosVindosDaApi) => {
        setDados(dadosVindosDaApi);
        setCarregando(false);
      })
      .catch((err) => {
        console.error(err);
        setDados([]);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h1>Jogadores</h1>

      {carregando ? (
        <p className="carregando">Carregando lista de jogadores...</p>
      ) : dados.length === 0 ? (
        <p className="lista-vazia">Nenhum jogador encontrado.</p>
      ) : (
        <div className="lista">
          {dados.map((j, index) => (
            <CardJogador
              // Usa o ID ou o próprio nome/index caso o ID venha nulo da planilha
              key={j.ID_jogador || `jogador-${index}`}
              nome={j.jogador}
              time={j.time}
              gols={j.gols}
              assistencias={j.assistencias}
              total={j.total}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Jogadores;