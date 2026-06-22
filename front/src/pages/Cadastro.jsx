import React,{
useState
}
from "react";

import {
useNavigate
}
from "react-router-dom";

import "../styles/Login.css";


function Cadastro(){

const navigate =
useNavigate();


const[
nome,
setNome
]=
useState("");

const[
email,
setEmail
]=
useState("");

const[
senha,
setSenha
]=
useState("");

const[
erro,
setErro
]=
useState("");

const[
sucesso,
setSucesso
]=
useState("");


async function cadastrar(){

try{

const resposta =
await fetch(
"http://127.0.0.1:5000/auth/register",
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
nome,
email,
senha
})
}
);


const dados =
await resposta.json();


if(
!resposta.ok
){

throw new Error(
dados.erro
||
"Erro ao cadastrar"
);

}


setSucesso(
"Conta criada!"
);


setTimeout(()=>{

navigate(
"/login"
);

},1500);

}

catch(e){

setErro(
e.message
);

}

}


return(

<div className="login-page">

<div className="login-card">

<div className="login-logo">

🏆

</div>


<h1>

Criar Conta

</h1>


<p>

Crie seu campeonato online

</p>


<div className="campo">

<input
placeholder="Nome"
value={nome}
onChange={(e)=>
setNome(
e.target.value
)}
/>

</div>


<div className="campo">

<input
type="email"

placeholder="Email"

value={email}

onChange={(e)=>

setEmail(
e.target.value
)

}

/>

</div>


<div className="campo">

<input

type="password"

placeholder="Senha"

value={senha}

onChange={(e)=>

setSenha(
e.target.value
)

}

/>

</div>


{

erro

&&

<div className="erro">

{erro}

</div>

}


{

sucesso

&&

<div
className="sucesso"
>

{sucesso}

</div>

}


<button
className="btn-login"
onClick={cadastrar}
>

Criar Conta

</button>


<div
className="footer"
>

Já possui conta?

<button
onClick={()=>navigate(
"/login"
)}
>

Entrar

</button>

</div>


</div>

</div>

);

}


export default Cadastro;