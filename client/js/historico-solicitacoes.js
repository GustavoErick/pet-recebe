import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabelaVisitas = document.getElementById("tabela-visitas");

    try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || !userRole) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "signin.html";
            return;
        }

        if (userRole !== "Admin") {
            alert("Acesso negado! Apenas administradores podem visualizar essa página.");
            window.location.href = "index.html";
            return;
        }

        const res = await api.get("/visitas", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                populate: "*",
            }
        });

        const visitas = res.data.data;

        visitas.forEach(visita => {
            if (!visita) {
                console.error("Erro: `visita` está indefinida", visita);
                return;
            }

            const { data, duracao_inicio, duracao_fim, quantidade_alunos, escola, responsavel, situacao } = visita;

            if (!data || !duracao_inicio || !duracao_fim) {
                console.error("Erro: Campos obrigatórios ausentes em visita", visita);
                return;
            }

            const [year, month, day] = data.split("-");
            const visitaData = new Date(`${month}/${day}/${year}`);
            const visitaHoraFim = new Date(`${data}T${duracao_fim}`);

            let statusHTML = "";
            if (situacao === "Confirmada") {
                statusHTML = `<span class="status aprovado">Confirmada</span>`;
            } else if (situacao === "Recusada") {
                statusHTML = `<span class="status negado">Recusada</span>`;
            } else {
                statusHTML = `<span class="status pendente">Pendente</span>`;
            }

            const row = `
                <tr>
                    <td>${visitaData.toLocaleDateString()}</td>
                    <td>${duracao_inicio.split(":").slice(0, 2).join(":")} - ${duracao_fim.split(":").slice(0, 2).join(":")}</td>
                    <td>${quantidade_alunos}</td>
                    <td>${escola.nome}</td>
                    <td>${responsavel.username}</td>
                    <td>${statusHTML}</td>
                </tr>
            `;
            tabelaVisitas.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao carregar visitas:", error);
        alert("Erro ao carregar solicitações. Tente novamente mais tarde.");
    }
});
