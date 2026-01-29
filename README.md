# URL Shortener Frontend

Modern, responsive Next.js frontend for the URL shortener service.

![CI](https://github.com/link-achievagemilang-live/frontend/workflows/Frontend%20CI/badge.svg)
![CD](https://github.com/link-achievagemilang-live/frontend/workflows/Frontend%20CD/badge.svg)

## Features

- 🎨 **Modern UI** - Beautiful gradient design with glassmorphism
- ⚡ **Fast & Responsive** - Optimized for all devices
- 📱 **Mobile-Friendly** - Perfect on phones, tablets, and desktops
- 📊 **Analytics Dashboard** - Track your link performance
- 🔗 **QR Code Generation** - Download QR codes for your links
- 📋 **Copy to Clipboard** - One-click copying

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
# Build
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
frontend/
├── app/                  # Next.js app router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── analytics/       # Analytics pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── url-shortener-form.tsx
│   ├── url-result.tsx
│   └── qr-code-display.tsx
├── lib/                # Utilities
│   ├── api.ts         # API client
│   ├── types.ts       # TypeScript types
│   └── utils.ts       # Helper functions
└── public/            # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Animations**: Framer Motion

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/url-shortener-frontend)

1. Click the button above
2. Set environment variables
3. Deploy!

### Docker

```bash
docker build -t url-shortener-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  -e NEXT_PUBLIC_BASE_URL=https://yourdomain.com \
  url-shortener-frontend
```

## CI/CD

See [CI_CD.md](CI_CD.md) for detailed CI/CD documentation.

## Development

```bash
# Lint
npm run lint

# Build
npm run build

# Type check
npm run type-check
```

## License

MIT
