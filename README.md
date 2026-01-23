# Markku Tauriainen — Personal Landing Page

A bilingual (EN/FI) single-page landing site built with Next.js 16, powered by WordPress CMS for content management, optimized for AI search engines and traditional SEO.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** WordPress REST API with ACF (Advanced Custom Fields)
- **Styling:** Tailwind CSS 4 + CSS Variables
- **Icons:** MUI Icons
- **Form Backend:** Brevo (Sendinblue) API
- **Deployment:** Vercel-ready

## Features

- 🌍 **Internationalization** — English & Finnish with URL-based routing (`/en`, `/fi`)
- 📝 **WordPress CMS** — All content managed in WordPress with ACF fields
- 🌗 **Theme Toggle** — Light/dark mode with system preference detection
- 📧 **Contact Form** — Email list signup with Brevo integration
- 🤖 **AI SEO** — `robots.txt`, `llms.txt`, JSON-LD structured data, RankMath SEO integration
- 📱 **Responsive** — Mobile-first design
- ♿ **Accessible** — WCAG-compliant with keyboard navigation

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your WordPress endpoints and Brevo API credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file:

```env
# WordPress REST API Endpoints
WP_HOME_FI_ENDPOINT=your_wordpress_rest_api_endpoint_for_finnish
WP_HOME_EN_ENDPOINT=your_wordpress_rest_api_endpoint_for_english

# Brevo (Email Service)
BREVO_API_KEY=your_brevo_api_key
BREVO_LIST_ID=your_list_id

# Mini Course Authentication
COOKIE_SECRET=your_cookie_secret_for_mini_course_auth

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional: Google Analytics 4 Measurement ID

# Cache Revalidation (Optional but recommended)
REVALIDATION_SECRET=your_random_secret_token_here  # Secret token for WordPress webhook revalidation
```

**Notes:**
- WordPress endpoints should point to your WordPress REST API endpoints that return ACF (Advanced Custom Fields) data for the home page
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` is optional. The site will work perfectly without it - Google Analytics will simply not track page views until the ID is added.
- `REVALIDATION_SECRET` is recommended for live content updates. Generate a secure random token (e.g., using `openssl rand -hex 32`) and configure it in WordPress webhook settings. See `WEBHOOK_SETUP.md` for details.

## Project Structure

```
├── app/
│   ├── [locale]/        # Localized pages (en, fi)
│   ├── api/contact/     # Form submission endpoint
│   ├── robots.txt/      # AI-friendly robots.txt
│   ├── llms.txt/        # AI crawler summary
│   └── layout.tsx       # Root layout with providers
├── components/
│   ├── sections/        # Page sections (Hero, Markku, Contact)
│   ├── layout/          # Header, Footer, SkipLink
│   └── ui/              # Reusable components (Button, Toast, etc.)
├── lib/
│   ├── contexts/        # React contexts (Theme, Toast)
│   ├── generators/      # SEO file generators
│   ├── i18n/            # Translations & locale config
│   ├── structured-data/ # JSON-LD schemas
│   └── wordpress/       # WordPress REST API client & types
├── config/
│   └── site.config.ts   # Site-wide configuration
└── public/              # Static assets (images, video)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run analyze` | Analyze bundle size |

## Configuration

### Site Configuration
Edit `config/site.config.ts` to update:
- Author information
- Organization details
- Site metadata
- Supported locales
- Topic tags

### Content Management
All page content (Hero, Markku, Contact sections) is managed in WordPress:
- Content is structured using ACF (Advanced Custom Fields)
- SEO metadata is managed via RankMath plugin
- Content is fetched via WordPress REST API endpoints
- Each locale has its own endpoint configured in environment variables

### Translations
Edit `lib/i18n/translations.ts` for system messages, form validation, and UI strings (main content comes from WordPress).

## SEO Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/robots.txt` | Allows AI crawlers (GPTBot, Claude, Perplexity) + traditional search engines |
| `/llms.txt` | Plain-text site summary for LLMs |
| `/sitemap.xml` | Traditional XML sitemap for Google Search Console |
| `/api/sitemap` | Dynamic XML sitemap with hreflang (for AI crawlers) |
| `/humans.txt` | Human-readable credits |

## License

© 2026 Markku Tauriainen / Helios Digitech. All rights reserved.

This is a private repository. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.


