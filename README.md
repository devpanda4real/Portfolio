# Imesh Kaushalya — Cloud & Systems Engineering Portfolio

> A modern, high-performance engineering portfolio and interactive multi-OS cloud terminal emulator built with React, Vite, Tailwind CSS, and a modular data layer designed for seamless GitHub-based content updates.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React: 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Bundler: Vite](https://img.shields.io/badge/Bundler-Vite-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Academic Track](https://img.shields.io/badge/SLTC-BSc_Cloud_Computing-0284c7.svg)](https://sltc.ac.lk/)

---

## 📖 Overview

This repository hosts the professional engineering portfolio of **Imesh Kaushalya**, a Cloud Computing undergraduate (BSc Hons) at SLTC Research University.

The site features a cyber-engineering aesthetic with interactive mouse spotlight cards, a simulated dual-OS cloud terminal (PowerShell 7 / macOS zsh), automated privacy masking controls, a 6-palette ecosystem theme engine, and a live cloud mesh constellation background.

The architecture separates content from presentation: all personal details, projects, skills, education credentials, and leadership experiences are isolated into clean JavaScript data files under `src/data/`, allowing content updates directly from GitHub without modifying UI code.

---

## 🛠 Technology Stack

- **Frontend Core**: React 19, JavaScript (ES6+), JSX
- **Build Tool & Dev Server**: Vite 6 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS & Modern CSS3 (CSS Variables, Backdrop Filters, Keyframe Animations)
- **Icons & Typography**: Lucide Icons (`lucide-react`), Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*)
- **Local Server**: Native Node.js HTTP server (`serve.js`) with production build routing and privacy endpoints
- **CI/CD**: GitHub Actions workflow for zero-config automated deployment to GitHub Pages

---

## ✨ Key Features

1. **Modular Content Layer (`src/data/`)**:
   - Easily update your portfolio directly via GitHub web editor by modifying structured data files.
   - Clean separation between data and presentation components.

2. **Interactive Dual-OS Cloud Terminal**:
   - In-browser CLI emulator featuring a realistic dual-environment:
     - **Windows Terminal**: PowerShell 7.4 syntax and prompt.
     - **macOS / Darwin**: zsh 5.9 Apple Silicon node simulation.
   - Built-in commands: `help`, `about`, `skills`, `projects`, `education`, `contact`, `whoami`, `neofetch`, and `migration-news`.

3. **Featured Engineering Projects Showcase**:
   - **Luxora Luxury Concierge**: Flagship capstone (CCS2313 Group 08) featuring 71 Functional Requirements, 23 Non-Functional Requirements, 25 Business Rules, and live production deployment at [luxora.bond](https://luxora.bond/).
   - **Smart City Route Optimizer**: High-performance Java in-memory graph modeling and Dijkstra/BFS shortest-path transit algorithm.
   - **Detail Me**: Cloud-connected mobile technician dispatch architecture and state machine specifications.

4. **Multi-Palette Theme Engine**:
   - 6 curated palettes: `cyber-cyan`, `emerald-matrix`, `royal-amethyst`, `midnight-sapphire`, `tokyo-sunset`, and `nordic-titanium`.

5. **Super Admin Privacy & Visibility Matrix**:
   - Role-based privacy controls safeguarding private telephone and WhatsApp numbers while allowing recruiters to request verified inquiries.

---

## 📂 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml                   # Automated GitHub Pages CI/CD workflow
├── data/
│   ├── ecosystem-settings.example.json  # Safe default settings template
│   └── ecosystem-settings.json          # Local runtime settings (gitignored)
├── public/
│   ├── ecosystem-theme.js               # Theme engine persistence script
│   └── ecosystem-visibility.js          # Client privacy masking script
├── src/
│   ├── components/
│   │   ├── About.jsx                    # Academic background & bio cards
│   │   ├── AdminModal.jsx               # Super Admin privacy modal
│   │   ├── BackgroundCanvas.jsx         # Particle constellation canvas
│   │   ├── Contact.jsx                  # Direct channels & message form
│   │   ├── Experience.jsx               # Education progression & referees
│   │   ├── Footer.jsx                   # Copyright & site meta
│   │   ├── Hero.jsx                     # Headline, telemetry ribbon, CTAs
│   │   ├── Navbar.jsx                   # Sticky navigation & scroll progress
│   │   ├── ProjectModal.jsx             # Luxora BRD & team specification modal
│   │   ├── Projects.jsx                 # Filterable projects showcase
│   │   ├── Skills.jsx                   # 5-category technical matrix
│   │   ├── Terminal.jsx                 # Dual-OS PowerShell/zsh CLI
│   │   └── Toast.jsx                    # Floating toast notifications
│   ├── data/
│   │   ├── education.js                 # SLTC degree progress, A/L, O/L, languages
│   │   ├── experience.js                # Labs, leadership, academic referees
│   │   ├── profile.js                   # Bio, headlines, stats, social links
│   │   ├── projects.js                  # Complete catalog of showcase projects
│   │   ├── skills.js                    # Technical competencies & tools
│   │   └── terminalData.js              # CLI command outputs & migration radar
│   ├── App.jsx                          # Main application layout & state
│   └── main.jsx                         # React root mount entry point
├── .gitignore                           # Excludes node_modules, dist, secrets, data
├── ecosystem-theme.css                  # Theme engine styles
├── index.html                           # Vite HTML entry point
├── LICENSE                              # MIT License
├── package.json                         # Dependencies & project scripts
├── serve.js                             # Zero-dependency local preview server
├── start.bat                            # 1-click Windows runner script
└── vite.config.mjs                      # Vite configuration (port 8080, relative base)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install
```

### 3. Local Development
```bash
# Start Vite development server with hot-reload
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 4. Production Build
```bash
# Build production-ready optimized bundle into dist/
npm run build

# Preview the built production site
npm run preview
```

### 5. Local Server Preview
```bash
# Run the built site with the zero-dependency Node.js server
npm start
```

---

## ✏️ How to Update Your Content

You do not need to touch any React components to update your information. Simply edit the appropriate file inside `src/data/`:

| What to Update | File to Edit | Example Content |
| :--- | :--- | :--- |
| **Projects** | `src/data/projects.js` | Add a new project object to `projectsData` |
| **Skills** | `src/data/skills.js` | Add or update technical competencies |
| **Profile & Bio** | `src/data/profile.js` | Update your headline, bio, or links |
| **Education** | `src/data/education.js` | Update credits completed or CGPA |
| **Experience** | `src/data/experience.js` | Update leadership roles or referees |
| **Terminal CLI** | `src/data/terminalData.js` | Add custom terminal commands or radar articles |

---

## 🌐 Deploying to GitHub Pages

This repository is pre-configured for automated deployment to GitHub Pages via GitHub Actions:

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically trigger the included workflow (`.github/workflows/deploy.yml`), build the project, and publish it live!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
© 2026 [Imesh Kaushalya](https://github.com/devpanda4real).
