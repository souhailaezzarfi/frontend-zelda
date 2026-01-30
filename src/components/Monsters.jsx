import { useState, useEffect } from "react";
import { getMonsters } from "../services/api"; // importa la función del servicio

export default function Monsters() {
    const [monsters, setMonsters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMonsters() {
            try {
                const data = await getMonsters();
                setMonsters(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMonsters();
    }, []);

    if (loading) return <p>Cargando monsters...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h2>Lista de monsters</h2>
            <div className="row">
                {monsters.map((mon) => (
                    <div key={mon.id_num} className=" col-4 card mb-3" style={{ width: "18rem" }}>
                        <img src={mon.image} className="card-img-top" alt={mon.name} />
                        <div className="card-body">
                            <h5 className="card-title">{mon.name}</h5>
                            <p className="card-text">
                                Tipo: {mon.category} <br />
                                Drops: {mon.drops} <br />
                               
                            </p>
                        </div>
                    </div>

                ))}
            </div>

        </div>
    );
}
