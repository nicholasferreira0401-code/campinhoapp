import {
BrowserRouter,
Routes,
Route,
Navigate,
useLocation
}
from "react-router-dom"

import "./App.css"

// COMPONENTES
import Navbar from "./components/Navbar"

// PÁGINAS
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"

import Home from "./pages/Home"
import MeusCampeonatos
from "./pages/MeusCampeonatos"

import Dashboard from "./pages/Dashboard"

import Jogadores from "./pages/Jogadores"
import Partidas from "./pages/Partidas"

import AddJogador from "./pages/AddJogador"
import AddPartida from "./pages/AddPartida"

import CriarCampeonato from "./pages/CriarCampeonato"



function PrivateRoute({

children,

allowGuest=true

}){

const token=
localStorage.getItem(
"token"
)

const guest=
localStorage.getItem(
"guest"
)

if(

!token

&&

!(allowGuest && guest)

){

return(

<Navigate
to="/login"
replace
/>

)

}

return children

}




function Layout(){

const location =
useLocation()

const paginasSemNavbar = [

"/login",
"/cadastro"

]

const mostrarNavbar =
!paginasSemNavbar.includes(
location.pathname
)

const mostrarLayoutCompleto =
location.pathname !== "/"

return(

<>

{

mostrarLayoutCompleto

?

<div className="app-layout">

{

mostrarNavbar
&&
<Navbar/>

}

<main className="page-content">

<Routes>

<Route
path="/"
element={
<PrivateRoute>
<Home/>
</PrivateRoute>
}
/>

<Route
path="/login"
element={<Login/>}
/>

<Route
path="/cadastro"
element={<Cadastro/>}
/>

<Route
path="/meus-campeonatos"
element={
<PrivateRoute>
<MeusCampeonatos/>
</PrivateRoute>
}
/>

<Route
path="/criar"
element={
<PrivateRoute allowGuest={false}>
<CriarCampeonato/>
</PrivateRoute>
}
/>

<Route
path="/campeonato/:id"
element={
<PrivateRoute>
<Dashboard/>
</PrivateRoute>
}
/>

<Route
path="/jogadores"
element={
<PrivateRoute>
<Jogadores/>
</PrivateRoute>
}
/>

<Route
path="/partidas"
element={
<PrivateRoute>
<Partidas/>
</PrivateRoute>
}
/>

<Route
path="/add-jogador"
element={
<PrivateRoute allowGuest={false}>
<AddJogador/>
</PrivateRoute>
}
/>

<Route
path="/add-partida"
element={
<PrivateRoute allowGuest={false}>
<AddPartida/>
</PrivateRoute>
}
/>

</Routes>

</main>

</div>

:

<Routes>

<Route
path="/"
element={
<PrivateRoute>
<Home/>
</PrivateRoute>
}
/>

</Routes>

}

</>

)

}



function App(){

return(

<BrowserRouter>

<Layout/>

</BrowserRouter>

)

}


export default App