/**
 * Featured Engineering Projects Data
 * Concise, factual, ATS-friendly, and clearly separated.
 */

export const projectsData = [
  {
    id: "luxora",
    title: "Luxora",
    subtitle: "Subscription-Based Luxury Home Concierge Platform • 2025–Present",
    badge: "Flagship Academic Capstone • Group 08 (CCS2313)",
    category: "cloud-web",
    categoryLabel: "Cloud & Web",
    status: "Production",
    statusType: "completed",
    liveUrl: "https://luxora.bond/",
    role: "Business Analyst & Chatbot Developer",
    team: "Group 08 — SLTC Research University • CCS2313",
    summary: "Subscription-based home concierge platform connecting homeowners with verified service providers across curated subscription packages.",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Jira"],
    metrics: {
      frCount: 71,
      nfrCount: 23,
      brCount: 25,
      docType: "BRD"
    },
    completedContributions: [
      {
        title: "Business Requirements Document (BRD)",
        desc: "Authored formal system specifications documenting 71 Functional Requirements, 23 Non-Functional Requirements, and 25 Business Rules."
      },
      {
        title: "Requirements Analysis & Chatbot Scoping",
        desc: "Defined platform business logic, user interaction flows, and conversational triage architecture for concierge services."
      }
    ],
    plannedImprovements: [
      {
        title: "Gemini AI Chatbot Integration",
        desc: "Plan to integrate Google's Gemini API to deploy the automated conversational concierge assistant."
      }
    ],
    hasModalSpecs: true,
    specs: {
      courseCode: "CCS2313 — System Analysis & Design",
      group: "Luxora Group 08",
      teamRoles: [
        { name: "Imesh Kaushalya", role: "Business Analyst & Chatbot Developer", contribution: "Authored 71 FRs, 23 NFRs, 25 BRs; System analysis & conversational scoping" },
        { name: "Deshan Ganganath", role: "Project Leader / Architecture Lead", contribution: "Project oversight, architecture design & integration" },
        { name: "Rashen Anupama", role: "Backend & Database Architect", contribution: "Database schema design, REST API endpoints" },
        { name: "Hasitha Bolukandura", role: "Frontend Engineer & QA", contribution: "Client UI integration, automated testing" },
        { name: "Dulsath Withanage", role: "UI/UX Designer", contribution: "Wireframes, UI flows & design assets" }
      ]
    }
  },
  {
    id: "portfolio",
    title: "Interactive Cloud Portfolio",
    fileName: "Portfolio.jsx",
    subtitle: "High-Performance Cloud Portfolio & Interactive Terminal • 2026",
    badge: "Frontend Developer & Creator (Personal Project)",
    category: "cloud-web",
    categoryLabel: "Cloud & Web",
    status: "Production",
    statusType: "completed",
    projectType: "Personal Project",
    liveUrl: "https://devpanda4real.github.io/Portfolio/",
    githubUrl: "https://github.com/devpanda4real/Portfolio",
    role: "Frontend Developer & Creator",
    summary: "Personal portfolio engineered with React 19 and Vite 6, featuring an interactive dual-mode CLI terminal and automated GitHub repository synchronization.",
    tags: ["React 19", "Vite 6", "Tailwind CSS", "GitHub REST API", "CI/CD", "Docker"],
    completedContributions: [
      {
        title: "Dual-Mode Terminal CLI",
        desc: "Built an interactive terminal emulator supporting Windows PowerShell & macOS zsh environments."
      },
      {
        title: "Automatic GitHub Sync",
        desc: "Integrated client-side GitHub REST API for live repository metadata, stars, and session caching."
      },
      {
        title: "Automated CI/CD Pipeline",
        desc: "Configured GitHub Actions CI/CD to automatically build and deploy production bundles to GitHub Pages."
      }
    ],
    plannedImprovements: [
      {
        title: "Offline PWA Support",
        desc: "Plan to add a service worker for offline asset caching and instant loading."
      }
    ]
  },
  {
    id: "smart-city",
    title: "Smart City Navigation",
    fileName: "SmartCityRoute.java",
    subtitle: "Route optimization and transit corridor graph modeling • 2025",
    badge: "Core Algorithm Developer",
    category: "algorithms",
    categoryLabel: "Algorithms",
    status: "Completed",
    statusType: "completed",
    projectType: "Academic Coursework",
    githubUrl: "https://github.com/devpanda4real/JAVA",
    role: "Core Algorithm Developer",
    summary: "Java graph routing engine modeling simulated urban transit corridors and intersections with in-memory algorithms.",
    tags: ["Java", "Graph Theory", "Dijkstra", "BFS/DFS", "OOP"],
    completedContributions: [
      {
        title: "Graph Routing Algorithms",
        desc: "Implemented Dijkstra & BFS shortest-path algorithms to calculate efficient transit routes."
      },
      {
        title: "Spatial Node Registry",
        desc: "Built in-memory adjacency structures to model urban intersections and transit points."
      }
    ],
    plannedImprovements: [
      {
        title: "Interactive Web Visualizer",
        desc: "Plan to build a browser-based transit map visualizer using Leaflet."
      }
    ]
  },
  {
    id: "detail-me",
    title: "Detail Me — Dispatch Architecture",
    fileName: "DetailMe_App_Spec.pdf",
    subtitle: "On-demand mobile technician allocation & booking specs • 2025",
    badge: "Systems Architecture & Specification (Academic Concept)",
    category: "concept",
    categoryLabel: "Concepts & Mobile",
    status: "Completed",
    statusType: "completed",
    projectType: "Academic Concept",
    role: "Systems Architecture & Specification",
    summary: "Architecture specification and technical feasibility study for an on-demand mobile technician dispatch platform.",
    tags: ["Systems Architecture", "Dispatch Logic", "REST API Workflows", "Mobile UI/UX"],
    completedContributions: [
      {
        title: "Dispatch State Machine",
        desc: "Formulated automated matching logic pairing nearby technicians with booking requests."
      },
      {
        title: "System Architecture Blueprint",
        desc: "Designed mobile user journeys, REST API endpoint contracts, and system specifications."
      }
    ],
    plannedImprovements: [
      {
        title: "Mobile Client Prototype",
        desc: "Plan to develop a Flutter mobile client prototype with real-time GPS tracking."
      }
    ]
  }
];
