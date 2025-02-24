document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const loginLink = document.getElementById("loginLink");
  const perfilButton = document.getElementById("perfilButton");
  const agendButton = document.getElementById("agendButton");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  if (token) {
      if (logoutButton) logoutButton.style.display = "block";

      if (userRole === "Admin") {

          if (perfilButton) perfilButton.style.display = "none";
          if (agendButton) agendButton.style.display = "none";
      } else {
          if (perfilButton) perfilButton.style.display = "block";
          if (agendButton) agendButton.style.display = "block";
      }

      if (loginLink) loginLink.style.display = "none"; 
  }

  if (logoutButton) {
      logoutButton.addEventListener("click", () => {
          logout();
      });
  }
});

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("token");

  // Redireciona para a página de login após logout
  window.location.href = "/client/html/index.html";
}
