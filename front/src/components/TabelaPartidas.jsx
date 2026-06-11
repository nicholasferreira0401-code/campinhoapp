function TabelaPartidas({dados}){

return(

<table className="tabela">

<thead>

<tr>

<th>ID</th>

<th>Data</th>

<th>Placar</th>

<th>Gol T1</th>

<th>Gol T2</th>

<th>Assist. T1</th>

<th>Assist. T2</th>

<th>Vencedor</th>

</tr>

</thead>

<tbody>

{

dados.map((p)=>(

<tr key={p.ID}>

<td>
{p.ID}
</td>

<td>
{p.data}
</td>

<td>
{p.time1_placar}
×

{p.time2_placar}
</td>

<td>
{p.gol_time1}
</td>

<td>
{p.gol_time2}
</td>

<td>
{p.assistencia_time1}
</td>

<td>
{p.assistencia_time2}
</td>

<td>
🏆 {p.vencedor}
</td>

</tr>

))

}

</tbody>

</table>

)

}

export default TabelaPartidas