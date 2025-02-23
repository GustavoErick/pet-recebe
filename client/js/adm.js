import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabelaVisitas = document.getElementById("table-body");

    try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || !userRole) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "/client/auth/signin.html";
            return;
        }

        if (userRole !== "Admin") {
            alert("Acesso negado! Apenas administradores podem visualizar essa página.");
            window.location.href = "/client/index.html";
            return;
        }

        const res = await api.get("/visitas", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                populate: "escola,responsavel",
            }
        });

        const visitas = res.data.data;

        if (!visitas.length) {
            tabelaVisitas.innerHTML = `<tr><td colspan="6">Nenhuma solicitação encontrada.</td></tr>`;
            return;
        }

        visitas.forEach(visita => {
            const { data, duracao_inicio, duracao_fim, quantidade_alunos, escola, responsavel, situacao } = visita;

            const nomeEscola = escola ? escola.nome : "Desconhecida";
            const nomeResponsavel = responsavel ? responsavel.username : "Não informado";
            const statusClass = situacao === "Confirmada" ? "status aprovado" :
                                situacao === "Recusada" ? "status negado" : "status pendente";

            const row = `
                <tr>
                    <td>${new Date(data).toLocaleDateString()}</td>
                    <td>${duracao_inicio} - ${duracao_fim}</td>
                    <td>${quantidade_alunos}</td>
                    <td>${nomeEscola}</td>
                    <td>${nomeResponsavel}</td>
                    <td><span class="${statusClass}">${situacao}</span></td>
                </tr>
            `;
            tabelaVisitas.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao carregar visitas:", error);
        alert("Erro ao carregar solicitações. Tente novamente mais tarde.");
    }
});
