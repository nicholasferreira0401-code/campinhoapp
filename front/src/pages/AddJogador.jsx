import { useState } from "react";
import "../styles/formulario.css"; // Importando o CSS que você enviou

export default function AddJogador() {
  const [jogador, setJogador] = useState("");
  const [time, setTime] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  async function lidarComEnvio(e) {
    e.preventDefault();

    if (!jogador || !time) {
      setMensagem({ texto: "Preencha todos os campos!", tipo: "error" });
      return;
    }

    try {
      const resposta = await fetch("http://127.0.0.1:5000/api/add_jogador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jogador, time }),
      });

      if (resposta.ok) {
        setMensagem({ texto: "Jogador cadastrado com sucesso! ⚽", tipo: "success" });
        setJogador("");
        setTime("");
      } else {
        setMensagem({ texto: "Erro ao cadastrar o jogador.", tipo: "error" });
      }
    } catch (erro) {
      setMensagem({ texto: "Erro na conexão com o servidor.", tipo: "error" });
    }
  }

  return (
    <div className="container-form">
      <div className="card-form">
        <h1>Novo Jogador</h1>
        
        <form className="form" onSubmit={lidarComEnvio}>
          <input
            type="text"
            placeholder="Nome do jogador"
            value={jogador}
            onChange={(e) => setJogador(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="Time do jogador"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button type="submit" className="botao">
            Salvar Jogador
          </button>
        </form>

        {mensagem.texto && (
          <div className={`msg ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}
      </div>
    </div>
  );
}