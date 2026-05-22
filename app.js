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
    focusMinutes: 25,
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

function render() {
    timerDisplay.textContent = formatTime(sessionState.remainingSeconds);

    timerStatus.textContent =
        sessionState.mode === "focus"
            ? sessionState.isRunning
                ? "Focus Session in progress "
                : "Focus session ready"
            : sessionState.isRunning
              ? "Break in progress"
              : "Break ready";

    cycles.textContent = `Cycles Completed: ${sessionState.completedFocusSessions}`;

    startBtn.disabled = sessionState.isRunning;
    pauseBtn.disabled = !sessionState.isRunning;
}

render();
