# ⚽ FIFA 2026

A modern React application for exploring the **FIFA World Cup 2026** tournament. Browse group standings, match fixtures, knockout brackets, venues, kick-off times, and top scorers through a responsive and interactive interface.

> **Live scores are not currently available.** At the time of development, there was no suitable free API that provided reliable live match data for the FIFA World Cup. The application instead focuses on providing tournament information, fixtures, standings, and bracket progression.

---

## 🌍 Live Demo

**GitHub Pages:** `https://khan-aliya.github.io/FIFA-World-Cup-2026/`

---

## ✨ Features

- 🏆 Group stage standings
- 📅 Complete tournament fixtures
- 🥅 Knockout stage bracket
- ⚽ Top scorers
- 📍 Match venues
- 🕒 Match dates and kick-off times
- 🎨 Theme toggle (Vivid & Electric)
- 📱 Fully responsive design
- ✨ Smooth GSAP animations
- 🌐 Interactive 3D graphics using Three.js
- 🔄 Automatic data refresh with graceful fallback to local mock data

---

## 🛠️ Built With

- React
- Vite
- Tailwind CSS
- GSAP
- Three.js
- Axios
- JavaScript (ES6+)

---

## 📊 Data Source

Tournament data is retrieved from the public **OpenFootball** World Cup dataset when available. If the dataset cannot be reached, the application automatically falls back to locally stored mock data to ensure the app remains functional.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/fifa-2026.git

cd fifa-2026

npm install

npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🚀 Deploy to GitHub Pages

```bash
npm run deploy
```

The deployment script publishes the production build to the `gh-pages` branch.

---

## 📁 Project Structure

```
src/
│
├── components/
├── hooks/
├── data/
├── assets/
├── App.jsx
└── main.jsx

public/

package.json
vite.config.js
```

---

## 🎯 Future Improvements

- Live match scores when a suitable free API becomes available
- Player profiles and statistics
- Team detail pages
- Match search and filtering
- Tournament predictions
- Performance optimisations
- Additional tournament statistics

---

## 🤝 Contributing

Suggestions and improvements are always welcome. Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

## 👨‍💻 Author

Developed by **[Aliya Khan]**
