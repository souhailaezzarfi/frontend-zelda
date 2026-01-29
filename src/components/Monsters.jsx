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
      <ul>
        {monsters.map((mon) => (
          <li key={mon.id}>{mon.name}</li>
          
        ))}
      </ul>
    </div>
  );
}
