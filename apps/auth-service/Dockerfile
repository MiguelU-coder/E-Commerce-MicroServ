FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth-service/package.json apps/auth-service/package.json
COPY apps/product-service/package.json apps/product-service/package.json
COPY apps/order-service/package.json apps/order-service/package.json
COPY apps/payment-service/package.json apps/payment-service/package.json
COPY apps/email-service/package.json apps/email-service/package.json
COPY apps/client/package.json apps/client/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN cd packages/product-db && npx prisma generate

FROM base AS runner
WORKDIR /app
COPY --from=deps /app .
COPY apps/auth-service ./apps/auth-service
RUN pnpm install --frozen-lockfile --offline
EXPOSE 8003
CMD ["pnpm", "dlx", "tsx", "apps/auth-service/src/index.ts"]
