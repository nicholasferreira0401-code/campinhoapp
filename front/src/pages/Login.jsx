import React, {
useState
} from "react";

import {
useNavigate
} from "react-router-dom";

import "../styles/Login.css"


function Login() {

const navigate =
useNavigate();

const [
email,
setEmail
] =
useState("");

const [
senha,
setSenha
] =
useState("");

const [
erro,
setErro
] =
useState("");


async function entrar() {

try{

const resposta =
await fetch(
"http://127.0.0.1:5000/auth/login",
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
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
"Erro ao entrar"
);

}


localStorage.setItem(
"token",
dados.token
);


navigate(
"/"
);

}

catch(e){

setErro(
e.message
);

}

}


function convidado(){

localStorage.setItem(
"guest",
"true"
);

navigate(
"/"
);

}


return (

<div className="login-page">

<div className="login-card">

<div className="login-logo">

⚽

</div>

<h1>

Campinho App

</h1>

<p>

Entre para administrar seus campeonatos

</p>


<div className="campo">

<span>

📧

</span>

<input
type="email"
placeholder="Seu email"
value={email}
onChange={(e)=>
setEmail(
e.target.value
)
}
/>

</div>


<div className="campo">

<span>

🔒

</span>

<input
type="password"
placeholder="Sua senha"
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


<button
className="btn-login"
onClick={entrar}
>

Entrar

</button>


<button
className="btn-guest"
onClick={convidado}
>

Entrar como convidado

</button>


<div className="footer">

Não possui conta?

<button
onClick={()=>

navigate(
"/cadastro"
)

}
>

Criar conta

</button>


</div>


</div>

</div>

);

}

export default Login;