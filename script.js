let timer;
let timeLeft;
let isRunning = false;
let timerContainer = document.getElementById("timer-container");
let videoFrame = document.getElementById("background-video");
let mode = 'focus';
let videoSrc = "";
let videoControlsEnabled = false;
let sessionCount = 0;
const modes = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('background-video', {
    height: '100%',
    width: '100%',
    videoId: 'YOUR_VIDEO_ID',
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'playlist': 'YOUR_VIDEO_ID',
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.setVolume(50); 
  if (!isRunning) {
    event.target.pauseVideo();
  }
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    document.getElementById("startPauseBtn").innerText = "🍥Start";
  } else {
    startTimer();
    document.getElementById("startPauseBtn").innerText = "🍵Pause";
  }
}

function setMode(newMode) {
  mode = newMode;
  document.querySelectorAll('.mode-buttons button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`button[onclick="setMode('${newMode}')"]`).classList.add('active');
  timeLeft = modes[newMode];
  document.getElementById("timer-display").innerText = `${Math.floor(timeLeft / 60)}:00`;
}

function startTimer() {
  if (isRunning) return;

  if (timeLeft === undefined) {
    timeLeft = modes[mode];
  }

  isRunning = true;
  updateTimer();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    isRunning = false;
    sessionCount++;
    if (mode === 'focus') {
      mode = sessionCount % 4 === 0 ? 'longBreak' : 'shortBreak';
    } else {
      mode = 'focus';
    }
    setMode(mode);
    startTimer();
    return;
  }

  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  document.getElementById("timer-display").innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  timeLeft--;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = modes[mode];
  document.getElementById("timer-display").innerText = `${Math.floor(timeLeft / 60)}:00`;
  document.getElementById("startPauseBtn").innerText = "🍥Start";
}

function setBackgroundFromInput() {
  let url = document.getElementById("youtube-url").value;
  setBackground(url);
}

function setBackground(url) {
  let videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (videoIdMatch) {
    let videoId = videoIdMatch[1];
    videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=0&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`;
    videoFrame.src = videoSrc;
  }
}

document.getElementById("add-task-btn").addEventListener("click", addTask);

function addTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
      li.classList.toggle('checked');
  });

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = taskText;

  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');
  taskContent.appendChild(checkbox);
  taskContent.appendChild(span);

  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-btn');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.addEventListener('click', () => {
      const newText = prompt("Edit task", span.textContent);
      if (newText !== null && newText.trim() !== '') {
          span.textContent = newText.trim();
      }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener('click', () => {
      li.remove();
  });

  const iconGroup = document.createElement('div');
  iconGroup.classList.add('icon-group');
  iconGroup.appendChild(editBtn);
  iconGroup.appendChild(deleteBtn);

  li.appendChild(taskContent); 
  li.appendChild(iconGroup); 

  document.getElementById('task-list').appendChild(li);
  taskInput.value = '';
}



function toggleCheck(checkbox) {
  const task = checkbox.parentElement;
  task.classList.toggle("checked");
}

function editTask(taskItem, oldText) {
  const newText = prompt("Edit your task", oldText);
  if (newText && newText.trim() !== "") {
      taskItem.querySelector('span').textContent = newText.trim();
  }
}

function deleteTask(taskItem) {
  taskItem.remove();
}

document.getElementById("task-list").addEventListener("click", function(e) {

    if (e.target.classList.contains("fa-trash")) {
      e.target.closest("li").remove();
    }
    
    if (e.target.classList.contains("fa-pencil")) {
      const taskItem = e.target.closest("li");
      const taskName = taskItem.querySelector(".task-name").textContent;
      const newTaskName = prompt("Edit your task:", taskName);
      if (newTaskName) {
        taskItem.querySelector(".task-name").textContent = newTaskName; 
      }
    }
});

const draggableElements = [
  document.getElementById("draggable-container"),
  document.getElementById("draggable-container1")
];

let isDragging = false;
let offsetX, offsetY;
let currentElement = null;

draggableElements.forEach(el => {
  el.addEventListener("mousedown", function (e) {
    isDragging = true;
    currentElement = el;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.body.style.userSelect = "none";
  });
});

document.addEventListener("mousemove", function (e) {
  if (isDragging && currentElement) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - currentElement.offsetWidth;
    const maxY = window.innerHeight - currentElement.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    currentElement.style.left = `${x}px`;
    currentElement.style.top = `${y}px`;
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
  currentElement = null;
  document.body.style.userSelect = "auto";
});

document.getElementById("add-task-btn").addEventListener("click", function () {
  const taskInput = document.getElementById("new-task");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", () => {
          li.classList.toggle("checked", checkbox.checked);
      });

      const span = document.createElement("span");
      span.textContent = taskText;

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => {
          const newText = prompt("Edit task:", span.textContent);
          if (newText !== null) {
              span.textContent = newText;
          }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
          li.remove();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      document.getElementById("task-list").appendChild(li);
      taskInput.value = "";
  }
});

 

