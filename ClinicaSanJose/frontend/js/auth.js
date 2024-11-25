// frontend/js/auth.js

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
  
    try {
        const response = await fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, contrasena }),
        });
  
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "./admin_dashboard.html";
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Error al iniciar sesión. Por favor verifica las credenciales.");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error en el servidor. Inténtalo de nuevo más tarde.");
    }
  });
  