const timerStatus = document.querySelector("#timer-status");
const timerDisplay = document.querySelector("#timer-display");
const cycles = document.querySelector("#cycle-count");

const startBtn = document.querySelector("#start-btn");
const pauseBtn = document.querySelector("#pause-btn");
const resetBtn = document.querySelector("#reset-btn");

const focusTime = document.querySelector("#focus-duration");
const shortBreakTime = document.querySelector("#short-break-duration");
const longBreakTime = document.querySelector("#long-break-duration");

const sessionState = {
    mode: "focus",
    isRunning: false,
    isPaused: false,
    focusMinutes: 1,
    breakMinutes: 1,
    remainingSeconds: 1 * 10,
    completedFocusSessions: 0,
    timerId: null,
};

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function tick() {
    if (sessionState.remainingSeconds > 0) {
        sessionState.remainingSeconds -= 1;
        render();
        return;
    }

    completeCurrentSession();
}

function render() {
    timerDisplay.textContent = formatTime(sessionState.remainingSeconds);

    if (sessionState.isPaused) {
        timerStatus.textContent =
            sessionState.mode === "focus"
                ? "Focus session paused"
                : "Break paused";
    } else if (sessionState.mode === "focus") {
        timerStatus.textContent = sessionState.isRunning
            ? "Focus session in progress"
            : "Focus session ready";
    } else {
        timerStatus.textContent = sessionState.isRunning
            ? "Break in progress"
            : "Break ready";
    }

    cycles.textContent = `Cycles Completed: ${sessionState.completedFocusSessions}`;

    startBtn.disabled = sessionState.isRunning;
    startBtn.textContent = sessionState.isPaused ? "Resume" : "Start";
    pauseBtn.disabled = !sessionState.isRunning;
}

function startTimer() {
    if (sessionState.isRunning) {
        return;
    }

    sessionState.isRunning = true;
    sessionState.isPaused = false;
    sessionState.timerId = setInterval(tick, 1000);

    // ! Debug statement
    console.log(`Timer ID upon starting timer: ${sessionState.timerId}`);

    render();
}

function pauseTimer() {
    if (!sessionState.isRunning) {
        return;
    }

    clearInterval(sessionState.timerId);

    sessionState.isRunning = false;
    sessionState.isPaused = true;
    sessionState.timerId = null;

    // ! Debug statement
    console.log(`Timer ID upon pausing timer: ${sessionState.timerId}`);

    render();
}

function resetTimer() {
    clearInterval(sessionState.timerId);

    sessionState.mode = "focus";
    sessionState.isRunning = false;
    sessionState.isPaused = false;
    sessionState.timerId = null;
    sessionState.remainingSeconds = sessionState.focusMinutes * 60;
    sessionState.completedFocusSessions = 0;

    render();
}

function completeCurrentSession() {
    clearInterval(sessionState.timerId);
    sessionState.timerId = null;

    if (sessionState.mode === "focus") {
        sessionState.completedFocusSessions += 1;
        sessionState.mode = "break";
        sessionState.remainingSeconds = sessionState.breakMinutes * 10;
    } else {
        sessionState.mode = "focus";
        sessionState.remainingSeconds = sessionState.focusMinutes * 10;
    }

    sessionState.isRunning = true;
    sessionState.isPaused = false;
    sessionState.timerId = setInterval(tick, 1000);

    render();
    // ! Debug statement
    console.log(sessionState);
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

render();
