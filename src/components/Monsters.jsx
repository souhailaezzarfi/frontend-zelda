import { useState, useEffect, useRef } from "react";
import { getMonsters, deleteMonster } from "../services/api"; // importa la función del servicio
import MonsterForm from "./MonsterForm";


export default function Monsters() {
    const [monsters, setMonsters] = useState([]);
    const [loading, setLoading] = useState(true);
    const formRef = useRef(null);
    const [selectedMonster, setSelectedMonsters] = useState(null);
    // Estado para mostrar el formulario
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [monsterToEdit, setMonsterToEdit] = useState(null);

    const [search, setSearch] = useState("");

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

    useEffect(() => {
        if (isFormOpen && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isFormOpen]);

    const handleSaveMonster = (newData) => {
        if (monsterToEdit) {
            // Editar: reemplazamos el monerial existente
            setMonsters(monsters.map(mon => mon.id_num === monsterToEdit.id_num ? newData : mon));
            alert("Monster actualitzat!");
        } else {
            // Agregar: le ponemos un id temporal
            setMonsters([...monsters, { ...newData, id_num: Date.now() }]);
            alert("Monster afegit!");
        }

        // Cerrar formulario y limpiar selección
        setIsFormOpen(false);
        setMonsterToEdit(null);
    };

    async function handleDeleteMonster(id_num) {
        if (!window.confirm("Segur que vols eliminar aquest monster?")) return;

        try {
            await deleteMonster(id_num);
            setMonsters(monsters.filter(mon => mon.id_num !== id_num)); // actualizar lista
            setSelectedMonsters(null);
            alert("Monster eliminat correctament!");
        } catch (err) {
            alert("Error en eliminar: " + err.message);
        }
    }

    const filteredMonsters = monsters.filter((mon) =>
        mon.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p>Cargando monsters...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h2>Lista de monsters</h2>
            <input
                type="text"
                className="form-control mb-3" style={{ width: "400px" }}
                placeholder="Cerca monster per nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {isFormOpen && (
                <div ref={formRef}>
                    <MonsterForm
                        initialData={monsterToEdit}  // <-- si es edición, aquí llegan los datos
                        onSubmit={handleSaveMonster} // función para guardar
                        onCancel={() => {
                            setIsFormOpen(false);
                            setMonsterToEdit(null);
                        }}
                    />
                </div>
            )}

            {!isFormOpen && (
                <button className="btn btn-success mb-3" onClick={() => setIsFormOpen(true)}>
                    Afegir Monster
                </button>
            )}

            <div className="row">
                 {filteredMonsters.map((mon) => (
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
                selectedMonster && (
                    <div className="modal-backdrop" style={backdropStyle}>
                        <div className="modal-content p-3" style={modalStyle}>
                            <div><img src={selectedMonster.image} alt="" width="100%" height="100%" /> </div>
                            <h3>{selectedMonster.name}</h3>
                            <p>Categoría: {selectedMonster.category}</p>
                            <p>Ubicaciones: {selectedMonster.common_locations.map((loc, index) => (
                                <span key={index}>{loc}<br /></span>
                            ))}
                            </p>
                            <p>Descripció: {selectedMonster.description}</p>
                            <p>Drops: {selectedMonster.drops.map((loc, index) => (
                                <span key={index}>{loc}<br /></span>
                            ))}</p>

                            <div className="mt-3  d-flex justify-content-center">
                                <button
                                    className="btn btn-primary ms-4"
                                    onClick={() => {
                                        setMonsterToEdit(selectedMonster); // le decimos qué monster editar
                                        setIsFormOpen(true);                 // abrimos el formulario
                                        setSelectedMonsters(null);           // opcional: cerrar el modal
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-danger ms-4"
                                    onClick={() => handleDeleteMonster(selectedMonster.id_num)}
                                >
                                    Eliminar
                                </button>
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