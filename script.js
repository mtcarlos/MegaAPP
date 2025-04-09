window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.tab-content');

  // Navegación
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'dashboard') {
        updateDashboard();
        fetchWeather();
      }
    });
  });

  function createListItem(text, targetList) {
    const li = document.createElement('li');
    li.textContent = text;
    li.addEventListener('click', () => li.remove());
    document.getElementById(targetList).appendChild(li);
  }

  // Tareas
  document.getElementById('add-task').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    if (input.value.trim()) {
      createListItem(input.value, 'task-list');
      input.value = '';
      updateDashboard();
    }
  });

  // Compras
  document.getElementById('add-shopping').addEventListener('click', () => {
    const input = document.getElementById('shopping-input');
    if (input.value.trim()) {
      createListItem(input.value, 'shopping-list');
      input.value = '';
    }
  });

  // Gastos
  document.getElementById('add-expense').addEventListener('click', () => {
    const desc = document.getElementById('expense-desc');
    const amount = document.getElementById('expense-amount');
    if (desc.value.trim() && amount.value) {
      const text = `${desc.value} - $${parseFloat(amount.value).toFixed(2)}`;
      createListItem(text, 'expense-list');
      desc.value = '';
      amount.value = '';
      updateDashboard();
    }
  });

  function updateDashboard() {
    const taskCount = document.querySelectorAll('#task-list li').length;
    const expenses = [...document.querySelectorAll('#expense-list li')];
    let total = 0;
    expenses.forEach(item => {
      const match = item.textContent.match(/\$(\d+(\.\d{1,2})?)/);
      if (match) total += parseFloat(match[1]);
    });
    document.getElementById('task-count').textContent = taskCount;
    document.getElementById('expense-total').textContent = total.toFixed(2);
  }

  function fetchWeather() {
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
    const LAT = '40.4168';
    const LON = '-3.7038';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=es&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const temp = data.main.temp.toFixed(1);
        const desc = data.weather[0].description;
        const emoji = weatherToEmoji(data.weather[0].main);
        const weatherText = `${emoji} ${temp}ºC - ${desc.charAt(0).toUpperCase() + desc.slice(1)}`;
        document.querySelector('#dashboard .card:nth-of-type(2) p em').textContent = weatherText;
      })
      .catch(err => console.error('Error al obtener el clima:', err));
  }

  function weatherToEmoji(condition) {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'thunderstorm': return '⛈️';
      case 'snow': return '❄️';
      default: return '🌤️';
    }
  }

  // Calendario
  document.getElementById('add-event').addEventListener('click', () => {
    const date = document.getElementById('event-date').value;
    const desc = document.getElementById('event-desc').value;
    if (date && desc.trim()) {
      const li = document.createElement('li');
      li.textContent = `${date}: ${desc}`;
      document.getElementById('event-list').appendChild(li);
      document.getElementById('event-desc').value = '';
    }
  });

  // Pomodoro
  let pomodoroTime = 25 * 60;
  let timer;
  let isRunning = false;
  let isWork = true;

  function updatePomodoroDisplay() {
    const minutes = String(Math.floor(pomodoroTime / 60)).padStart(2, '0');
    const seconds = String(pomodoroTime % 60).padStart(2, '0');
    document.getElementById('pomodoro-timer').textContent = `${minutes}:${seconds}`;
  }

  document.getElementById('start-pomodoro').addEventListener('click', () => {
    if (!isRunning) {
      timer = setInterval(() => {
        pomodoroTime--;
        if (pomodoroTime <= 0) {
          clearInterval(timer);
          isWork = !isWork;
          pomodoroTime = isWork ? 25 * 60 : 5 * 60;
          document.getElementById('pomodoro-mode').textContent = isWork ? 'Trabajo' : 'Descanso';
        }
        updatePomodoroDisplay();
      }, 1000);
      isRunning = true;
    }
  });

  document.getElementById('pause-pomodoro').addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
  });

  document.getElementById('reset-pomodoro').addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    isWork = true;
    pomodoroTime = 25 * 60;
    document.getElementById('pomodoro-mode').textContent = 'Trabajo';
    updatePomodoroDisplay();
  });

  updatePomodoroDisplay();
});
