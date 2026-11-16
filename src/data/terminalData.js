/**
 * Terminal Data & Command Registry
 * Imesh Kaushalya — Cloud Computing & Systems Portfolio
 */

export const migrationRadarItems = {
  '1': {
    title: "AWS 7 Rs Enterprise Cloud Cutover Strategy",
    category: "Cloud Migration (AWS Ecosystem)",
    strategy: "Rehost (AWS MGN), Replatform (RDS/ECS), and Refactor (Serverless Lambda).",
    downtime: "Near-zero downtime via Continuous Data Capture (CDC).",
    snippet: `  # Step 1: Trigger AWS MGN server cutover\n  aws mgn start-cutover --source-server-ids s-1a2b3c4d\n\n  # Step 2: Resume continuous data replication via AWS DMS\n  aws dms start-replication-task \\\n    --replication-task-arn arn:aws:dms:us-east-1:123456789012:task:MY_REPL_TASK \\\n    --start-replication-task-type resume-processing`,
    takeaway: "Eliminates business disruption and stateful write lag across hybrid cloud boundaries.",
    url: "https://aws.amazon.com/cloud-migration/"
  },
  '2': {
    title: "Zero-Downtime PostgreSQL to AWS Aurora Cutover",
    category: "Database & Systems (High Availability)",
    strategy: "Logical replication slots (pgoutput) streaming real-time WAL changes with weighted DNS.",
    downtime: "0-second write loss; weighted CNAME cutover via Amazon Route 53.",
    snippet: `  -- 1. Create logical replication slot on source PostgreSQL\n  SELECT pg_create_logical_replication_slot('aurora_slot', 'pgoutput');\n\n  -- 2. Verify lag bytes before cutover\n  SELECT slot_name, active, pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn) AS lag_bytes\n  FROM pg_replication_slots;`,
    takeaway: "ACID consistency guaranteed without scheduled maintenance outage.",
    url: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html"
  },
  '3': {
    title: "VM Monolith to Kubernetes (Amazon EKS) Modernization",
    category: "DevOps & Container Modernization",
    strategy: "Deconstruct VM hypervisors into lightweight OCI containers with Helm and ArgoCD GitOps.",
    downtime: "Rolling updates with Kubernetes readiness probes and Horizontal Pod Autoscaling (HPA).",
    snippet: `  # Build production distroless image & trigger Helm release\n  docker build -t ghcr.io/imesh/api:v2.4 -f Dockerfile.prod .\n  helm upgrade --install core-api ./helm-chart --namespace production --set image.tag=v2.4\n  kubectl rollout status deployment/core-api -n production`,
    takeaway: "70% compute density gain and automated self-healing container pods.",
    url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
  },
  '4': {
    title: "Live Linux Kernel Patching: Zero-Reboot Fleet Upgrades",
    category: "Linux Systems & Enterprise Security",
    strategy: "Memory ftrace trampolines (Canonical Livepatch / Kpatch) injecting CVE hotpatches directly into RAM.",
    downtime: "0 reboots required; persistent TCP connections stay intact.",
    snippet: `  # Enable canonical livepatch daemon on cloud instances\n  sudo canonical-livepatch enable <TOKEN>\n  sudo canonical-livepatch status\n  # Output: kernel: 5.15.0-generic | patch status: applied (0 reboots required)`,
    takeaway: "Guarantees 99.99% infrastructure SLA uptime during critical CVE disclosures.",
    url: "https://ubuntu.com/security/livepatch"
  },
  '5': {
    title: "The Strangler Fig Pattern: Monolith to Cloud Microservices",
    category: "Cloud Architecture Pattern",
    strategy: "Edge API Gateway routing facade redirecting legacy routes incrementally to microservices.",
    downtime: "Zero rollback risk; traffic split by percentages (Canary routing).",
    snippet: `  # AWS API Gateway Path Forwarding Spec\n  /api/v1/legacy/*   -> Monolith Application Load Balancer\n  /api/v1/orders     -> AWS ECS Fargate Cluster (Isolated Microservice)\n  /api/v1/billing    -> Serverless AWS Lambda Function`,
    takeaway: "Eliminates catastrophic 'big-bang' release failures through incremental migration.",
    url: "https://martinfowler.com/bliki/StranglerFigApplication.html"
  },
  '6': {
    title: "Serverless AI Cutover: GPU Offload to Gemini 1.5 APIs",
    category: "Modern AI & Serverless Engineering",
    strategy: "Transition heavy GPU VM clusters to serverless REST API endpoints with Google Gemini 1.5.",
    downtime: "Instant deployment with structured JSON schema contracts.",
    snippet: `  // Serverless AI call with structured schema\n  const response = await ai.models.generateContent({\n    model: 'gemini-1.5-flash',\n    contents: userPrompt,\n    generationConfig: { responseMimeType: 'application/json' }\n  });`,
    takeaway: "Eliminates $800+/mo idle compute bills with sub-second response cold-starts.",
    url: "https://ai.google.dev/docs"
  }
};

