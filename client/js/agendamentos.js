import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabelaVisitas = document.getElementById("tabela-visitas");

    let visitaSelecionada = null;

    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "signin.html";
            return;
        }

        const res = await api.get(`/visitas`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                "filters[responsavel][$eq]": userId, 
                "populate": "*" 
            }
        });

        const visitas = res.data.data;
        const now = new Date();

        visitas.forEach(visita => {
            if (!visita) {
                console.error("Erro: `visita` está indefinida", visita);
                return;
            }

            const { data, duracao_inicio, duracao_fim, quantidade_alunos, situacao, id } = visita; 

            if (!data || !duracao_inicio || !duracao_fim) {
                console.error("Erro: Campos obrigatórios ausentes em visita", visita);
                return;
            }

            // const visitaData = new Date(data);
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

            let avaliarHTML = "";
            if (situacao === "Confirmada" && visitaHoraFim < now) {
                avaliarHTML = `<a href="#" class="avaliar-link" data-id="${id}">Avaliar</a>`;
            }

            const row = `
                <tr>
                    <td>${visitaData.toLocaleDateString()}</td>
                    <td>${duracao_inicio.split(":").slice(0, 2).join(":")} - ${duracao_fim.split(":").slice(0, 2).join(":")}</td>
                    <td>${quantidade_alunos}</td>
                    <td>${statusHTML} </td>
                    <td>${avaliarHTML}</td>
                </tr>
            `;
            tabelaVisitas.innerHTML += row;
        });

        document.querySelectorAll(".avaliar-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                visitaSelecionada = e.target.getAttribute("data-id");
                // tentando converter pra integer 
                const visitaId = parseInt(visitaSelecionada)

                if (!visitaSelecionada) {
                    alert("Erro: ID da visita não encontrado!");
                    return;
                }
                let modal = document.createElement("div");
                modal.id = "modal-avaliacao";
                modal.classList.add("modal");
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>Avaliação</h2>
                        <textarea id="feedback" placeholder="Escreva sua avaliação aqui..."></textarea>
                        <div class="modal-actions">
                            <button id="fechar-modal">Cancelar</button>
                            <button id="enviar-avaliacao">Enviar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.style.display = "flex"; 

                document.getElementById("fechar-modal").addEventListener("click", () => {
                    modal.remove();
                });

                document.getElementById("enviar-avaliacao").addEventListener("click", async () => {
                    const feedback = document.getElementById("feedback").value.trim();
                
                    if (!feedback) {
                        alert("Por favor, escreva um feedback antes de enviar.");
                        return;
                    }
                
                    try {
                        const response = await api.post("/avaliacaos", {
                            data: {
                                feedback: feedback,
                                visita: visitaId
                            }
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }, 
                            params: {
                                populate: "visita"
                            }
                        });                        
                
                        console.log("Resposta da API:", response.data);
                
                        alert("Avaliação enviada com sucesso!");
                        modal.remove();
                    } catch (error) {
                        console.error("Erro ao enviar avaliação:", error);
                        alert("Erro ao enviar avaliação. Tente novamente.");
                    }
                });
                
            });
        });

    } catch (error) {
        console.error("Erro ao carregar visitas:", error);
        alert("Erro ao carregar seus agendamentos. Tente novamente mais tarde.");
    }
});
