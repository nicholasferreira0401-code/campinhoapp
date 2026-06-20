import { useState } from "react";

import "../styles/formulario.css";

import {
  adicionarJogador,
} from "../services/jogadoresService";


export default function AddJogador() {
  console.log("ENTROU DASHBOARD")
  const [
    jogador,

    setJogador,

  ] = useState("")


  const [

    time,

    setTime,

  ] = useState("")


  const [

    mensagem,

    setMensagem,

  ] = useState({

    texto: "",

    tipo: "",

  })


  async function lidarComEnvio(
    e
  ) {

    e.preventDefault()


    if (

      !jogador ||

      !time

    ) {

      setMensagem({

        texto:

        "Preencha todos os campos!",

        tipo:

        "error",

      })

      return

    }


    try {

      await adicionarJogador({

        jogador,

        time,

      })


      setMensagem({

        texto:

        "Jogador cadastrado com sucesso! ⚽",

        tipo:

        "success",

      })


      setJogador("")

      setTime("")


    } catch (erro) {

      console.error(
        erro
      )


      setMensagem({

        texto:

        erro?.response?.data?.mensagem ||

        erro?.response?.data?.erro ||

        "Erro ao cadastrar jogador.",

        tipo:

        "error",

      })

    }

  }


  return (

    <div className="container-form">

      <div className="card-form">

        <h1>

          Novo Jogador

        </h1>


        <form

          className="form"

          onSubmit={lidarComEnvio}

        >

          <input

            type="text"

            placeholder="Nome do jogador"

            value={jogador}

            onChange={(e) =>

              setJogador(

                e.target.value

              )

            }

          />


          <input

            type="text"

            placeholder="Time do jogador"

            value={time}

            onChange={(e) =>

              setTime(

                e.target.value

              )

            }

          />


          <button

            type="submit"

            className="botao"

          >

            Salvar Jogador

          </button>

        </form>


        {

          mensagem.texto && (

            <div

              className={

                `msg ${mensagem.tipo}`

              }

            >

              {

                mensagem.texto

              }

            </div>

          )

        }

      </div>

    </div>

  )

}