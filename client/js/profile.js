import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  if (!token || !userId) {
    alert("Usuário não autenticado.");
    return;
  }

  const form = document.querySelector("form");

  try {
    const res = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data;
    const [nome, ...sobrenomeArray] = (user.username || "").split(" ");

    document.getElementById("nome").value = nome || "";
    document.getElementById("sobrenome").value = sobrenomeArray.join(" ") || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("telefone").value = user.telefone || "";
    document.getElementById("cargo").value = user.cargo || "";
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const username = `${nome} ${sobrenome}`.trim();

    const formData = {
      username,
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      cargo: document.getElementById("cargo").value.trim(),
    };

    const novaSenha = document.getElementById("nova-senha").value.trim();
    const confirmarSenha = document
      .getElementById("confirmar-senha")
      .value.trim();

    if (novaSenha || confirmarSenha) {
      if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem. Por favor, digite novamente.");
        return;
      }
      formData.password = novaSenha;
    }

    try {
      await api.put(`/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    }
  });
});
