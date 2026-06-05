# Science Quiz — Standalone Version

A self-contained HTML/CSS/JS quiz app. No build step, no dependencies, no server needed.

## How to run

1. Unzip the folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. That's it — it works entirely offline.

## What's inside

- **index.html** — Main page shell
- **styles.css** — All styling, dark mode support, and animations
- **questions.js** — Question banks for Physics, Chemistry, and Biology (easy/medium/hard)
- **app.js** — Quiz logic: subject selection, difficulty + question count, gameplay, results, review, and dark mode toggle

## Features

- Pick a subject: Physics ⚛, Chemistry ⚗, or Biology 🧬
- Choose difficulty: Easy, Medium, or Hard
- Set how many questions you want (1 up to the available count)
- Instant feedback with explanations after each answer
- Results screen with a score ring
- Review screen showing every question, your answer, the correct answer, and the explanation
- Dark mode toggle (persists in localStorage)

## Editing

You can edit any file directly:
- Add more questions in `questions.js` — just follow the existing object shape.
- Tweak colors in `styles.css` by changing the `:root` variables.
- Adjust animations, spacing, or fonts in `styles.css`.
