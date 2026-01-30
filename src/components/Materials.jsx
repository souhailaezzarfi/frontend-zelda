import { useState, useEffect } from "react";
import { getMaterials } from "../services/api"; // importa la función del servicio

export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    //estado para el material seleccionado (modal)
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [error, setError] = useState(null);



    useEffect(() => {
        async function fetchMaterials() {
            try {
                const data = await getMaterials();
                setMaterials(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMaterials();
    }, []);

    if (loading) return <p>Cargando materiales...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h2>Lista de materiales</h2>
            <div className="row">
                {materials.map((mat) => (
                    <div key={mat.id_num} className=" col-4  mb-3" style={{ width: "18rem" }}>
                        <div className="card"
                            onClick={() => setSelectedMaterial(mat)} style={{ cursor: "pointer" }}>
                            <img src={mat.image} className="card-img-top" alt={mat.name} />
                            <div className="card-body">
                                <h5 className="card-title">{mat.name}</h5>
                                <p className="card-text">
                                    Tipo: {mat.category} <br />
                                    Efecto: {mat.cooking_effect} <br />
                                    Corazones: {mat.hearts_recovered}
                                </p>
                            </div>
                        </div>
                    </div>

                ))}
            </div>

            {
                selectedMaterial && (
                    <div className="modal-backdrop" style={backdropStyle}>
                        <div className="modal-content p-3" style={modalStyle}>
                            <div><img src={selectedMaterial.image} alt="" width="100%" height="100%" />  </div>
                            <h3>{selectedMaterial.name}</h3>
                            <p>Categoría: {selectedMaterial.category}</p>
                            <p>Ubicaciones: {selectedMaterial.common_locations.map((loc, index) => (
                                <span key={index}>{loc}<br /></span>
                            ))}
                            </p>
                            <p>Descripció: {selectedMaterial.description}</p>
                            <p>Efecto: {selectedMaterial.cooking_effect}</p>
                            <p>Corazones: {selectedMaterial.hearts_recovered}</p>

                             <div className="mt-3  d-flex justify-content-center">
                                <button className="btn btn-primary ms-4">Editar</button>
                                <button className="btn btn-danger ms-4">Eliminar</button>
                                <button className="btn btn-secondary ms-4" onClick={() => setSelectedMaterial(null)}>Cerrar</button>
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


