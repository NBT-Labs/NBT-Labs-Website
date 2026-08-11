# NBT Labs Website — production image
# Multi-stage build following the official Next.js Docker pattern:
# https://nextjs.org/docs/app/building-your-application/deploying#docker-image

FROM node:22-alpine AS base

# ---- 1. Install dependencies only when package files change ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2. Build the app ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next/font fetches Google Fonts at build time, so this stage needs
# outbound internet access during `docker build`.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- 3. Run the standalone production server ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# `output: "standalone"` (next.config.ts) traces only the files the
# server needs into .next/standalone, so the runner stage never needs
# a full `npm install`.
RUN mkdir -p .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
