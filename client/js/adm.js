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
                "filters[situacao][$eq]": "Pendente",
                "populate": "*",
            }
        });

        const visitas = res.data.data;

        visitas.forEach(visita => {
            if (!visita) {
                console.error("Erro: `visita` está indefinida", visita);
                return;
            }

            const { documentId, data, duracao_inicio, duracao_fim, quantidade_alunos, escola, responsavel, situacao, serie } = visita;

            if (!data || !duracao_inicio || !duracao_fim) {
                console.error("Erro: Campos obrigatórios ausentes em visita", visita);
                return;
            }

            const [year, month, day] = data.split("-");
            const visitaData = new Date(`${month}/${day}/${year}`);

            let statusHTML = `<span class="status pendente">Pendente</span>`;

            const actionButtons = `
                <td class="action-buttons">
                    <button class="confirmar-btn" data-documentId="${documentId}" title="Confirmar visita">Confirmar</button>
                    <button class="recusar-btn" data-documentId="${documentId}" title="Recusar visita">Recusar</button>
                </td>
            `;

            const row = `
                <tr data-documentId="${documentId}">
                    <td>${visitaData.toLocaleDateString()}</td>
                    <td>${duracao_inicio.split(":").slice(0, 2).join(":")} - ${duracao_fim.split(":").slice(0, 2).join(":")}</td>
                    <td>${quantidade_alunos}</td>
                    <td>${serie}</td>
                    <td>${escola ? escola.nome : "Não informado"}</td>
                    <td>${responsavel ? responsavel.username : "Não informado"}</td>
                    <td>${statusHTML}</td>
                    ${actionButtons}
                </tr>
            `;
            tabelaVisitas.innerHTML += row;
        });

        document.querySelectorAll(".confirmar-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const visitaDocumentId = e.target.getAttribute("data-documentId");
                await atualizarStatusVisita(visitaDocumentId, "Confirmada");
            });
        });

        document.querySelectorAll(".recusar-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const visitaDocumentId = e.target.getAttribute("data-documentId");
                await atualizarStatusVisita(visitaDocumentId, "Recusada");
            });
        });

    } catch (error) {
        console.error("Erro ao carregar visitas:", error);
        alert("Erro ao carregar solicitações. Tente novamente mais tarde.");
    }
});

async function atualizarStatusVisita(visitaDocumentId, status) {
    try {
        const token = localStorage.getItem("token");

        await api.put(`/visitas/${visitaDocumentId}`, {
            data: { situacao: status }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert(`Visita ${status.toLowerCase()} com sucesso!`);
        location.reload();
    } catch (error) {
        console.error(`Erro ao atualizar status da visita para ${status}:`, error);
        alert("Erro ao atualizar visita. Tente novamente.");
    }
}