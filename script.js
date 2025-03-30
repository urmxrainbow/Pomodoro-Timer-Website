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
    videoId: 'YOUR_VIDEO_ID', // Replace with your desired YouTube video ID
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'playlist': 'YOUR_VIDEO_ID', // Required for looping the video
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.setVolume(50); // Set the desired volume
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
  timeLeft = modes[mode];
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
  document.getElementById("startPauseBtn").innerText = "Start";
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

// Task management logic
document.getElementById("add-task-btn").addEventListener("click", addTask);

function addTask() {
  const taskInput = document.getElementById("new-task");
  const taskValue = taskInput.value.trim();

  if (taskValue) {
    const taskList = document.getElementById("task-list");
    const newTask = document.createElement("li");

    newTask.innerHTML = `
      <input type="checkbox" onclick="toggleCheck(this)">
      <span>${taskValue}</span>
    `;

    taskList.appendChild(newTask);
    taskInput.value = "";
  }
}

function toggleCheck(checkbox) {
  const task = checkbox.parentElement;
  task.classList.toggle("checked");
}

document.getElementById("task-list").addEventListener("click", function(e) {
    // Delete task
    if (e.target.classList.contains("fa-trash")) {
      e.target.closest("li").remove(); // Remove the task item
    }
    
    // Edit task
    if (e.target.classList.contains("fa-pencil")) {
      const taskItem = e.target.closest("li");
      const taskName = taskItem.querySelector(".task-name").textContent;
      const newTaskName = prompt("Edit your task:", taskName);
      if (newTaskName) {
        taskItem.querySelector(".task-name").textContent = newTaskName; // Update the task name
      }
    }
});

// Select both draggable containers
const draggableElements = [
  document.getElementById("draggable-container"),
  document.getElementById("draggable-container1")
];

let isDragging = false;
let offsetX, offsetY;
let currentElement = null;

// Loop through each element and make it draggable
draggableElements.forEach(el => {
  el.addEventListener("mousedown", function (e) {
    isDragging = true;
    currentElement = el;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.body.style.userSelect = "none"; // Prevent text selection
  });
});

document.addEventListener("mousemove", function (e) {
  if (isDragging && currentElement) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Keep within viewport
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
