## Phase 1
FROM node:20-alpine as builder
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

## Phase 2
FROM node:20-alpine
ENV NODE_ENV production
WORKDIR /
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /dist ./dist
EXPOSE 5000
CMD ["node", "dist/main.js"]