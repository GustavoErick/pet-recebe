import api from "./axiosConfig.js"

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const identificador = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      if (!identificador || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      await login(identificador, senha);
    });
  }
});

async function login(identificador, senha) {
  try {

    const res = await api.post("/auth/local", {
      identifier: identificador,
      password: senha,
    });

    const { jwt } = res.data;

    const userRes = await api.get("/users/me?populate=role", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: "role",
      },
    });

    const userData = userRes.data;

    localStorage.setItem("username", userData.username);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("role", userData.role.name);
    localStorage.setItem("token", jwt);

    window.location.href = "../html/index.html";
  } catch (error) {
    console.error("Erro no login:", error);

    if (error.response) {
      alert(error.response.data.error.message || "Falha no login. Verifique suas credenciais.");
    } else {
      alert("Erro ao conectar com o servidor.");
    }
  }
}