FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache layer)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Build de NestJS
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main"]
