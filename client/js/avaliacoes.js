import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    const avaliacoesContainer = document.getElementById("avaliacoes-container");

    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "signin.html";
            return;
        }

        const res = await api.get(`/avaliacaos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                "filters[usuario][$eq]": userId,
                "populate": "visita.escola"
            }
        });

        const avaliacoes = res.data.data;

        if (avaliacoes.length === 0) {
            avaliacoesContainer.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
            return;
        }

        avaliacoes.forEach(avaliacao => {
            const { id, feedback, createdAt, visita, documentId } = avaliacao;
            const dataFormatada = new Date(createdAt).toLocaleDateString("pt-BR");
            const nomeEscola = visita && visita.escola ? visita.escola.nome : "Escola não informada";
        
            const card = `
                <div class="card-avaliacao" data-id="${documentId}">
                    <h3>${nomeEscola}</h3>
                    <p class="feedback-text">${feedback}</p>
                    <span class="avaliacao-data">🗓 ${dataFormatada}</span>
                    <div class="avaliacao-actions">
                        <button class="editar-avaliacao" data-id="${documentId}">✏ Editar</button>
                        <button class="deletar-avaliacao" data-id="${documentId}">🗑 Excluir</button>
                    </div>
                </div>
            `;
            avaliacoesContainer.innerHTML += card;
        });

        document.querySelectorAll(".editar-avaliacao").forEach(botao => {
            botao.addEventListener("click", (e) => {
                const documentIdAvaliacao = e.target.getAttribute("data-id");
                // const documentIdAvaliacao = parseInt(e.target.getAttribute("data-id"));
                console.log("Enviando edição para avaliação ID:", documentIdAvaliacao);

                const card = document.querySelector(`.card-avaliacao[data-id="${documentIdAvaliacao}"]`);
                const feedbackText = card.querySelector(".feedback-text").innerText;
        
                let modal = document.createElement("div");
                modal.id = "modal-editar";
                modal.classList.add("modal");
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>Editar Avaliação</h2>
                        <textarea id="novo-feedback">${feedbackText}</textarea>
                        <div class="modal-actions">
                            <button id="fechar-modal">Cancelar</button>
                            <button id="salvar-edicao" data-id="${documentIdAvaliacao}">Salvar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.style.display = "flex";
        
                document.getElementById("fechar-modal").addEventListener("click", () => {
                    modal.remove();
                });
        
                document.getElementById("salvar-edicao").addEventListener("click", async () => {
                    const novoFeedback = document.getElementById("novo-feedback").value.trim();
        
                    if (!novoFeedback) {
                        alert("Por favor, escreva um feedback antes de salvar.");
                        return;
                    }
        
                    try {
                        await api.put(`/avaliacaos/${documentIdAvaliacao}`, {
                            data: { feedback: novoFeedback }
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
        
                        alert("Avaliação editada com sucesso!");
                        modal.remove();
                        location.reload();
                    } catch (error) {
                        console.error("Erro ao editar avaliação:", error);
                        alert("Erro ao editar a avaliação. Tente novamente.");
                    }
                });
            });
        });
        
        document.querySelectorAll(".deletar-avaliacao").forEach(botao => {
            botao.addEventListener("click", async (e) => {
                const documentIdAvaliacao = e.target.getAttribute("data-id");
                // const documentIdAvaliacao = e.target.getAttribute("data-documentId");
                // const documentIdAvaliacao = parseInt(e.target.getAttribute("data-id"));
                console.log("Enviando edição para avaliação ID:", documentIdAvaliacao);
        
                const confirmar = confirm("Tem certeza que deseja excluir esta avaliação?");
                if (!confirmar) return;
        
                try {
                    await api.delete(`/avaliacaos/${documentIdAvaliacao}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
        
                    alert("Avaliação excluída com sucesso!");
                    location.reload();
                } catch (error) {
                    console.error("Erro ao excluir avaliação:", error);
                    alert("Erro ao excluir a avaliação. Tente novamente.");
                }
            });
        });   

    } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        alert("Erro ao carregar suas avaliações. Tente novamente mais tarde.");
    }
});
