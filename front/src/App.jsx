import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Jogadores from "./pages/Jogadores"
import Partidas from "./pages/Partidas"

function App(){

return(

<BrowserRouter>

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

</Routes>

</BrowserRouter>

)

}

export default App