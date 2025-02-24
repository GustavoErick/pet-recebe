import api from "./axiosConfig.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tabelaVisitas = document.getElementById("tabela-visitas");
    let documentIdVisita = null;

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
            if (!visita || !visita.documentId) return;

            const { data, duracao_inicio, duracao_fim, quantidade_alunos, situacao, documentId, escola, serie, curso, avaliacao } = visita;

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
                if (!avaliacao || avaliacao.length === 0) {
                    avaliarHTML = `<a href="#" class="avaliar-link" data-id="${documentId}">Avaliar</a>`;
                } else {
                    avaliarHTML = `<span class="avaliado">Avaliado</span>`;
                }
            }

            let actionsHTML = "";
            if (situacao !== "Confirmada" || visitaHoraFim > now) {
                actionsHTML = `
                    <a href="#" class="editar-link" data-id="${documentId}">Editar</a> | 
                    <a href="#" class="deletar-link" data-id="${documentId}">Deletar</a>
                `;
            }

            const row = `
                <tr>
                    <td>${visitaData.toLocaleDateString()}</td>
                    <td>${duracao_inicio.slice(0, 5)} - ${duracao_fim.slice(0, 5)}</td>
                    <td>${quantidade_alunos}</td>
                    <td>${escola ? escola.nome : "Não informado"}</td>
                    <td>${statusHTML}</td>
                    <td>${avaliarHTML} ${actionsHTML}</td>
                </tr>
            `;
            tabelaVisitas.innerHTML += row;
        });

        document.querySelectorAll(".avaliar-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                documentIdVisita = e.target.getAttribute("data-id");
                console.log(documentIdVisita)
                if (!documentIdVisita) {
                    alert("Erro: documentId da visita não encontrado!");
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
                                visita: { 
                                    connect: [ documentIdVisita ]
                                 },
                                usuario: { id: userId }
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
                        location.reload();
                    } catch (error) {
                        console.error("Erro ao enviar avaliação:", error);
                        alert("Erro ao enviar avaliação. Tente novamente.");
                    }
                });
            });
        });

        document.querySelectorAll(".editar-link").forEach(link => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();
                documentIdVisita = e.target.getAttribute("data-id");

                if (!documentIdVisita) {
                    alert("Erro: documentId da visita não encontrado!");
                    return;
                }

                const res = await api.get(`/visitas/${documentIdVisita}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { populate: "*" }  
                });

                const visita = res.data.data;
                if (!visita) {
                    alert("Erro ao carregar dados da visita.");
                    return;
                }

                const escolasRes = await api.get("/escolas", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { populate: "*" }
                });

                const escolas = escolasRes.data.data; 

                let modal = document.createElement("div");
                modal.id = "modal-editar";
                modal.classList.add("modal");
                modal.innerHTML = `
                    <div class="modal-content-editar">
                        <h2>Editar Visita</h2>
                        <label>Quantidade de alunos</label>
                        <input type="number" id="edit-quantidade" value="${visita.quantidade_alunos}">

                        <label>Horário Início</label>
                        <input type="time" id="edit-duracao-inicio" value="${visita.duracao_inicio}">

                        <label>Horário Fim</label>
                        <input type="time" id="edit-duracao-fim" value="${visita.duracao_fim}">

                        <label>Série</label>
                        <input type="text" id="edit-serie" value="${visita.serie}">

                        <label>Curso (opcional)</label>
                        <input type="text" id="edit-curso" value="${visita.curso || ""}">

                        <label>Data</label>
                        <input type="date" id="edit-data" value="${visita.data}">

                        <label>Escola</label>
                        <select id="edit-escola"></select>

                        <div class="modal-actions">
                            <button id="fechar-modal">Cancelar</button>
                            <button id="salvar-edicao">Salvar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.style.display = "flex";

                const selectEscola = document.getElementById("edit-escola");
                selectEscola.innerHTML = ""; 

                escolas.forEach(escola => {
                    const option = document.createElement("option");
                    option.value = escola.documentId;
                    option.textContent = escola.nome;

                    if (visita.escola && visita.escola.documentId === escola.documentId) {
                        option.selected = true;
                    }

                    selectEscola.appendChild(option);
                });

                document.getElementById("fechar-modal").addEventListener("click", () => {
                    modal.remove();
                });

                document.getElementById("salvar-edicao").addEventListener("click", async () => {
                    const quantidade = parseInt(document.getElementById("edit-quantidade").value, 10);
                    let duracaoInicio = document.getElementById("edit-duracao-inicio").value;
                    let duracaoFim = document.getElementById("edit-duracao-fim").value;
                    const serie = document.getElementById("edit-serie").value;
                    const curso = document.getElementById("edit-curso").value;
                    const data = document.getElementById("edit-data").value;
                    const escolaId = document.getElementById("edit-escola").value;
                
                    duracaoInicio = duracaoInicio.includes(":00.000") ? duracaoInicio : duracaoInicio + ":00.000";
                    duracaoFim = duracaoFim.includes(":00.000") ? duracaoFim : duracaoFim + ":00.000";
                
                    const payload = {
                        data: {
                            quantidade_alunos: quantidade,
                            serie: serie,
                            curso: curso, 
                            duracao_inicio: duracaoInicio,
                            duracao_fim: duracaoFim,
                            data: data,
                            situacao: "Pendente", 
                            escola: { connect: [escolaId] }
                        }
                    };
                
                    console.log("Payload enviado:", JSON.stringify(payload, null, 2)); 
                
                    try {
                        await api.put(`/visitas/${documentIdVisita}`, payload, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                
                        alert("Visita editada com sucesso!");
                        modal.remove();
                        location.reload();
                    } catch (error) {
                        console.error("Erro ao atualizar visita:", error.response ? error.response.data : error);
                        alert("Erro ao atualizar visita. Tente novamente.");
                    }
                });
            });
        });

        document.querySelectorAll(".deletar-link").forEach(link => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();
                documentIdVisita = e.target.getAttribute("data-id");

                if (confirm("Tem certeza que deseja excluir esta visita?")) {
                    await api.delete(`/visitas/${documentIdVisita}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    alert("Visita excluída com sucesso!");
                    location.reload();
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar visitas:", error);
        alert("Erro ao carregar seus agendamentos. Tente novamente mais tarde.");
    }
});