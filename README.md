# AI-200 Learn

**Your focused companion for the Microsoft AI-200 exam** — cut through the noise and study what actually matters for *Developing AI Cloud Solutions on Azure*.

This repo is a lightweight learning site built for developers preparing for the **Azure AI Cloud Developer Associate** certification. Instead of jumping between docs, videos, and random practice tests, you get one place to read, practice, and test yourself — organized exactly around the official exam objectives.

---

## Why use this?

AI-200 is a hands-on, back-end focused exam. You need to know containers, vector databases, messaging, serverless, security, and observability — not just theory. This site is built around that reality.

- **Study with context** — Notes tied to real exam domains, not random blog posts
- **Learn by doing** — Python and Azure CLI samples you can reference during labs and revision
- **Practice under pressure** — Questions that mirror MCQ and scenario-style exam formats
- **Find your weak spots** — Mock exam scores broken down by domain so you know where to focus
- **Stay exam-aligned** — Content structured around the four official skill areas and their weights

Whether you are refreshing after AZ-204, moving into Azure AI engineering, or sitting AI-200 for the first time, this repo gives you a clear path from reading → practicing → testing.

---

## What you get

### Study guides
In-depth notes across every AI-200 domain — concepts, key terms, exam tips, and links to Microsoft Learn. Code blocks include syntax highlighting, language labels (Python, Azure CLI, KQL), and one-click copy for quick use in your terminal or editor.

### Practice questions
MCQ and scenario-style questions with detailed explanations after each answer. Filter by domain to drill the areas you struggle with most — containers, data management, Azure services, or security and monitoring.

### Mock exam
A timed-style practice run of 20 random questions pulled from all domains. Finish with a score and a per-domain breakdown so you can prioritize revision before exam day.

### Built for long study sessions
Dark mode, clean layout, and a distraction-free reading experience — no clutter, no paywalls, no account required.

---

## Exam coverage

| Domain | Weight | What you'll study |
|--------|--------|-------------------|
| **Containerized Solutions** | 20–25% | ACR, Container Apps, AKS, KEDA |
| **Data Management for AI** | 25–30% | Cosmos DB, PostgreSQL pgvector, Managed Redis |
| **Azure Services Integration** | 20–25% | Service Bus, Event Grid, Azure Functions |
| **Secure, Monitor & Troubleshoot** | 20–25% | Key Vault, App Configuration, OpenTelemetry, KQL |

Content lives in plain markdown and JSON under `content/` — easy to extend, fix, and keep accurate as the exam evolves.

---

## Get started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start with **Study**, then **Questions**, then the **Mock exam**.

---

## Who is this for?

- Developers preparing for **AI-200** or the **Azure AI Cloud Developer Associate** credential
- Engineers transitioning from general Azure development (e.g. AZ-204) into AI solution back-ends
- Anyone who wants a **self-hosted, customizable** study tool they can fork and grow with the community

---

## Official Microsoft resources

- [AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
- [Azure AI Cloud Developer Associate certification](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/)

---

*This is an independent study project — not affiliated with Microsoft. Always cross-check with the latest official study guide before your exam.*
