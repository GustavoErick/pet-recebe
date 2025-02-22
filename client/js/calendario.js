import api from './axiosConfig.js';

document.addEventListener('DOMContentLoaded', async function() {
  const occupiedDates = [];

  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if (!token || !userId) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = 'signin.html';
      return;
    }

    const res = await api.get('/visitas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        populate: '*',
      },
    });

    console.log(res.data);

    const visitas = res.data.data;

    visitas.forEach(visita => {
      if (!visita || !visita.data) {
        return;
      }

      occupiedDates.push(visita.data);
    });

    var today = new Date().toISOString().split('T')[0];

    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
      locale: 'pt-br',
      initialView: 'dayGridMonth',
      events: occupiedDates.map(data => ({
        title: 'Indisponível',
        start: data,
        color: '#FFCCCC',
      })),
      dayCellDidMount: function(info) {
        var day = info.date.getDay();
        var dataStr = info.date.toISOString().split('T')[0];

        if (day === 0 || day === 6) {
          info.el.style.backgroundColor = "#DDD";
        }
        if (occupiedDates.includes(dataStr)) {
          info.el.style.backgroundColor = "#FFCCCC";
        }
        if (dataStr < today) {
          info.el.style.backgroundColor = "#F5F5F5";
          info.el.style.pointerEvents = "none";
        }
      },
      dateClick: function(info) {
        var day = info.date.getDay();
        var dataStr = info.dateStr;

        if (dataStr < today) {
          alert("Não é possível agendar para dias passados");
        } else if (day === 0 || day === 6) {
          alert("Sábados e domingos não estão disponíveis");
        } else if (occupiedDates.includes(dataStr)) {
          alert("Data indisponível");
        } else {
          window.location.href = "../form/form.html?data=" + dataStr;
        }
      },
    });

    calendar.render();
  } catch (error) {
    console.error("Erro ao carregar visitas:", error);
    alert("Erro ao carregar os agendamentos. Tente novamente mais tarde.");
  }
});
