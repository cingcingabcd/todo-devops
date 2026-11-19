# Base image: Node.js LTS versi ringan (alpine)
FROM node:20-alpine

# Direktori kerja di dalam container
WORKDIR /app

# Salin manifest dulu agar layer npm ci ter-cache
COPY package*.json ./
RUN npm ci --omit=dev

# Salin kode aplikasi
COPY src ./src
COPY public ./public

# Konfigurasi default lewat environment variable (bisa ditimpa saat run/compose)
ENV PORT=3000 \
    DB_HOST=db \
    DB_PORT=5432

EXPOSE 3000

# Jalankan sebagai user non-root bawaan image node
USER node

CMD ["node", "src/server.js"]
