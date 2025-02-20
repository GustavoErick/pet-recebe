import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const nomeInput = document.getElementById("nome");
  const sobrenomeInput = document.getElementById("sobrenome");
  const emailInput = document.getElementById("email");
  const telefoneInput = document.getElementById("telefone");
  const cargoInput = document.getElementById("cargo");
  const senhaInput = document.getElementById("senha");
  const termosCheckbox = document.getElementById("termos");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = nomeInput.value.trim();
      const sobrenome = sobrenomeInput.value.trim();
      const email = emailInput.value.trim();
      const telefone = telefoneInput.value.trim();
      const cargo = cargoInput.value;
      const senha = senhaInput.value.trim();
      const aceitouTermos = termosCheckbox.checked;

      if (!nome || !sobrenome || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      if (!aceitouTermos) {
        alert("Você precisa aceitar os Termos & Condições para continuar.");
        return;
      }

      await cadastrar(nome, sobrenome, email, senha, telefone, cargo);
    });
  }
});

async function cadastrar(nome, sobrenome, email, senha, telefone, cargo) {
  try {

    const res = await api.post("/auth/local/register", {
      username: `${nome} ${sobrenome}`,
      email: email,
      password: senha,
    });

    const { jwt, user } = res.data; 
    const userId = user.id; 

    await api.put(`/users/${userId}`, {
      telefone: telefone,
      cargo: cargo,
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`, 
      },
    });

    const userRes = await api.get("/users/me", {
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

    alert(`Conta criada com sucesso! Bem-vindo, ${userData.username}!`);
    window.location.href = "../index.html"; 
  } catch (error) {
    console.error("Erro no cadastro:", error);

    if (error.response) {
      alert(error.response.data.error.message || "Falha no cadastro. Verifique os dados.");
    } else {
      alert("Erro ao conectar com o servidor.");
    }
  }
}
