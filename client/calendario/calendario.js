document.addEventListener('DOMContentLoaded', function() {
  var occupiedDates = ['2025-02-10', '2025-02-14', '2025-02-20']
  var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    locale: 'pt-br',
    initialView: 'dayGridMonth',
    events: occupiedDates.map(data => ({
      title: 'Indisponível',
      start: data,
      color: '#FFCCCC'
    })),
    dayCellDidMount: function(info) {
      var day = info.date.getDay()
      if(day === 0 || day === 6) {
        info.el.style.backgroundColor = "#DDD"
      }
      
      var dataStr = info.date.toISOString().split('T')[0]
      if(occupiedDates.includes(dataStr)) {
        info.el.style.backgroundColor = "#FFCCCC"
      }
    },
    dateClick: function(info) {
      var day = info.date.getDay()
      var dataStr = info.dateStr
      if(day === 0 || day === 6) {
        alert("Sábados e domingos não estão disponíveis")
      } else if(occupiedDates.includes(dataStr)) {
        alert("Data indisponível")
      } else {
        window.location.href = "../form/form.html?data=" + dataStr
      }
    }
  })
  calendar.render()
})