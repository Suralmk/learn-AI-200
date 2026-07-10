# AI-200 Learn

A simple study site for **[Microsoft AI-200: Developing AI Cloud Solutions on Azure](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)** — the Azure AI Cloud Developer Associate certification.

Study guides with code samples (Python & Azure CLI), practice questions with explanations, and a mock exam across all exam domains.

## Features

- **Study materials** — Markdown notes per topic with concepts, exam tips, and code samples
- **Practice questions** — MCQ and scenario-style questions with markdown explanations, filterable by domain
- **Mock exam** — 20 random questions with a score breakdown by domain
- **Dark mode** — System-aware theme toggle
- **Azure branding** — Primary color `#2596be`, custom logo, and favicon

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Exam domains

| Domain | Weight | Topics covered |
|--------|--------|----------------|
| Containerized Solutions | 20–25% | ACR, Container Apps, AKS, KEDA |
| Data Management for AI | 25–30% | Cosmos DB, PostgreSQL pgvector, Managed Redis |
| Azure Services Integration | 20–25% | Service Bus, Event Grid, Azure Functions |
| Secure, Monitor & Troubleshoot | 20–25% | Key Vault, App Configuration, OpenTelemetry, KQL |

## Project structure

```
app/
├── page.tsx              # Home
├── study/                # Study materials list & topic pages
├── questions/            # Practice questions
├── exam/                 # Mock exam
└── icon.svg              # Tab favicon

content/
├── study/                # Markdown study guides
└── questions/            # JSON question banks (one file per domain)

components/               # UI components (shadcn)
lib/                      # Content loaders, domain config
```

## Adding content

### Study guide

Create a `.md` file in `content/study/`:

```yaml
---
title: Your Topic Title
domain: data-management
description: Short summary shown on the study list page
order: 9
---

## Overview
Your markdown content here...
```

**Domain values:** `containers` · `data-management` · `azure-services` · `secure-monitor`

### Practice question

Add to the matching JSON file in `content/questions/`:

```json
{
  "id": "unique-id",
  "domain": "containers",
  "type": "mcq",
  "question": "Question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0,
  "explanation": "Markdown explanation shown after answering."
}
```

**Type values:** `mcq` · `scenario`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [gray-matter](https://github.com/jonschlinkert/gray-matter) + [react-markdown](https://github.com/remarkjs/react-markdown) for content
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode

## Official resources

- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
- [Azure AI Cloud Developer Associate certification](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/)
