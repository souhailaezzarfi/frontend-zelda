import { useState, useEffect } from "react";
import { getMonsters } from "../services/api"; // importa la función del servicio

export default function Monsters() {
    const [monsters, setMonsters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonsters, setSelectedMonsters] = useState(null);
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
                    <div key={mon.id_num} className=" col-4  mb-3" style={{ width: "18rem" }}>
                        <div className="card"
                            onClick={() => setSelectedMonsters(mon)} style={{ cursor: "pointer" }}>
                            <img src={mon.image} className="card-img-top" alt={mon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{mon.name}</h5>
                                <p className="card-text">
                                    Tipo: {mon.category} <br />
                                    Drops: {mon.drops} <br />

                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {
                selectedMonsters && (
                    <div className="modal-backdrop" style={backdropStyle}>
                        <div className="modal-content p-3" style={modalStyle}>
                            <div><img src={selectedMonsters.image} alt="" width="100%" height="100%" /> </div>
                            <h3>{selectedMonsters.name}</h3>
                            <p>Categoría: {selectedMonsters.category}</p>
                            <p>Ubicaciones: {selectedMonsters.common_locations.map((loc, index) => (
                                <span key={index}>{loc}<br /></span>
                            ))}
                            </p>
                            <p>Descripció: {selectedMonsters.description}</p>
                            <p>Drops: {selectedMonsters.drops.map((loc, index) => (
                                <span key={index}>{loc}<br /></span>
                            ))}</p>

                            <div className="mt-3  d-flex justify-content-center">
                                <button className="btn btn-primary ms-4">Editar</button>
                                <button className="btn btn-danger ms-4">Eliminar</button>
                                <button className="btn btn-secondary ms-4" onClick={() => setSelectedMonsters(null)}>Cerrar</button>
                            </div>

                        </div>
                    </div>
                )
            }
        </div>
    );
}

const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    maxHeight: "85vh", // hasta 80% de la altura de la pantalla
    overflowY: "auto", // habilita scroll vertical si hay mucho contenido
};