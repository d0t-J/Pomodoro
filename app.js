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
    focusMinutes: 1,
    breakMinutes: 5,
    remainingSeconds: 25 * 60,
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
    } else if (sessionState.remainingSeconds === 0) {
        completeCurrentSession();
    }
}

function render() {
    timerDisplay.textContent = formatTime(sessionState.remainingSeconds);

    timerStatus.textContent =
        sessionState.mode === "focus"
            ? sessionState.isRunning
                ? "Focus session in progress "
                : "Focus session ready"
            : sessionState.isRunning
              ? "Break in progress"
              : "Break ready";

    cycles.textContent = `Cycles Completed: ${sessionState.completedFocusSessions}`;

    startBtn.disabled = sessionState.isRunning;
    pauseBtn.disabled = !sessionState.isRunning;
}

function startTimer() {
    if (sessionState.isRunning) {
        return;
    }

    sessionState.isRunning = true;

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
    sessionState.timerId = null;

    // ! Debug statement
    console.log(`Timer ID upon pausing timer: ${sessionState.timerId}`);

    render();
    timerStatus.textContent = "Focus session paused";
}

function resetTimer() {
    clearInterval(sessionState.timerId);

    sessionState.mode = "focus";
    sessionState.isRunning = false;
    sessionState.timerId = null;
    sessionState.remainingSeconds = sessionState.focusMinutes * 60;

    render();
}

function completeCurrentSession() {
    clearInterval(sessionState.timerId);
    sessionState.timerId = null;

    if (sessionState.mode === "focus") {
        sessionState.completedFocusSessions += 1;
        sessionState.mode = "break";
        sessionState.remainingSeconds = sessionState.breakMinutes * 60;
    } else {
        sessionState.mode = "focus";
        sessionState.remainingSeconds = sessionState.focusMinutes * 60;
    }

    render();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

render();
