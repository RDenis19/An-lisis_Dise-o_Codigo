document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Login exitoso');
            // Redirigir según el rol
            if (data.rol === 'Administrador') {
                window.location.href = '/dashboard/dashboard-admin.html';
            } else if (data.rol === 'Doctor') {
                window.location.href = '/dashboard/dashboard-doctor.html';
            } else if (data.rol === 'Enfermera') {
                window.location.href = '/dashboard/dashboard-enfermera.html';
            }
        } else {
            alert(data.message); // Mostrar el mensaje de error que devolvió la API
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
        console.error(error);
    }
});
