// Este archivo se encarga de hablar con la API
const API_BASE = "http://localhost:3001";

export async function getMaterials() {
  try {
    const response = await fetch(`${API_BASE}/materials`);
    if (!response.ok) throw new Error("No se pudo cargar la API");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Devuelve array vacío si falla
  }
  
}

export async function getMonsters() {
  try {
    const response = await fetch(`${API_BASE}/monsters`);
    if (!response.ok) throw new Error("No se pudo cargar la API");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Devuelve array vacío si falla
  }
}

export async function deleteMaterial(id) {
    const response = await fetch(`http://localhost:3001/materials/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el material");
    }

    return true;
}

export async function deleteMonster(id) {
    const response = await fetch(`http://localhost:3001/monsters/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el monster");
    }

    return true;
}