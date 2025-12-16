#FROM node:18-alpine

#WORKDIR /app

#RUN apk add --no-cache postgresql-client bash

#COPY package*.json ./
#RUN npm ci

#COPY . .

#RUN npx prisma generate

#COPY wait-for-db.sh ./wait-for-db.sh
#RUN chmod +x wait-for-db.sh

#CMD ["./wait-for-db.sh", "npm", "run", "start:dev"]

# -----------------------
# Stage 1: Build
# -----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Instala bash y cliente de Postgres (para Prisma)
RUN apk add --no-cache bash postgresql-client

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar todo el código y compilar
COPY . .
RUN npm run build

# -----------------------
# Stage 2: Runtime con Playwright
# -----------------------
FROM mcr.microsoft.com/playwright:v1.57.0-focal  

WORKDIR /app

# Instala cliente de Postgres y bash
RUN apt-get update && apt-get install -y postgresql-client bash && rm -rf /var/lib/apt/lists/*

# Copiar dependencias de producción
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copiar código compilado y Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copiar script wait-for-db y darle permisos
COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x wait-for-db.sh

# Puerto que escucha Render
EXPOSE 3001

# Ejecutar backend limitando memoria a 512 MB
CMD ["./wait-for-db.sh", "node", "--max-old-space-size=512", "dist/src/main.js"]
