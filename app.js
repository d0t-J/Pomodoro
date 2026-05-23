const timerStatus = document.querySelector("#timer-status");
const timerDisplay = document.querySelector("#timer-display");
const cycles = document.querySelector("#cycle-count");

const startBtn = document.querySelector("#start-btn");
const pauseBtn = document.querySelector("#pause-btn");
const resetBtn = document.querySelector("#reset-btn");

const settingsForm = document.querySelector("#settings-form");
const focusTime = document.querySelector("#focus-duration");
const shortBreakTime = document.querySelector("#short-break-duration");
const longBreakTime = document.querySelector("#long-break-duration");

const historyList = document.querySelector("#history-list");

const STORAGE_KEYS = {
    history: "pomodoro",
};

const DEFAULT_SETTINGS = {
    focusMinutes: 1,
    shortBreakMinutes: 1,
    longBreakMinutes: 1,
};

const sessionState = {
    mode: "focus",
    isRunning: false,
    isPaused: false,
    focusMinutes: DEFAULT_SETTINGS.focusMinutes,
    shortBreakMinutes: DEFAULT_SETTINGS.shortBreakMinutes,
    longBreakMinutes: DEFAULT_SETTINGS.longBreakMinutes,
    remainingSeconds: DEFAULT_SETTINGS.focusMinutes * 10,
    completedFocusSessions: 0,
    timerId: null,
    history: [],
};

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function tick() {
    if (sessionState.remainingSeconds > 1) {
        sessionState.remainingSeconds -= 1;
        render();
        return;
    }

    sessionState.remainingSeconds = 0;
    render();
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

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    sessionState.history.forEach((session) => {
        const historyEntry = document.createElement("li");
        historyEntry.innerHTML = `
        <article>
            <h4>${session.duration}:00 Focus session</h4>
            <time>${session.completedAt}</time>
        </article>
        `;
        historyList.appendChild(historyEntry);
    });
}

function saveHistoryLocal() {
    const historyPayload = {
        date: getTodayDate(),
        history: sessionState.history,
    };

    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyPayload));
}

function loadHistoryLocal() {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.history);

    if (!savedHistory) {
        return;
    }
    const parsedHistory = JSON.parse(savedHistory);

    const isSameDay = parsedHistory.date === getTodayDate();

    if (!isSameDay) {
        localStorage.removeItem(STORAGE_KEYS.history);
        return;
    }
    sessionState.history = parsedHistory.history;
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

    sessionState.focusMinutes = DEFAULT_SETTINGS.focusMinutes;
    sessionState.shortBreakMinutes = DEFAULT_SETTINGS.shortBreakMinutes;
    sessionState.longBreakMinutes = DEFAULT_SETTINGS.longBreakMinutes;

    sessionState.remainingSeconds = DEFAULT_SETTINGS.focusMinutes * 10;
    sessionState.completedFocusSessions = 0;
    sessionState.history = [];
    localStorage.removeItem(STORAGE_KEYS.history);

    render();
}

function completeCurrentSession() {
    clearInterval(sessionState.timerId);
    sessionState.timerId = null;

    if (sessionState.mode === "focus") {
        sessionState.completedFocusSessions += 1;

        const completedSession = {
            type: "focus",
            completedAt: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            }),
            duration: sessionState.focusMinutes,
        };
        sessionState.history.unshift(completedSession);
        saveHistoryLocal();

        sessionState.mode = "break";
        sessionState.remainingSeconds = sessionState.shortBreakMinutes * 10;
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

function handleSettingsFormSubmit(e) {
    e.preventDefault();

    const newFocusMinutes = Number(focusTime.value);
    const newShortBreakMinutes = Number(shortBreakTime.value);
    const newLongBreakMinutes = Number(longBreakTime.value);

    if (
        Number.isNaN(newFocusMinutes) ||
        Number.isNaN(newShortBreakMinutes) ||
        Number.isNaN(newLongBreakMinutes) ||
        newFocusMinutes < 1 ||
        newShortBreakMinutes < 1 ||
        newLongBreakMinutes < 1
    ) {
        return;
    }

    sessionState.focusMinutes = newFocusMinutes;
    sessionState.shortBreakMinutes = newShortBreakMinutes;
    sessionState.longBreakMinutes = newLongBreakMinutes;
    sessionState.remainingSeconds = newFocusMinutes * 10;

    render();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

settingsForm.addEventListener("submit", handleSettingsFormSubmit);

loadHistoryLocal();
render();