export const terminalCommonCommands = {
  banner: "Welcome to Imesh's terminal portfolio. Type 'help' to see available commands.",
  
  help: `Available commands:
  about      — Learn about me
  skills     — View my tech skills
  projects   — Browse my featured projects
  education  — My academic background
  contact    — Get in touch & channels
  whoami     — Who are you? / candidate profile
  banner     — Show welcome banner
  privacy    — Super Admin privacy matrix
  neofetch   — Display system & candidate info
  migration-news — Cloud migration radar table
  mode <mac|win> — Switch terminal appearance
  theme <name>   — Switch portfolio color theme
  clear      — Clear the terminal screen`,

  about: `Imesh Kaushalya
BSc (Hons) in Cloud Computing undergraduate at SLTC Research University (2024–2028).
Focused on Cloud Architectures, Containerization (Docker), RESTful APIs, and DevOps CI/CD.
Currently seeking General IT & Cloud Engineering internships for 2026.
Based in Horana, Sri Lanka (Available for On-site / Hybrid / Remote).`,

  skills: `Languages
Python · Java · JavaScript (ES6+) · HTML5 · CSS3 · SQL

Cloud & Infrastructure
AWS Cloud · Docker · Linux CLI · Cloud Architecture · Networking (TCP/IP, DNS)

Backend & Security
Node.js · Express.js · RESTful APIs · JWT Auth · SQA · Cyber Law

Frameworks & Databases
React · PostgreSQL · Prisma ORM

Tools & Methodologies
Git & GitHub · Jira (Agile/Scrum) · Postman · Docker Hub`,

  education: `BSc (Hons) Cloud Computing (undergraduate)
SLTC Research University, Sri Lanka
Expected Graduation: 2028 | Current CGPA: 3.50 / 4.00 (Second Class Upper)
Focus areas: Cloud Infrastructure · Networking · SQA · Cyber Law · Docker

GCE A/L (Advanced Level)
Taxila Central College, Horana, Sri Lanka
Completed: 2023
Focus areas: Mathematics · Physics · Chemistry

GCE O/L (Ordinary Level)
Taxila Central College, Horana, Sri Lanka
Completed: 2020`,

  projects: `[1] Luxora Luxury Concierge (Production)
Flagship Capstone — Business Analyst (BA) & Chatbot Developer
Authored 71 FRs, 23 NFRs, 25 BRs; delivered live concierge MVP.
React · Node.js · REST APIs · Cloudflare · Jira
Link: https://luxora.bond/

[2] Smart City Route Optimizer
Java Graph Engine & Shortest Path Algorithm
In-memory graph modeling and Dijkstra/BFS routing for urban transit.
Java · Graph Theory · Data Structures · OOP
Link: https://github.com/devpanda4real/JAVA

[3] CarePulse Hospital Management System
Next.js 14 Medical Portal & Cloud Infrastructure
Patient appointment management and automated notifications.
Next.js · TypeScript · Appwrite · Tailwind CSS
Link: https://github.com/devpanda4real`,

  github: `GitHub Profile: https://github.com/devpanda4real (@devpanda4real)
Candidate:      Imesh Kaushalya — Cloud & Security Enthusiast
SLTC Academic:  3.50 CGPA • 52 / 128 Credits Completed
Core Repos:     JAVA, Basic_python, luxora-concierge, cloud-portfolio`,

  progress: `[ACADEMIC RESULTS & GITHUB VELOCITY TELEMETRY]
Candidate:          Imesh Kaushalya
Academic Program:   BSc (Hons) in Cloud Computing — SLTC Research University (2024–2028)
Cumulative GPA:     3.50 / 4.00 (Second Class Upper Division)
Degree Credits:     52 / 128 Credits Completed (40.6% Progress)
Current Sprint:     Targeting 3.85+ SGPA in Coursework & Lab Practicals
GitHub Velocity:    18 Days Active Code Sprints (github.com/devpanda4real)
Composite Readiness: 79% Career & Graduation Readiness`
};

export const neofetchWindows = `           ..---..           SLTC\\Imesh.Kaushalya@SLTC-CLOUD-NODE-01
          /       \\          ----------------------------------------
         |   WIN   |         OS: Windows 11 Enterprise x64 (Build 22631)
         |   DOW   |         Host: Cloud Cluster Node Horana (Hyper-V)
          \\   S   /          Kernel: NT 10.0.22631
           ''---''           Uptime: 24/7 (High-Availability Cloud Edge)
                             Shell: PowerShell 7.4.2
                             Candidate: Imesh Kaushalya [BSc Cloud Computing]
                             Status: Currently Studying (2024–2028)`;

export const neofetchMac = `                    c.'      imesh@cloud-mac.local
                 ,xNMM.      ---------------------
               .OMMMMo       OS: macOS Sonoma 14.5 / iOS Darwin (23.4.0)
               lMM"          Host: Apple Silicon ARM64 Cloud Instance
     .;loddo:.  .olloddol;.  Kernel: Darwin 23.4.0 root:xnu-10063.101.17
   cKMMMMMMMMMMNWMMMMMMMMMM0: Shell: zsh 5.9 (arm64-apple-darwin23.0)
 .KMMMMMMMMMMMMMMMMMMMMMMMWd. Candidate: Imesh Kaushalya [BSc Cloud Computing]
 XMMMMMMMMMMMMMMMMMMMMMMMX.  Status: Currently Studying (2024–2028)`;
