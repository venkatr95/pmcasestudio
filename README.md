# PM Case Studio 🚀

A McKinsey-grade workspace combining the best of Notion, Linear, and Pitch. From problem definition to executive-ready presentations — all in one platform.

## Features ✨

* **Structured PM Framework**: 7-phase guided wizard from problem definition to roadmap. Never miss a critical PM lens.
* **Prioritization Frameworks**: Built-in RICE, MoSCoW & AARRR with auto-calculation and interactive matrices.
* **Export Everything**: Generate PDF, DOCX, Marp decks, PPTX, and Markdown. Share via email instantly.
* **AI-Assisted Analysis**: AI-powered SWOT, personas, PRDs, and executive summaries.
* **Visual Themes**: 5 curated aesthetics (Aurora, Midnight, Minimal, Corporate, Neon) affecting your entire UI and your final exports.
* **Secure Authentication**: Supports Passwordless (Google OAuth, Magic Links) and standard Email/Password credentials.
* **Admin Portal**: Dedicated portal (`/admin/login`) with Role-Based Access Control (RBAC) to manage users and review case studies.

## Technology Stack 🛠️

* **Framework**: [Next.js 15](https://nextjs.org) (App Router)
* **Language**: TypeScript
* **Database**: PostgreSQL via [Supabase](https://supabase.com/) & [Prisma ORM](https://www.prisma.io/)
* **Authentication**: [NextAuth.js v5](https://authjs.dev/)
* **Styling**: Tailwind CSS, `motion/react` (Framer Motion), `lucide-react`
* **Document Generation**: `@react-pdf/renderer` (PDF), `pptxgenjs` (PPTX), `docx` (Word)

## Getting Started 🏁

### Prerequisites
* Node.js v18+
* npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and provide your Supabase PostgreSQL connection strings:
   ```env
   # Transactional connection pool (use the URL ending in 6543)
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

   # Direct connection for Prisma migrations (use the URL ending in 5432)
   DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

   # NextAuth
   AUTH_SECRET="your-super-secret-key-at-least-32-chars-long"

   # Optional: Google OAuth
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

3. **Initialize the Database**:
   ```bash
   npx prisma db push
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Start Building!** Open [http://localhost:3000](http://localhost:3000) with your browser.

## Contributing 🤝
Contributions are welcome! Please feel free to submit a Pull Request.
