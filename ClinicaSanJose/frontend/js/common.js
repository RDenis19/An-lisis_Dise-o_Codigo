// frontend/js/common.js
document.getElementById("logoutButton")?.addEventListener("click", function () {
    // Eliminar cualquier dato del usuario en localStorage
    localStorage.removeItem("user");

    // Redirigir a la página de inicio de sesión
    window.location.href = "../views/index.html";
});
