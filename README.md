# Oculus

AI-powered operations platform for monitoring, analytics, and content management.

## What is this?

Oculus is a web dashboard that brings together data visualization, blog management, and search into one interface. Think of it as a command center for your operations — track metrics with interactive charts, publish and manage blog posts, and search across all your content.

## Features

- Interactive data charts and analytics dashboards
- Blog and content management with post creation and syncing
- Full-text search across all content
- SEO-optimized with automatic sitemap generation
- Docker support for easy deployment

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (React, TypeScript) |
| **Database** | PostgreSQL + Drizzle ORM |
| **Charts** | Chart.js, Recharts |
| **Styling** | Tailwind CSS, Geist font |
| **Deploy** | Docker Compose |

## Architecture

```
Browser
  └── Next.js App
        ├── API Routes → PostgreSQL (Drizzle ORM)
        ├── Blog Engine → Content sync + creation
        └── Search → Full-text index
```

## Getting Started

```bash
git clone https://github.com/deb-pradhan/Oculus-Jlabs.git
cd Oculus-Jlabs
npm install
cp .env.example .env   # add your database credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run sync-posts` | Sync blog posts from source |
| `npm run new-post` | Create a new blog post |

### Docker

```bash
docker compose up
```

## License

MIT
