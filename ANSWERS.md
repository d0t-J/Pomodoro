## 1. How to run

There are two ways to run this project locally, as listed in the README. The simplest way is to open `index.html` directly in your browser from the project root. Since `app.js` is also in the root folder, it loads automatically.

The second way is to use the Live Server extension in VS Code. Open the project folder, install Live Server if needed, then right-click `index.html` and choose Open with Live Server. The page will open in the browser and reload when you save changes.

The deployed version is here: https://pomodoro-navy-three.vercel.app/

## 2. Stack & design choices

I used plain HTML and JavaScript because the project is small and I wanted to focus on getting the functionality working properly within the time I had. I was also balancing this with final examinations, so I did not spend much time on frontend design. My main goal was to understand the working of the project through the JavaScript implementation and make the logic reliable first.

Even though this is a frontend project, I tried to keep the code organized in a structured way by separating the timer state and the functions that handle rendering, ticking, pausing, resetting, and switching sessions. That gave the code a more controlled flow, similar to how I would think about OOP style responsibilities.

Two choices I made were:

The timer and control buttons are placed first in the page so the main action is immediately visible. That affects the main timer section with the Start, Pause, and Reset buttons.

The settings and history are placed below the timer so the user can focus on the current session first, and then adjust or review details after. That affects the settings section and the history section.

## 3. Responsive & accessibility

I did not focus heavily on frontend polish, but the page is simple enough that it still remains readable on different screen sizes because the content is stacked in a single column. On a 360px phone, it should still fit vertically without needing horizontal scrolling. On a 1440px laptop, it will still work normally, but it is not fully polished or designed to take advantage of the larger space.

One thing I knowingly skipped was custom focus styling and extra ARIA labels, because my main focus was making the timer logic work correctly first and I did not have enough time to polish the frontend.

## 4. AI usage

I used ChatGPT for a few things. First, I asked it for milestones and a rough plan for the project, and it gave me a step-by-step breakdown to follow. I used that as guidance, but I wrote the actual code myself.

I also used ChatGPT to review and verify parts of my implementation. In one case, it suggested that the reset button should preserve user settings, but I chose to make reset fully restore the timer to its default state because that felt cleaner to me based on my own experience. I also added the pause feature on my own, using the same timer approach as the rest of the controls.

## 5. Honest gap

The main thing that is not polished enough yet is the frontend presentation. If I had another day, I would make it more presentable with CSS or Bootstrap, improve the spacing and layout, and make the UI feel more finished overall.
