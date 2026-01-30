import { useState, useEffect } from "react";
import { getMaterials } from "../services/api"; // importa la función del servicio

export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        <div key={mat.id_num} className=" col-4 card mb-3" style={{ width: "18rem" }}>
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

                    ))}
            </div>

        </div>
    );
}


