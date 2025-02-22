import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nomeInstituicao = document.getElementById("nome-instituicao").value.trim();
        const cidade = document.getElementById("cidade").value;
        const tipo = document.getElementById("tipo").value;

        if (!nomeInstituicao || !cidade || !tipo) {
            alert("Por favor, preencha todos os campos antes de cadastrar.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Usuário não autenticado. Faça login novamente.");
                window.location.href = "signin.html";
                return;
            }

            const response = await api.post("/escolas", {
                data: {
                    nome: nomeInstituicao,
                    cidade: cidade,
                    tipo: tipo
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Instituição cadastrada com sucesso:", response.data);
            alert("Instituição cadastrada com sucesso!");
            form.reset();
        } catch (error) {
            console.error("Erro ao cadastrar instituição:", error);
            alert("Erro ao cadastrar instituição. Tente novamente.");
        }
    });
});