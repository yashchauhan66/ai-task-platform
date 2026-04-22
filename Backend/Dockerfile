FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm ci

COPY . .



FROM node:20-alpine

WORKDIR /app


COPY --from=builder /app/package*.json ./


RUN npm ci --omit=dev


COPY --from=builder /app ./


USER node

EXPOSE 5000

CMD ["node", "server.js"]