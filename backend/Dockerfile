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




FROM node:18-alpine

WORKDIR /app

# Instala PostgreSQL client (opcional, útil si usas Prisma)
RUN apk add --no-cache postgresql-client bash

# Copiar y instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar todo el código
COPY . .

# Migraciones + Seed **al construir**
RUN npx prisma migrate deploy
RUN npx prisma db seed

# Puerto que escucha Render
EXPOSE 3001

# Ejecutar la app
CMD ["npm", "start"]