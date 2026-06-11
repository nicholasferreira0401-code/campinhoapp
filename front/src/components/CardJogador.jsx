function CardJogador({

nome,
time,
gols,
assistencias,
total

}){

return(

<div className="card">

<h2>
⚽ {nome}
</h2>

<p>
Time: {time}
</p>

<p>
Gols: {gols}
</p>

<p>
Assistências: {assistencias}
</p>

<p>
Total: {total}
</p>

</div>

)

}

export default CardJogador