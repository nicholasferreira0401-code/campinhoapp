import "../styles/formulario.css"
import { useState } from "react"

export default function AddJogador(){
  const [jogador, setJogador] = useState("")
  const [time, setTime] = useState("")
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("")

async function enviar(e){
  e.preventDefault()

  if (!jogador.trim() || !time.trim()) {
    setMsg("Preencha nome e time.")
    setMsgType("error")
    return
  }

  try {
    const resposta = await fetch(
      `http://127.0.0.1:5000/api/add_jogador?${new URLSearchParams({ jogador, time })}`
    )
    const dados = await resposta.json()

    if (resposta.ok) {
      setMsg(dados.mensagem || "Jogador salvo com sucesso.")
      setMsgType("success")
      setJogador("")
      setTime("")
    } else {
      setMsg(dados.erro || dados.mensagem || "Erro ao salvar jogador.")
      setMsgType("error")
    }
  } catch (erro) {
    setMsg(erro.message || "Falha na conexão com a API.")
    setMsgType("error")
  }
}

return(

<div
className="container-form"
>

<div
className="card-form"
>

<h1>

Adicionar Jogador

</h1>

<form
className="form"
onSubmit={enviar}
>

<label>

Nome

</label>

<input
  value={jogador}
  onChange={e => setJogador(e.target.value)}
  required
/>

<label>

Time

</label>

<input
  value={time}
  onChange={e => setTime(e.target.value)}
  required
/>

<button
className="botao"
>

Salvar

</button>

</form>

{msg && (
  <div className={`msg ${msgType}`}>
    {msg}
  </div>
)}

</div>

</div>

)

}