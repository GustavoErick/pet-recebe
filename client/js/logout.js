document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const loginLink = document.getElementById("loginLink");
  const profileButton = document.getElementById("perfilButton");
  const scheduleButton = document.getElementById("agendButton");

  const token = localStorage.getItem("token");

  if (token) {
      logoutButton.style.display = "block";
      perfilButton.style.display = "block";
      agendButton.style.display = "block";

      loginLink.style.display = "none";
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

  window.location.href = "/client/html/index.html";
}
