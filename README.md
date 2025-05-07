# Pomodoro Timer

A minimalist, professional Pomodoro Timer app with tabs for Pomodoro, Short Break, and Long Break modes, plus an editable task list. Built with Vue 3, Vite, and Tailwind CSS for a modern neon aesthetic.

## Features
- Pomodoro, Short Break, and Long Break timer modes
- Editable task list with persistence
- Minimalist UI with neon styling (custom Tailwind config)
- Responsive and accessible design
- Sound notification on timer end
- State persistence with localStorage

## Tech Stack
- **Vue 3** (Composition API)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **@tailwindcss/forms** (form styling)
- **PostCSS** & **Autoprefixer**

## Project Structure
```
pomodoro-timer/
├── public/
│   └── sounds/
│       └── notification.mp3
├── src/
│   ├── assets/
│   │   └── tailwind.css
│   ├── components/
│   │   └── PomodoroTimer.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js >= 16
- npm >= 7

### Install dependencies
```sh
npm install
```

### Start development server
```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for production
```sh
npm run build
```

### Lint and format
```sh
npm run lint
```

## Customization
- Edit `src/components/PomodoroTimer.vue` for timer logic and UI
- Tailwind config in `tailwind.config.js` for neon colors and effects
- Place custom sounds in `public/sounds/`

## License
GNU I guess...
