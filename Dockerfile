FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json tsup.config.ts ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --omit=dev && npm cache clean --force
ENV NODE_ENV=production
CMD ["node", "dist/stdio.js"]
