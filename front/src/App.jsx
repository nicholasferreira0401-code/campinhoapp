import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Navbar from "./components/Navbar"
import "./App.css"

import Dashboard from "./pages/Dashboard"
import Jogadores from "./pages/Jogadores"
import Partidas from "./pages/Partidas"
import AddJogador from "./pages/AddJogador"
import AddPartida from "./pages/AddPartida"

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jogadores" element={<Jogadores />} />
            <Route path="/partidas" element={<Partidas />} />
            <Route path="/add-jogador" element={<AddJogador />} />
            <Route path="/add-partida" element={<AddPartida />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
