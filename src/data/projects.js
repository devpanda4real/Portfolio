/**
 * Featured Engineering Projects Data
 * Edit this file to add, update, or reorganize showcased projects.
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
    role: "Business Analyst (BA) & Chatbot Developer",
    team: "Group 08 — SLTC Research University • CCS2313",
    summary: "Luxora is a subscription-based home concierge platform designed to help customers access and manage home-related services through subscription packages.",
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
        desc: "Prepared business requirements documentation for the project."
      },
      {
        title: "Functional Requirements",
        desc: "Documented 71 Functional Requirements (FRs)."
      },
      {
        title: "Non-Functional Requirements",
        desc: "Documented 23 Non-Functional Requirements (NFRs)."
      },
      {
        title: "Business Rules",
        desc: "Documented 25 Business Rules (BRs)."
      },
      {
        title: "Requirements Analysis",
        desc: "Contributed to defining the system's requirements, scope and business logic."
      }
    ],
    plannedImprovements: [
      {
        title: "Gemini LLM Chatbot API",
        desc: "Plan to integrate Google's Gemini API to provide AI-powered conversational assistance."
      },
      {
        title: "Chatbot Integration",
        desc: "Plan to connect the chatbot with relevant platform features, depending on the final implementation scope."
      }
    ],
    hasModalSpecs: true,
    specs: {
      courseCode: "CCS2313 — System Analysis & Design",
      group: "Luxora Group 08",
      teamRoles: [
        { name: "Imesh Kaushalya", role: "Team Lead & BA / Chatbot Dev", contribution: "Authored 71 FRs, 23 NFRs, 25 BRs; Chatbot triage MVP" },
        { name: "Pamindu Dilshan", role: "Full-Stack Dev & DB Architect", contribution: "Database schema design, REST API endpoints, JWT auth" },
        { name: "Lakshitha Abeywickrama", role: "UI/UX & Frontend Engineer", contribution: "Figma wireframing, responsive dashboard, client UI" },
        { name: "Dilshan Kavinda", role: "QA Engineer & Cloud Deployment", contribution: "Test case suites, Cloudflare edge routing, security audits" }
      ]
    }
  },
  {
    id: "portfolio",
    title: "Interactive Cloud Portfolio",
    fileName: "Portfolio.jsx",
    subtitle: "High-Performance Cloud Engineering Portfolio & Interactive Terminal • 2026",
    badge: "Full-Stack & DevOps Lead",
    category: "cloud-web",
    categoryLabel: "Cloud & Web",
    status: "Production",
    statusType: "completed",
    projectType: "Production Cloud App",
    liveUrl: "https://devpanda4real.github.io/Portfolio/",
    githubUrl: "https://github.com/devpanda4real/Portfolio",
    role: "Full-Stack Developer & DevOps Architect",
    summary: "Production-grade personal developer portfolio engineered with React 19 and Vite 6. Features an interactive dual-mode terminal CLI, automated GitHub REST API synchronization with smart caching, and zero-downtime GitHub Actions edge deployment.",
    tags: ["React 19", "Vite 6", "Tailwind CSS", "GitHub REST API", "CI/CD", "Docker"],
    completedContributions: [
      {
        title: "React 19 & Vite 6 Core Architecture",
        desc: "Engineered ultra-fast client-side bundle with sub-second HMR and optimized production chunks under 360 kB."
      },
      {
        title: "Interactive Dual-Mode Terminal CLI",
        desc: "Built a fully functional terminal emulator supporting Windows 11 PowerShell and macOS zsh environments with custom commands."
      },
      {
        title: "Dynamic GitHub REST API Synchronization",
        desc: "Implemented automated client-side telemetry pulling live repository stars, languages, and commit timestamps with smart caching."
      },
      {
        title: "Edge Deployment & CI/CD Pipeline",
        desc: "Architected automated GitHub Actions deployment pipelines for GitHub Pages with minimal read-only permission boundaries."
      }
    ],
    plannedImprovements: [
      {
        title: "PWA Offline Service Worker",
        desc: "Plan to integrate Progressive Web App capabilities for offline asset caching and instant loading."
      },
      {
        title: "Serverless Visitor Telemetry",
        desc: "Plan to deploy privacy-friendly AWS Lambda visit metrics without third-party tracking scripts."
      }
    ]
  },
  {
    id: "smart-city",
    title: "Smart City Navigation",
    fileName: "SmartCityRoute.java",
    subtitle: "Algorithmic route optimization and spatial network modeling for simulated urban transit corridors.",
    badge: "Core Algorithm Developer",
    category: "algorithms",
    categoryLabel: "Algorithms",
    status: "Completed",
    statusType: "completed",
    projectType: "Academic Project",
    githubUrl: "https://github.com/devpanda4real/JAVA",
    role: "Core Algorithm Developer",
    summary: "Algorithmic route optimization and spatial network modeling for simulated urban transit corridors.",
    tags: ["Java", "Graph Theory", "Dijkstra", "BFS/DFS", "OOP"],
    completedContributions: [
      {
        title: "Graph Modeling",
        desc: "Built in-memory urban transit networks utilizing adjacency structures for intersections & roads."
      },
      {
        title: "Path Optimization",
        desc: "Implemented shortest-path graph traversal (Dijkstra / BFS) to calculate efficient transit routes."
      },
      {
        title: "Spatial Registry",
        desc: "Designed modular location registry services to query and update urban point-of-interest nodes."
      }
    ],
    plannedImprovements: [
      {
        title: "Web Map Visualizer",
        desc: "Plan to build an interactive web GUI visualizer using Leaflet / Mapbox."
      },
      {
        title: "Live Traffic Weighting",
        desc: "Plan to integrate real-time congestion factor multipliers into route calculation."
      }
    ]
  },
  {
    id: "detail-me",
    title: "Detail Me — Mobile Dispatch Architecture",
    fileName: "DetailMe_App_Spec.pdf",
    subtitle: "Cloud-connected mobile service dispatch architecture, dynamic technician allocation models, and customer booking lifecycle.",
    badge: "Systems Architecture Lead",
    category: "concept",
    categoryLabel: "Concepts & Mobile",
    status: "Completed",
    statusType: "completed",
    projectType: "Concept & Spec",
    role: "Systems Architecture Lead",
    summary: "Cloud-connected mobile service dispatch architecture, dynamic technician allocation models, and customer booking lifecycle.",
    tags: ["Systems Architecture", "Dispatch Logic", "REST API Workflows", "Mobile UI/UX", "MVP Specifications"],
    completedContributions: [
      {
        title: "Dispatch & Service Architecture",
        desc: "Formulated end-to-end user workflows, automated technician dispatch models, and booking lifecycle state machines."
      },
      {
        title: "UI/UX Prototyping & Flow Mapping",
        desc: "Drafted mobile user journey flows and screen wireframes to minimize user interaction friction and booking latency."
      },
      {
        title: "Systems Feasibility & Architecture Deck",
        desc: "Produced investor-ready system architecture deck, technical feasibility overview, and demo video."
      }
    ],
    plannedImprovements: [
      {
        title: "Mobile Client MVP",
        desc: "Plan to develop the mobile client application in Flutter / React Native with live GPS technician dispatch."
      },
      {
        title: "Cloud Backend & Payments",
        desc: "Plan to implement cloud-hosted serverless APIs for real-time tracking and digital payments."
      }
    ]
  }
];
