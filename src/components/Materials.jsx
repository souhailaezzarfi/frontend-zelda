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
      <ul>
        {materials.map((mat) => (
          <li key={mat.id}>{mat.name}</li>
          
        ))}
      </ul>
    </div>
  );
}
