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



# Usa Node 20 para evitar warnings de Prisma y dependencias
FROM node:20-alpine

WORKDIR /app

# Instala PostgreSQL client y bash (necesario para wait-for-db.sh)
RUN apk add --no-cache postgresql-client bash

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar todo el código
COPY . .

# Copiar y dar permisos al wait-for-db
COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x wait-for-db.sh

# Puerto que escucha la app en Render
EXPOSE 3001

# Ejecutar la app usando wait-for-db.sh
CMD ["./wait-for-db.sh", "npm", "run", "start:dev"]
