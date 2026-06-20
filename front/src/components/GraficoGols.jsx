import {
  Bar
} from "react-chartjs-2"

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function GraficoGols({
  partidas = []
}) {

  const lista =
    Array.isArray(partidas)
      ? partidas
      : []

  const dados = {

    labels:

    lista.map(
      (_, i) =>
        `Jogo ${i + 1}`
    ),

    datasets: [
      {

        label: "Gols",

        data:

        lista.map(
          p =>
            Number(
              p?.time1_placar || 0
            ) +

            Number(
              p?.time2_placar || 0
            )
        ),

        backgroundColor:
          "#3B82F6",

        borderColor:
          "#60A5FA",

        borderWidth: 2,

        borderRadius: 8

      }
    ]
  }

  return (

    <div
      style={{
        width: "700px",
        height: "350px",
        margin: "auto"
      }}
    >

      <Bar

        data={dados}

        options={{

          responsive: true,

          maintainAspectRatio: false

        }}

      />

    </div>

  )

}