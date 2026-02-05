import { useState, useEffect } from "react";

export default function MonsterForm({ initialData = null, onSubmit, onCancel }) {
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        common_locations: "",
        description: "",
        drops: "",
        image: "",
    });

    // Estado para los errores de validación
    const [errors, setErrors] = useState({});

    // Si recibimos datos para editar, rellenamos el formulario
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                category: initialData.category || "",
                common_locations: initialData.common_locations || "",
                description: initialData.description || "",
                drops: initialData.drops || "",
                image: initialData.image || "",
            });
        }
    }, [initialData]);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validar formulario
    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "El nombre es obligatorio";
        if (!formData.category) newErrors.category = "La categoría es obligatoria";
        if (!formData.common_locations) newErrors.common_locations = "La ubicación es obligatoria";
        if (!formData.image) newErrors.image = "La URL de la imagen es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Llamamos a la función que viene desde Materials.jsx
            onSubmit(formData);
        }
    };

    return (
        <div className="container mt-4">
            <h3>{initialData ? "Editar Monster" : "Afegir Monster"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nom</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>

                <div className="mb-3">
                    <label>Categoría</label>
                    <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} />
                    {errors.category && <small className="text-danger">{errors.category}</small>}
                </div>

                 <div className="mb-3">
                    <label>Ubicacions</label>
                    <input type="text" className="form-control" name="common_locations" value={formData.common_locations} onChange={handleChange} />
                    {errors.common_locations && <small className="text-danger">{errors.common_locations}</small>}
                </div>

                <div className="mb-3">
                    <label>Descripció</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                </div>

                
                <div className="mb-3">
                    <label>Drops</label>
                    <input type="text" className="form-control" name="drops" value={formData.drops} onChange={handleChange} />
                    {errors.drops && <small className="text-danger">{errors.drops}</small>}
                </div>

                <div className="mb-3">
                    <label>Imatge (URL)</label>
                    <input type="text" className="form-control" name="image" value={formData.image} onChange={handleChange} />
                    {errors.image && <small className="text-danger">{errors.image}</small>}
                </div>
  

                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary mb-3">Guardar</button>
                    <button type="button" className="btn btn-secondary mb-3" onClick={onCancel}> cancel·lar </button>
                </div>
            </form>
        </div>
    );
}
