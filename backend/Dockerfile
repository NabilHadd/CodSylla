FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client bash

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x wait-for-db.sh

CMD ["./wait-for-db.sh", "npm", "run", "start:dev"]

