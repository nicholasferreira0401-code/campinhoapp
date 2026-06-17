import "../styles/formulario.css"
import { useState } from "react"

export default function AddPartida(){

const [data,setData]=useState("")

const [placar1,setPlacar1]=useState("")
const [placar2,setPlacar2]=useState("")

const [gol1,setGol1]=useState("")
const [gol2,setGol2]=useState("")

const [assist1,setAssist1]=useState("")
const [assist2,setAssist2]=useState("")

const [defesa1,setDefesa1]=useState("")
const [defesa2,setDefesa2]=useState("")

const [msg, setMsg] = useState("")
const [msgType, setMsgType] = useState("")

async function enviar(e) {
  e.preventDefault()

  if (!data || placar1 === "" || placar2 === "") {
    setMsg("Preencha data e placares antes de salvar.")
    setMsgType("error")
    return
  }

  const params = new URLSearchParams({
    data,
    time1_placar: placar1,
    time2_placar: placar2,
    gol_time1: gol1,
    gol_time2: gol2,
    assistente_time1: assist1,
    assistente_time2: assist2,
    defesa_time1: defesa1 || 0,
    defesa_time2: defesa2 || 0,
  })

  try {
    const resposta = await fetch(`http://127.0.0.1:5000/api/partidas?${params}`)
    const dados = await resposta.json()

    if (resposta.ok) {
      setMsg("✅ Partida cadastrada com sucesso.")
      setMsgType("success")
      setData("")
      setPlacar1("")
      setPlacar2("")
      setGol1("")
      setGol2("")
      setAssist1("")
      setAssist2("")
      setDefesa1("")
      setDefesa2("")
    } else {
      setMsg(`❌ ${dados.erro || dados.mensagem || "Erro ao salvar partida."}`)
      setMsgType("error")
    }
  } catch (erro) {
    setMsg(`❌ ${erro.message || "Falha ao conectar com a API."}`)
    setMsgType("error")
  }
}

return(

<div className="container-form">

<div className="card-form">

<h1>

⚽ Nova Partida

</h1>

<form
className="form"
onSubmit={enviar}
>

<label>Data</label>

<input
  type="date"
  value={data}
  onChange={e => setData(e.target.value)}
  required
/>

<label>Placar Time 1</label>

<input
  type="number"
  value={placar1}
  min="0"
  onChange={e => setPlacar1(e.target.value)}
  required
/>

<label>Placar Time 2</label>

<input
  type="number"
  value={placar2}
  min="0"
  onChange={e => setPlacar2(e.target.value)}
  required
/>

<label>Gols Time 1</label>

<input
  value={gol1}
  placeholder="Ex: Ratata, Ratata, Kaiozinho"
  onChange={e => setGol1(e.target.value)}
/>

<label>Gols Time 2</label>

<input
  value={gol2}
  placeholder="Ex: Tadala, JV, JV"
  onChange={e => setGol2(e.target.value)}
/>

<label>Assistências Time 1</label>

<input
  value={assist1}
  placeholder="Ex: Volvo, Ratata"
  onChange={e => setAssist1(e.target.value)}
/>

<label>Assistências Time 2</label>

<input
  value={assist2}
  placeholder="Ex: Tadala, JV"
  onChange={e => setAssist2(e.target.value)}
/>

<label>Defesas Goleiro Time 1</label>

<input
  type="number"
  value={defesa1}
  min="0"
  onChange={e => setDefesa1(e.target.value)}
/>

<label>Defesas Goleiro Time 2</label>

<input
  type="number"
  value={defesa2}
  min="0"
  onChange={e => setDefesa2(e.target.value)}
/>

<button
className="botao"
>

Salvar Partida

</button>

</form>

<div className={`msg ${msgType}`}>
  {msg}
</div>

</div>

</div>

)

}