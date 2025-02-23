import api from "./axiosConfig.js";

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");
  if (data) {
    document.getElementById("dia").value = data;
  }

  document.getElementById("dia").disabled = false;
};

document.addEventListener("DOMContentLoaded", async () => {
  const selectEscola = document.getElementById("escola");
  const form = document.querySelector("form");
  const token = localStorage.getItem("token");

  try {
    const res = await api.get("/escolas", {
      headers: { Authorization: `Bearer ${token}` },
      params: { populate: "*" },
    });

    const escolas = res.data.data;
    escolas.forEach((escola) => {
      const option = document.createElement("option");
      console.log(escola.documentId);
      option.value = escola.documentId;
      option.textContent = escola.nome;
      selectEscola.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar escolas:", error);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("Usuário não autenticado.");
      return;
    }

    const formatTime = (time) => time + ":00.000";

    const formData = {
      responsavel: parseInt(userId, 10),
      escola: { connect: [selectEscola.value] },
      quantidade_alunos: parseInt(
        document.getElementById("quantidade").value,
        10
      ),
      serie: document.getElementById("serie").value,
      curso: document.getElementById("curso").value,
      duracao_inicio: formatTime(
        document.getElementById("horario_inicio").value
      ),
      duracao_fim: formatTime(document.getElementById("horario_fim").value),
      data: document.getElementById("dia").value,
      situacao: "Pendente",
    };

    try {
      console.log("Enviando agendamento:", formData);

      await api.post(
        "/visitas",
        {
          data: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            Populate: "*",
          },
        }
      );
      alert("Agendamento realizado com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      alert("Erro ao enviar agendamento. Tente novamente.");
    }
  });
});
