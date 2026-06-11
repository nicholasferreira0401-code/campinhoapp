import {
Bar
}
from "react-chartjs-2"

import {
Chart,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
}
from "chart.js"

Chart.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
)

export default function GraficoGols(
{
partidas
}
){

const dados={

labels:

partidas.map(
(_,i)=>
`Jogo ${
i+1
}`
),

datasets:[
{

label:"Gols",

data:

partidas.map(

p=>

Number(
p.time1_placar
)+

Number(
p.time2_placar
)

),

backgroundColor:

[
"#3B82F6"
],

borderColor:

[
"#60A5FA"
],

borderWidth:2,

borderRadius:8

}
]

}

return(

<div
style={{
width:"700px",
height:"350px",
margin:"auto"
}}
>

<Bar
data={dados}

options={{

responsive:true,

maintainAspectRatio:false

}}

 />

</div>

)

}