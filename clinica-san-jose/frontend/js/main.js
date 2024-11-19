// Funciones de Interacción
document.getElementById('add-doctor-btn').addEventListener('click', () => {
    document.getElementById('doctor-form-container').style.display = 'block';
});

document.getElementById('cancel-doctor-form').addEventListener('click', () => {
    document.getElementById('doctor-form-container').style.display = 'none';
});

document.getElementById('doctor-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('doctor-name').value;
    const specialty = document.getElementById('doctor-specialty').value;
    const phone = document.getElementById('doctor-phone').value;
    const email = document.getElementById('doctor-email').value;
    const date = document.getElementById('doctor-date').value;

    try {
        const response = await fetch('/api/doctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: name,
                especialidad: specialty,
                telefono: phone,
                correo: email,
                fecha_contratacion: date,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').innerText = result.message;
            document.getElementById('message').className = 'success';
            loadDoctors(); // Recargar la lista de doctores
        } else {
            document.getElementById('message').innerText = result.message;
            document.getElementById('message').className = 'error';
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error en la comunicación con el servidor';
        document.getElementById('message').className = 'error';
    }
    document.getElementById('doctor-form-container').style.display = 'none';
});

// Función para cargar la lista de doctores
async function loadDoctors() {
    try {
        const response = await fetch('/api/doctors');
        const doctors = await response.json();

        const tableBody = document.getElementById('doctor-table-body');
        tableBody.innerHTML = ''; // Limpiar tabla antes de cargar

        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.nombre}</td>
                <td>${doctor.especialidad}</td>
                <td>${doctor.telefono}</td>
                <td>${doctor.correo}</td>
                <td>${doctor.fecha_contratacion}</td>
                <td>
                    <button class="edit-btn" onclick="editDoctor(${doctor.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteDoctor(${doctor.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar doctores:', error);
    }
}

// Función para eliminar doctor
async function deleteDoctor(id) {
    if (confirm('¿Seguro que deseas eliminar este doctor?')) {
        try {
            const response = await fetch(`/api/doctors/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            alert(result.message);
            loadDoctors();
        } catch (error) {
            console.error('Error al eliminar doctor:', error);
        }
    }
}

// Función para editar doctor
async function editDoctor(id) {
    const response = await fetch(`/api/doctors/${id}`);
    const doctor = await response.json();

    // Rellenar los campos con los datos del doctor
    document.getElementById('doctor-name').value = doctor.nombre;
    document.getElementById('doctor-specialty').value = doctor.especialidad;
    document.getElementById('doctor-phone').value = doctor.telefono;
    document.getElementById('doctor-email').value = doctor.correo;
    document.getElementById('doctor-date').value = doctor.fecha_contratacion;

    // Cambiar el título del formulario y mostrarlo
    document.getElementById('doctor-form-container').style.display = 'block';
    document.getElementById('doctor-form').onsubmit = async function(event) {
        event.preventDefault();
        const updatedDoctor = {
            nombre: document.getElementById('doctor-name').value,
            especialidad: document.getElementById('doctor-specialty').value,
            telefono: document.getElementById('doctor-phone').value,
            correo: document.getElementById('doctor-email').value,
            fecha_contratacion: document.getElementById('doctor-date').value
        };
        const response = await fetch(`/api/doctors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDoctor),
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('message').innerText = result.message;
            document.getElementById('message').className = 'success';
            loadDoctors(); // Recargar la lista de doctores
        } else {
            document.getElementById('message').innerText = result.message;
            document.getElementById('message').className = 'error';
        }
        document.getElementById('doctor-form-container').style.display = 'none';
    };
}

// Función para buscar doctor
document.getElementById('search-doctor').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#doctor-table-body tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Cargar la lista de doctores al cargar la página
loadDoctors();
