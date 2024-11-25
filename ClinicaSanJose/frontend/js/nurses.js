// frontend/js/nurses.js
document.addEventListener("DOMContentLoaded", () => {
    loadNurses();

    document.getElementById("logoutButton")?.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./index.html";
    });

    document.getElementById("cancelNurseForm")?.addEventListener("click", () => {
        toggleAddNurseForm(); // Ocultar el formulario al cancelar
    });

    document.getElementById("submitNurseForm")?.addEventListener("click", () => {
        submitNurseForm(); // Guardar enfermera al hacer clic en "Guardar Enfermera"
    });

    document.getElementById("addNurseButton")?.addEventListener("click", () => {
        toggleAddNurseForm(); // Mostrar el formulario para agregar una nueva enfermera
    });
});

// Función para cargar todas las enfermeras
async function loadNurses() {
    try {
        const response = await fetch("http://localhost:3000/api/enfermeras");
        const nurses = await response.json();
        const tableBody = document.querySelector("#nursesTable tbody");
        tableBody.innerHTML = ""; // Limpiar la tabla

        nurses.forEach(nurse => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${nurse.id}</td>
                <td>${nurse.nombre}</td>
                <td>${nurse.telefono}</td>
                <td>${nurse.correo}</td>
                <td>${nurse.direccion}</td>
                <td>${nurse.contrasena || ''}</td>
                <td>
                    <button onclick="editNurse(${nurse.id})" class="btn-edit">Editar</button>
                    <button onclick="deleteNurse(${nurse.id})" class="btn-delete">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar enfermeras:", error);
    }
}

// Mostrar/Ocultar formulario de añadir enfermera
function toggleAddNurseForm(isEdit = false, nurseData = {}) {
    const form = document.getElementById("addNurseForm");
    form.classList.toggle("hidden");

    // Si es para editar, llenar el formulario con los datos de la enfermera
    if (isEdit && nurseData) {
        document.getElementById("nombre").value = nurseData.nombre || '';
        document.getElementById("telefono").value = nurseData.telefono || '';
        document.getElementById("correo").value = nurseData.correo || '';
        document.getElementById("direccion").value = nurseData.direccion || '';
        document.getElementById("contrasena").value = nurseData.contrasena || '';
        document.getElementById("submitNurseForm").dataset.editId = nurseData.id; // Almacenar el ID en el botón
    } else {
        // Limpiar formulario
        document.getElementById("nombre").value = '';
        document.getElementById("telefono").value = '';
        document.getElementById("correo").value = '';
        document.getElementById("direccion").value = '';
        document.getElementById("contrasena").value = '';
        delete document.getElementById("submitNurseForm").dataset.editId; // Eliminar el ID almacenado
    }
}

// Función para enviar los datos de la nueva enfermera o editar una existente
async function submitNurseForm() {
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const direccion = document.getElementById("direccion").value;
    const contrasena = document.getElementById("contrasena").value;

    if (nombre && telefono && correo && direccion && contrasena) {
        const newNurse = { nombre, telefono, correo, direccion, contrasena };
        const editId = document.getElementById("submitNurseForm").dataset.editId;

        try {
            let response;

            if (editId) {
                // Si existe el ID, es una edición
                response = await fetch(`http://localhost:3000/api/enfermeras/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newNurse),
                });
            } else {
                // Si no hay ID, es una nueva enfermera
                response = await fetch("http://localhost:3000/api/enfermeras", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newNurse),
                });
            }

            if (response.ok) {
                loadNurses();
                toggleAddNurseForm(); // Ocultar el formulario después de añadir/editar
            } else {
                console.error("Error al añadir o editar enfermera.");
                alert("Error al añadir o editar la enfermera. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al añadir o editar enfermera:", error);
        }
    } else {
        alert("Todos los campos son obligatorios");
    }
}

// Función para editar una enfermera
async function editNurse(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/enfermeras/${id}`);
        if (response.ok) {
            const nurseData = await response.json();
            toggleAddNurseForm(true, nurseData);
        } else {
            console.error("Error al obtener datos de la enfermera.");
        }
    } catch (error) {
        console.error("Error al obtener datos de la enfermera:", error);
    }
}

// Función para eliminar una enfermera
async function deleteNurse(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta enfermera?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/enfermeras/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                loadNurses();
            } else {
                console.error("Error al eliminar enfermera.");
                alert("Error al eliminar la enfermera. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al eliminar enfermera:", error);
        }
    }
}
