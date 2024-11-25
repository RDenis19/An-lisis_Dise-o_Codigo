// frontend/js/doctors.js
document.addEventListener("DOMContentLoaded", () => {
    loadDoctors();

    document.getElementById("logoutButton")?.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./index.html";
    });

    document.getElementById("cancelDoctorForm")?.addEventListener("click", () => {
        toggleAddDoctorForm(); // Ocultar el formulario al cancelar
    });

    document.getElementById("submitDoctorForm")?.addEventListener("click", () => {
        submitDoctorForm(); // Guardar doctor al hacer clic en "Guardar Doctor"
    });

    document.getElementById("addDoctorButton")?.addEventListener("click", () => {
        toggleAddDoctorForm(); // Mostrar el formulario para agregar un nuevo doctor
    });
});

// Función para cargar todos los doctores
async function loadDoctors() {
    try {
        const response = await fetch("http://localhost:3000/api/doctores");
        const doctors = await response.json();
        const tableBody = document.querySelector("#doctorsTable tbody");
        tableBody.innerHTML = ""; // Limpiar la tabla

        doctors.forEach(doctor => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.nombre}</td>
                <td>${doctor.especialidad}</td>
                <td>${doctor.telefono}</td>
                <td>${doctor.correo}</td>
                <td>${doctor.contrasena || ''}</td>
                <td>
                    <button onclick="editDoctor(${doctor.id})" class="btn-edit">Editar</button>
                    <button onclick="deleteDoctor(${doctor.id})" class="btn-delete">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar doctores:", error);
    }
}

// Mostrar/Ocultar formulario de añadir doctor
function toggleAddDoctorForm(isEdit = false, doctorData = {}) {
    const form = document.getElementById("addDoctorForm");
    form.classList.toggle("hidden");

    // Si es para editar, llenar el formulario con los datos del doctor
    if (isEdit && doctorData) {
        document.getElementById("nombre").value = doctorData.nombre || '';
        document.getElementById("especialidad").value = doctorData.especialidad || '';
        document.getElementById("telefono").value = doctorData.telefono || '';
        document.getElementById("correo").value = doctorData.correo || '';
        document.getElementById("direccion").value = doctorData.direccion || '';
        document.getElementById("contrasena").value = doctorData.contrasena || '';
        document.getElementById("submitDoctorForm").dataset.editId = doctorData.id; // Almacenar el ID en el botón
    } else {
        // Limpiar formulario
        document.getElementById("nombre").value = '';
        document.getElementById("especialidad").value = '';
        document.getElementById("telefono").value = '';
        document.getElementById("correo").value = '';
        document.getElementById("direccion").value = '';
        document.getElementById("contrasena").value = '';
        delete document.getElementById("submitDoctorForm").dataset.editId; // Eliminar el ID almacenado
    }
}

// Función para enviar los datos del nuevo doctor o editar uno existente
async function submitDoctorForm() {
    const nombre = document.getElementById("nombre").value;
    const especialidad = document.getElementById("especialidad").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const direccion = document.getElementById("direccion").value;
    const contrasena = document.getElementById("contrasena").value;

    if (nombre && especialidad && telefono && correo && direccion && contrasena) {
        const newDoctor = { nombre, especialidad, telefono, correo, direccion, contrasena };
        const editId = document.getElementById("submitDoctorForm").dataset.editId;

        try {
            let response;

            if (editId) {
                // Si existe el ID, es una edición
                response = await fetch(`http://localhost:3000/api/doctores/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newDoctor),
                });
            } else {
                // Si no hay ID, es un nuevo doctor
                response = await fetch("http://localhost:3000/api/doctores", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newDoctor),
                });
            }

            if (response.ok) {
                loadDoctors();
                toggleAddDoctorForm(); // Ocultar el formulario después de añadir/editar
            } else {
                console.error("Error al añadir o editar doctor.");
                alert("Error al añadir o editar el doctor. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al añadir o editar doctor:", error);
        }
    } else {
        alert("Todos los campos son obligatorios");
    }
}

// Función para editar un doctor
async function editDoctor(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/doctores/${id}`);
        if (response.ok) {
            const doctorData = await response.json();
            toggleAddDoctorForm(true, doctorData);
        } else {
            console.error("Error al obtener datos del doctor.");
        }
    } catch (error) {
        console.error("Error al obtener datos del doctor:", error);
    }
}

// Función para eliminar un doctor
async function deleteDoctor(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este doctor?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/doctores/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                loadDoctors();
            } else {
                console.error("Error al eliminar doctor.");
                alert("Error al eliminar el doctor. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error al eliminar doctor:", error);
        }
    }
}
