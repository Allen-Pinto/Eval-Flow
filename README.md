# Eval-Flow: AI Agent Evaluation Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Enterprise-grade AI Agent Evaluation Platform with real-time analytics and multi-tenant security**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/Eval-Flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Eval-Flow is a comprehensive evaluation framework designed for monitoring and analyzing AI agent performance. Built with modern web technologies, it provides real-time dashboards, configurable evaluation policies, and enterprise-grade security for teams deploying AI solutions at scale.

## Features

### Core Capabilities
- **Real-time Analytics Dashboard** - Interactive charts with 7/30-day trend analysis
- **Multi-Tenant Architecture** - Secure data isolation with Row-Level Security
- **Configurable Evaluation Policies** - Always run or sampled evaluation modes
- **Automated PII Protection** - Built-in sensitive data redaction
- **RESTful API** - Simple integration for evaluation data ingestion

### Technical Features
- **Performance Optimized** - Indexed queries with sub-50ms response times
- **Type-Safe Development** - Full TypeScript implementation
- **Responsive Design** - Mobile-optimized interface
- **Production Ready** - Comprehensive error handling and logging

## Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 | React framework with App Router |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Database | PostgreSQL | Primary data storage |
| Backend | Supabase | BaaS with Auth and RLS |
| Charts | Recharts | Data visualization library |
| Deployment | Vercel | Serverless deployment platform |

### System Architecture

```
Client Layer
├── Web Application (Next.js)
├── Authentication (Supabase Auth)
└── Real-time Dashboard

API Layer
├── REST Endpoints (/api/*)
├── Evaluation Ingestion
└── Metrics Calculation

Data Layer
├── PostgreSQL Database
├── Row-Level Security
└── Automated Backups
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- GitHub account

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/Eval-Flow)

## Installation

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/Eval-Flow.git
cd Eval-Flow
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env.local
```

4. **Set up environment variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Configuration

### Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Run database schema** from `/supabase/migrations/` 
3. **Configure authentication** settings
4. **Set up Row-Level Security** policies

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | No |
| `NEXT_PUBLIC_SITE_URL` | Application base URL | Yes |

## API Documentation

### Evaluation Ingestion Endpoint

```http
POST /api/evals/ingest
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "interaction_id": "string",
  "prompt": "string",
  "response": "string", 
  "score": number,
  "latency_ms": number,
  "flags": ["string"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "success",
  "pii_redacted": number
}
```

### Metrics Endpoint

```http
GET /api/metrics?period=7d|30d
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "total_evals": number,
  "avg_score": number,
  "avg_latency_ms": number,
  "success_rate_pct": number,
  "pii_redactions_total": number,
  "trend_daily": array
}
```

## Development

### Project Structure

```
eval-flow/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── Charts/           # Data visualization
│   └── UI/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── metrics.ts        # Metrics calculation
└── supabase/             # Database migrations
    └── migrations/
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Database Schema

Key tables include:
- `profiles` - User profile information
- `evaluation_configs` - User evaluation policies
- `evaluations` - Evaluation results and metrics
- `audit_logs` - System audit trail

## Deployment

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Configure environment variables**
3. **Deploy automatically** on git push

### Environment-Specific Configuration

**Development:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Build Optimization

- Automatic code splitting
- Image optimization
- CSS minimization
- Tree shaking for unused code

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Documentation](https://github.com/your-username/Eval-Flow/wiki)
- [Issue Tracker](https://github.com/your-username/Eval-Flow/issues)
- [Discussions](https://github.com/your-username/Eval-Flow/discussions)

---

<div align="center">

**Eval-Flow** - *Evaluate your AI agents with confidence*

[Documentation](https://github.com/your-username/Eval-Flow/wiki) • [Demo](https://eval-flow.vercel.app) • [Report Bug](https://github.com/your-username/Eval-Flow/issues)

</div>
