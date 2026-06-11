import { useEffect, useState } from "react"

export default function Partidas() {

    const [partidas, setPartidas] = useState([])

    useEffect(() => {

        async function carregar() {

            try {

                const resposta =
                    await fetch(
                        "http://127.0.0.1:5000/api/partidas_df"
                    )

                const dados =
                    await resposta.json()

                console.log("API:", dados)

                setPartidas(dados)

            } catch (erro) {

                console.log(
                    "Erro:",
                    erro
                )

            }

        }

        carregar()

    }, [])

    return (

        <div
            style={{
                padding: "20px",
                color: "white"
            }}
        >

            <h1>
                Tabela de Partidas
            </h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Data</th>
                        <th>Placar</th>
                        <th>Gol T1</th>
                        <th>Gol T2</th>
                        <th>Assist T1</th>
                        <th>Assist T2</th>
                        <th>Vencedor</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        partidas.map(
                            (p) => (

                                <tr key={p.ID}>

                                    <td>{p.ID}</td>

                                    <td>
                                        {p.data}
                                    </td>

                                    <td>
                                        {p.time1_placar}
                                        {" x "}
                                        {p.time2_placar}
                                    </td>

                                    <td>
                                        {p.gol_time1}
                                    </td>

                                    <td>
                                        {p.gol_time2}
                                    </td>

                                    <td>
                                        {
                                            p.assistencia_time1 ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            p.assistencia_time2 ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {p.vencedor}
                                    </td>

                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    )

}