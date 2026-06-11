import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom"

import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Jogadores from "./pages/Jogadores"
import Partidas from "./pages/Partidas"
import AddJogador from "./pages/AddJogador"
import AddPartida from "./pages/AddPartida"

function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route
path="/"
element={<Dashboard/>}
/>

<Route
path="/jogadores"
element={<Jogadores/>}
/>

<Route
path="/partidas"
element={<Partidas/>}
/>

<Route
path="/add-jogador"
element={<AddJogador/>}
/>

<Route
path="/add-partida"
element={<AddPartida/>}
/>

</Routes>

</BrowserRouter>

)

}

export default App