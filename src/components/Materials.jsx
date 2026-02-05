import { useState, useEffect, useRef } from "react";
import { getMaterials } from "../services/api"; // importa la función del servicio
import MaterialForm from "./MaterialForm";


export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const formRef = useRef(null);

    //estado para el material seleccionado (modal)
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    // Estado para mostrar el formulario
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [error, setError] = useState(null);
    //estado para el material seleccionado para editar (modal)
    const [materialToEdit, setMaterialToEdit] = useState(null);


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

    useEffect(() => {
        if (isFormOpen && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isFormOpen]);



    const handleSaveMaterial = (newData) => {
        if (materialToEdit) {
            // Editar: reemplazamos el material existente
            setMaterials(materials.map(mat => mat.id_num === materialToEdit.id_num ? newData : mat));
            alert("Material actualitzat!"); // mensaje en catalán
        } else {
            // Agregar: le ponemos un id temporal
            setMaterials([...materials, { ...newData, id_num: Date.now() }]);
            alert("Material afegit!"); // mensaje en catalán
        }

        // Cerrar formulario y limpiar selección
        setIsFormOpen(false);
        setMaterialToEdit(null);
    };

    if (loading) return <p>Cargando materiales...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h2>Lista de materiales</h2>
            {isFormOpen && (
                <div ref={formRef}>
                    <MaterialForm
                        initialData={materialToEdit}  // <-- si es edición, aquí llegan los datos
                        onSubmit={handleSaveMaterial} // función para guardar
                        onCancel={() => {
                            setIsFormOpen(false);
                            setMaterialToEdit(null);
                        }}
                    />
                </div>
            )}

            {!isFormOpen && (
                <button className="btn btn-success mb-3" onClick={() => setIsFormOpen(true)}>
                    Afegir Material
                </button>
            )}

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
                                <button
                                    className="btn btn-primary ms-4"
                                    onClick={() => {
                                        setMaterialToEdit(selectedMaterial); // le decimos qué material editar
                                        setIsFormOpen(true);                 // abrimos el formulario
                                        setSelectedMaterial(null);           // opcional: cerrar el modal
                                    }}
                                >
                                    Editar
                                </button>

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


