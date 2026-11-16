# Imesh Kaushalya | Cloud & Systems Engineering Portfolio

<p align="center">
  <a href="https://devpanda4real.github.io/Portfolio/">
    <img src="https://img.shields.io/badge/Live_Portfolio-Visit_Website-06b6d4?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Portfolio">
  </a>
  <a href="https://github.com/devpanda4real">
    <img src="https://img.shields.io/badge/GitHub-View_Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile">
  </a>
</p>

<p align="center">
  <strong>Exploring Cloud Computing, Systems Engineering and Modern Software Technologies.</strong>
  <br>
  A personal engineering portfolio showcasing academic development, technical projects, practical implementations and continuous learning.
</p>

---

## Overview

This repository contains the source code for my personal engineering portfolio, developed to document my academic journey, technical interests, projects and growing experience in Cloud Computing and Systems Engineering.

The portfolio combines a modern, responsive interface with an interactive terminal simulation and a modular content architecture. It is designed to provide recruiters, developers and technology enthusiasts with an accessible overview of my background and technical work.

**Live Website:** [devpanda4real.github.io/Portfolio](https://devpanda4real.github.io/Portfolio/)

### Key Highlights

- Interactive dual-environment terminal simulation (PowerShell and macOS zsh).
- Modular, data-driven portfolio architecture.
- Six configurable visual themes.
- Interactive project and academic information sections.
- Responsive interface with animated visual elements.
- Privacy-oriented contact visibility controls.
- Automated GitHub Pages deployment using GitHub Actions.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript (ES6+), JSX |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3.x, CSS3 |
| Icons | Lucide React |
| Typography | Plus Jakarta Sans, JetBrains Mono |
| Runtime | Node.js |
| Deployment | GitHub Pages |
| CI/CD | GitHub Actions |
| Version Control | Git, GitHub |

---

## Features

### 1. Interactive Terminal Environment

A browser-based command-line simulation designed to demonstrate familiarity with different operating system environments.

**Supported environments:**

- Windows PowerShell 7.4 simulation.
- macOS / Darwin zsh 5.9 simulation.
- Apple Silicon-style system information display.

**Available commands include:**

| Command | Description |
|---|---|
| `help` | Display available commands |
| `about` | View personal information |
| `whoami` | Display user profile |
| `skills` | Explore technical competencies |
| `projects` | Browse engineering projects |
| `education` | View academic background |
| `contact` | Display contact information |
| `neofetch` | Display simulated system information |
| `migration-news` | Explore migration-related information |

*Note: The terminal is an interactive simulation running in the browser. It does not execute commands on an actual operating system or cloud infrastructure.*

### 2. Modular Content Architecture

Portfolio information is separated from the user interface through structured JavaScript data modules.

The architecture allows content updates without modifying the main React components.

Content modules include:

- Profile and personal information.
- Education and academic progress.
- Technical skills and competencies.
- Projects and development work.
- Experience and leadership information.
- Terminal commands and associated content.

### 3. Interactive Theme Engine

Six visual themes are available:

- `cyber-cyan`
- `emerald-matrix`
- `royal-amethyst`
- `midnight-sapphire`
- `tokyo-sunset`
- `nordic-titanium`

The theme engine uses CSS variables and browser-side persistence to maintain the selected appearance.

### 4. Engineering Projects Showcase

Selected academic and development projects are presented with their descriptions, technical details and supporting information.

**Luxora – Luxury Home Concierge Platform**

A university group project developed as part of the CCS2313 module.

- Business requirements analysis and documentation.
- 71 Functional Requirements.
- 23 Non-Functional Requirements.
- 25 Business Rules.
- Business analysis, pricing logic and chatbot workflow documentation.

Website: [luxora.bond](https://luxora.bond/)

**Smart City Route Optimizer**

An academic software project exploring graph-based route optimisation.

- Java-based implementation.
- In-memory graph modelling.
- Dijkstra's shortest-path algorithm.
- Breadth-First Search (BFS).

**Detail Me**

A project exploring a cloud-connected mobile technician dispatch system.

- System architecture concepts.
- Technician dispatch workflows.
- State machine specifications.
- Process and system documentation.

### 5. Privacy and Visibility Controls

The portfolio includes configurable contact visibility controls intended to manage how personal contact information is presented.

The interface supports privacy-conscious display options for contact information.

*Important: Client-side visibility controls are presentation features, not security boundaries. Sensitive information should never be embedded in publicly accessible frontend files.*

---

## Project Architecture

```text
Portfolio/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── data/
│   └── ecosystem-settings.example.json
│
├── public/
│   ├── ecosystem-theme.js
│   └── ecosystem-visibility.js
│
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── AdminModal.jsx
│   │   ├── BackgroundCanvas.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Terminal.jsx
│   │   └── Toast.jsx
│   │
│   ├── data/
│   │   ├── education.js
│   │   ├── experience.js
│   │   ├── profile.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── terminalData.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── data/
│   └── ecosystem-settings.example.json
│
├── ecosystem-theme.css
├── index.html
├── package.json
├── serve.js
├── start.bat
├── vite.config.mjs
├── .gitignore
└── LICENSE
```

---

## Getting Started

### Prerequisites

Ensure the following tools are installed:

- [Node.js](https://nodejs.org/) v18 or later.
- npm v9 or later.
- Git.

### Installation

Clone the repository:

```bash
git clone https://github.com/devpanda4real/Portfolio.git
```

Navigate to the project directory:

```bash
cd Portfolio
```

Install dependencies:

```bash
npm install
```

### Development

Start the Vite development server:

```bash
npm run dev
```

Open the local development address:

```text
http://localhost:8080
```

### Production Build

Generate the optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Local Server

The project also includes a lightweight Node.js preview server:

```bash
npm start
```

---

## Content Management

The portfolio follows a data-driven structure, allowing personal information and project details to be updated independently of the UI components.

| Content | File |
|---|---|
| Profile and biography | `src/data/profile.js` |
| Education | `src/data/education.js` |
| Technical skills | `src/data/skills.js` |
| Projects | `src/data/projects.js` |
| Experience | `src/data/experience.js` |
| Terminal commands | `src/data/terminalData.js` |

This separation improves maintainability and makes future content updates easier.

---

## Deployment

The project is configured for automated deployment through GitHub Actions and GitHub Pages.

### Deployment Workflow

1. Commit and push changes to the `main` branch.
2. GitHub Actions automatically triggers the deployment workflow.
3. The workflow installs dependencies and builds the React application.
4. The generated production files are published to GitHub Pages.

**Live Deployment:**

[https://devpanda4real.github.io/Portfolio/](https://devpanda4real.github.io/Portfolio/)

To configure deployment, navigate to:

`Repository Settings → Pages → Build and Deployment`

Select **GitHub Actions** as the deployment source.

---

## About the Developer

**Imesh Kaushalya**

Cloud Computing Undergraduate | SLTC Research University

Currently pursuing a BSc (Hons) in Cloud Computing, with an interest in cloud platforms, systems engineering, software development and modern infrastructure technologies.

This portfolio represents my academic development, technical exploration and practical work as I continue building my engineering skills.

### Connect

- **Portfolio:** [devpanda4real.github.io/Portfolio](https://devpanda4real.github.io/Portfolio/)
- **GitHub:** [github.com/devpanda4real](https://github.com/devpanda4real)

---

## License

This project is distributed under the [MIT License](LICENSE).

Copyright © 2026 Imesh Kaushalya.

