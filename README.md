# AGENTARCHITECT ◈

> **Autonomous AI Software Architecture Studio & Engineering Command Center**  
> *Build the system before the code.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4_(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_(Strict)-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![LangGraph.js](https://img.shields.io/badge/LangGraph.js-1.4.14-purple?style=flat-square)](https://langchain-ai.github.io/langgraphjs/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Pro_/_Flash-orange?style=flat-square&logo=google)](https://ai.google.dev/)
[![pgvector](https://img.shields.io/badge/PostgreSQL-pgvector_(768--dim)-336791?style=flat-square&logo=postgresql)](https://github.com/pgvector/pgvector)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.11.6-ff0072?style=flat-square)](https://reactflow.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk_(OTP_&_Password)-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 1. Executive Summary

**AgentArchitect** is a developer tool and software architecture studio. Instead of generating ungrounded code snippets from generic chatbots, AgentArchitect models complex software requirements step-by-step into verifiable system architectures, directed dependency graphs, failure blast radiuses, and architecture decision records (ADRs).

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   PRDs / RFCs   │ ────► │ 10-Node Agent   │ ────► │ Interactive DAG │
│ Technical Brief │       │ Pipeline (LLM)  │       │ React Flow Map  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ pgvector Corpus │       │ Zod Validation  │       │ Directed BFS    │
│ 768-dim RAG     │       │ Formal Schemas  │       │ Blast Radius    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Core Capabilities

### ◈ 1. Interactive Architecture Studio
- **React Flow Canvas**: Living directed acyclic graph (DAG) canvas powered by `@xyflow/react`.
- **Dagre Auto-Layout**: One-click hierarchical topological layout (Left-to-Right `LR` or Top-to-Bottom `TB`).
- **Domain Node Primitives**: Specialized nodes for `Frontend`, `API Gateway`, `Backend Microservice`, `Database`, `In-Memory Cache`, `Message Queue`, and `Autonomous AI Agent`.
- **Component Toolbox**: Drag-and-drop palette grouped by *Application*, *Data & Storage*, *AI & Orchestration*, and *External Integrations*.
- **Deep Inspector Drawer**: Node configuration drawer with real-time parameter mutations, upstream/downstream dependency viewers, and inline blast radius simulation.

### ◉ 2. Autonomous 10-Node Multi-Agent Pipeline (LangGraph.js)
Multi-step architecture synthesis with formal Zod schema boundaries at every transition:
1. `InputSanitizer`: Strips prompt injection, normalizes technical constraints, and structures domain vocabulary.
2. `RequirementAnalyzer`: Decomposes functional requirements and non-functional targets (throughput, latency, compliance).
3. `RAGRetriever`: Queries project RFCs and API specifications stored in `pgvector` using cosine similarity search.
4. `ArchitectDesigner`: Drafts modular microservice topologies and data flow communication protocols.
5. `ZodValidator`: Executes strict schema validation, ensuring valid node topologies and directed edges.
6. `SecurityAuditor`: Analyzes zero-trust perimeter, OAuth2/JWT token boundaries, and encryption in transit/rest.
7. `ScalabilityPlanner`: Evaluates stateless auto-scaling tiers, database sharding, and caching strategies.
8. `CostEstimator`: Approximates cloud infrastructure cost models based on IOPS and instance counts.
9. `GraphGenerator`: Computes coordinates, handles, and edge connection anchors.
10. `Synthesizer`: Outputs unified architecture JSON and streams real-time Server-Sent Events (SSE) telemetry.

### ⚡ 3. Directed Impact Analysis & Blast Radius Radar
- **Graph Breadth-First Search (BFS)**: Bidirectional traversal engine calculating upstream callers and downstream consumers.
- **Topological Cascade Visualizer**:
  - `● CHANGED (Distance = 0)`: Origin node of structural alteration or technology replacement.
  - `▲ DIRECT IMPACT (Distance = 1)`: Immediate callers, ORMs, and drivers requiring contract changes.
  - `○ INDIRECT CASCADE (Distance ≥ 2)`: Downstream ripple failures, data pipeline breakage, or schema desynchronization.
- **AI Mitigation Engine**: Generates zero-downtime transition playbooks (dual-schema write windows, circuit breakers, adapter layers).

### 📚 4. Document Knowledge Registry & pgvector RAG
- **5-Step Continuous Ingestion Pipeline**:
  `Upload ──► Text Normalization ──► Semantic Chunks (500 tokens / 50 overlap) ──► 768-dim Embeddings ──► pgvector Index`
- **Multi-Format Ingestion**: Supports `.pdf`, `.docx`, `.md`, `.txt`, and `.json`.
- **Grounded AI Architect Workbench**: Chat assistant with source chunk citations, architectural recommendations, and direct graph mutation proposals.

### 🌿 5. Immutable Version History & Side-by-Side Diff Engine
- **Git-Style Timeline**: Vertical commit history showing tagged architecture snapshots, author tags, and commit hashes.
- **Visual Architectural Diffing**:
  - `+ ADDED`: Newly provisioned nodes highlighted in green.
  - `~ MODIFIED`: Altered nodes showing before/after technology and protocol deltas in amber.
  - `- REMOVED`: Decommissioned components in red.
  - `= UNCHANGED`: Stable foundational nodes.
- **One-Click Restore**: Instant rollback of the active workspace canvas to any previous snapshot.

### 💎 6. Premium Minimalist Technology Navigation
- Inspired by modern technology leaders (Linear, OpenAI, Stripe).
- **Full-width near-black layout** (`bg-[#09090b]`, `h-[68px]`) with no visible borders or heavy shadows.
- **Three distinct horizontal sections**:
  - **Left**: Minimal geometric glyph and wordmark (`NavBrand`).
  - **Center**: Text navigation links with generous spacing (`NavLinks`: *Product*, *Workflow*, *Features*, *Documentation*).
  - **Right**: Global search modal (`NavSearch` with `⌘K`), dark pill-shaped secondary button (*Sign In*), and high-contrast white pill-shaped primary button (*Launch Workspace ↗*).
- **100% Modular Architecture**: Every part is an isolated reusable component (`NavBrand`, `NavLinks`, `NavSearch`, `NavActions`, `NavMobileMenu`).

---

## 3. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Fast server/client components with Turbopack compilation |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking with zero `any` across stores and services |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility engine with `@theme` design tokens and monospace metadata |
| **Canvas Engine** | [@xyflow/react (React Flow)](https://reactflow.dev/) | High-performance interactive node-graph visualizer |
| **Graph Layout** | [Dagre](https://github.com/dagrejs/dagre) | Directed graph layout engine for automatic node positioning |
| **AI Multi-Agent** | [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) | Stateful autonomous multi-actor workflow orchestration |
| **LLM & Embeddings**| [Google Gemini](https://ai.google.dev/) | `gemini-2.5-pro`, `gemini-2.5-flash`, and `text-embedding-004` |
| **Database & Vector**| [PostgreSQL + pgvector](https://supabase.com/) | Relational metadata storage and 768-dimensional cosine vector search |
| **Authentication** | [Clerk](https://clerk.com/) | Passwordless Email OTP & Secure Password authentication |
| **Client State** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight reactive state stores for canvas, nodes, and edges |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons for technical interfaces |

---

## 4. Repository Structure

```
D:/Sketch/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── projects/
│   │   │       ├── [id]/
│   │   │       │   ├── architecture/          # Graph CRUD & LangGraph generation
│   │   │       │   ├── chat/                  # RAG AI assistant endpoint
│   │   │       │   ├── documents/             # Multi-format upload & parsing
│   │   │       │   ├── impact-analysis/       # BFS blast radius calculation
│   │   │       │   └── versions/              # Snapshot commit & rollback
│   │   │       └── route.ts                   # Projects collection API
│   │   ├── dashboard/                         # Command Center & Registry overview
│   │   ├── projects/                          # Architecture catalog & details
│   │   ├── login/ & signup/                   # Clerk OTP & Password authentication
│   │   ├── globals.css                        # Tailwind v4 theme & monospace tokens
│   │   ├── layout.tsx                         # Root layout with ClerkProvider & Navbar
│   │   └── page.tsx                           # Command Center product launch landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                     # Full-width minimalist technology navbar
│   │   │   ├── Footer.tsx                     # Clean architectural footer
│   │   │   └── navigation/                    # Modular navigation building blocks
│   │   │       ├── NavBrand.tsx               # Minimal glyph & wordmark
│   │   │       ├── NavLinks.tsx               # Text navigation links (Product, Workflow...)
│   │   │       ├── NavSearch.tsx              # Quick search trigger & ⌘K command modal
│   │   │       ├── NavActions.tsx             # Sign In dark pill & Launch Workspace ↗ white pill
│   │   │       ├── NavMobileMenu.tsx          # Responsive mobile drawer
│   │   │       └── index.ts                   # Modular component exports
│   │   └── ui/                                # Primitives (Button, Card, Input, Tabs, Dialog)
│   ├── features/
│   │   ├── agents/                            # LangGraph state visualizer & SSE telemetry
│   │   ├── architecture/                      # Canvas, CustomNode, Toolbox, Inspector, Store
│   │   ├── documents/                         # Knowledge base manager & 5-step RAG pipeline
│   │   ├── impact-analysis/                   # Blast radius visual tree & mitigation strategy
│   │   ├── projects/                          # 4-step creation wizard & project cards
│   │   ├── rag/                               # AI Architect chat workbench
│   │   └── versions/                          # Git-style vertical timeline & side-by-side diff
│   ├── lib/
│   │   ├── gemini/                            # Gemini model client & embeddings
│   │   ├── supabase/                          # Admin client & pgvector operations
│   │   └── utils/                             # Dagre auto-layout & formatters
│   ├── services/                              # ArchitectureService, DocumentService, ImpactService...
│   └── types/                                 # Strict TypeScript database & graph schemas
├── public/                                    # Static assets & brand vectors
├── .env.example                               # Environment variable documentation
├── next.config.ts                             # Next.js configuration
├── package.json                               # Dependencies & scripts
└── tsconfig.json                              # TypeScript strict configuration
```

---

## 5. Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **PostgreSQL**: With `pgvector` extension enabled (e.g. via Supabase)
- **Google AI Studio**: Gemini API key
- **Clerk**: Authentication project keys

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/agentarchitect.git
   cd agentarchitect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (based on `.env.example`):
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Google Gemini AI
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

   # PostgreSQL / Supabase with pgvector
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

4. **Verify TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. API Surface

| Route | Method | Description |
| :--- | :---: | :--- |
| `/api/projects` | `GET` | List all projects for authenticated user |
| `/api/projects` | `POST` | Initialize new architecture briefing specification |
| `/api/projects/[id]` | `GET` | Retrieve complete project metadata and requirements |
| `/api/projects/[id]` | `DELETE` | Permanently decommission project and all embeddings |
| `/api/projects/[id]/architecture` | `GET` | Fetch active components and directed dependency links |
| `/api/projects/[id]/architecture` | `PUT` | Persist modified graph topology from React Flow canvas |
| `/api/projects/[id]/architecture/generate` | `POST` | Execute 10-node LangGraph autonomous synthesis (SSE stream) |
| `/api/projects/[id]/documents` | `GET` | List ingested specifications and vector status |
| `/api/projects/[id]/documents` | `POST` | Upload and chunk PDF/DOCX/MD into 768-dim pgvector store |
| `/api/projects/[id]/documents/[docId]` | `DELETE` | Remove document and purge vector embeddings |
| `/api/projects/[id]/impact-analysis` | `POST` | Execute BFS graph traversal to calculate blast radius |
| `/api/projects/[id]/chat` | `POST` | Context-grounded RAG query against project corpus |
| `/api/projects/[id]/versions` | `GET` | Fetch immutable snapshot history |
| `/api/projects/[id]/versions` | `POST` | Tag manual architecture release checkpoint |
| `/api/projects/[id]/versions/[versionId]/restore`| `POST` | Restore studio canvas to snapshot |

---

## 7. Design System Philosophy

AgentArchitect adheres to a **Command Center & Developer Tool** aesthetic:
- **Palette**: Near-black foundations (`#09090B`), structured surfaces (`#111113`, `#18181B`), and sharp borders (`#27272A`).
- **Accent**: Technical Cyan (`#0EA5E9`), Success (`#10B981`), Warning (`#F59E0B`), and Critical Red (`#EF4444`).
- **Typography**: Clean Modern Sans for human readability paired with **JetBrains Mono** for technical IDs, tokens, coordinates, and real-time agent telemetry.
- **Clean Restraint**: Zero purple glowing blobs, zero bubbly chatbots, zero gratuitous glassmorphism. Every pixel communicates **systems, architecture, dependencies, and engineering control**.

---

## 8. Contributing & License

Contributions are welcome from system architects, distributed systems engineers, and AI practitioners.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/distributed-tracing-node`)
3. Commit your changes (`git commit -m 'feat: add distributed tracing node primitive'`)
4. Ensure `npx tsc --noEmit` and `npm run build` pass cleanly
5. Push to the branch (`git push origin feature/distributed-tracing-node`)
6. Open a Pull Request

Distributed under the **MIT License**. See `LICENSE` for more information.
