# Product Requirements Document (PRD): PM Case Studio

## 1. Vision & Purpose
Product Managers currently rely on fragmented, generic tools (Notion, Google Docs, Miro) to build case studies, PRDs, and strategy docs. **PM Case Studio** is a purpose-built workspace that enforces best-practice PM frameworks, accelerates writing via AI, and automatically generates beautiful, executive-ready presentations and PDFs.

## 2. Target Audience
* **Aspiring PMs:** Building portfolios for interviews.
* **Junior/Mid-level PMs:** Standardizing their workflow and PRD writing.
* **Senior/Group PMs:** Looking for a rapid way to outline strategies and share consistent documentation with stakeholders.

## 3. Core Features & Capabilities

### 3.1. The 7-Phase Workflow Engine
A guided workspace that breaks down the product lifecycle into actionable, distinct phases:
1. **Problem Space:** Opportunity identification.
2. **Customer & Market:** Personas and market sizing.
3. **Strategy & Metrics:** North Star, OKRs.
4. **Ideation:** Brainstorming and wireframing.
5. **Prioritization:** Mathematical frameworks (RICE, MoSCoW).
6. **Execution & PRD:** User stories and GTM.
7. **Roadmap & Risks:** Timeline and mitigation planning.

### 3.2. Automated Deliverable Generation
Users can one-click export their raw phase data into heavily formatted, professional documents:
- **Formats:** PDF, DOCX, PPTX, Markdown, Marp HTML.
- **Sub-documents:** Filtered document generation based on audience (e.g., *Executive Summary* vs *Detailed Technical PRD*).

### 3.3. Customizable Aesthetics
Global state theme engine supporting:
- Aurora (Default, vibrant gradient)
- Midnight (Sleek dark mode)
- Minimal (Clean, Notion-like white/grey)
- Corporate (Enterprise blue/grey)
- Neon (High contrast)

*Themes apply to both the Web App UI and the generated PDF/PPTX exports.*

### 3.4. NextAuth Security & Role-Based Access Control
- Supports passwordless Magic Link authentication.
- Supports OAuth via Google.
- Supports standard Email/Password credentials backed by Bcrypt.
- **Admin Portal (`/admin`)**: A restricted RBAC dashboard for administrators to oversee platform activity, manage user roles, and review case study contents. Protected API routes and middleware proxy interception ensure strict access control.

## 4. Technical Architecture
- **Frontend / Fullstack:** Next.js 15 (App Router, Turbopack).
- **Styling:** Tailwind CSS + Framer Motion.
- **Database:** PostgreSQL (via Supabase) connected through Prisma ORM.
- **Export Engines:** 
  - `@react-pdf/renderer` for robust PDF generation.
  - `pptxgenjs` for PowerPoint generation.
  - `docx` for Word documentation.

## 5. Future Roadmap & Non-Goals
* **Roadmap:** Multiplayer collaboration (WebSockets), Jira Integration for User Stories, Figma embed support.
* **Non-Goals:** Becoming a full project management tracker like Jira. PM Case Studio is for *strategy, definition, and documentation*.
