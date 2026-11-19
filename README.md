# To-Do DevOps

Aplikasi web To-Do sederhana (Node.js + Express + MySQL) untuk UTS DevOps dan CI/CD.
Dipakai untuk demo Git (Soal 1), pipeline CI GitLab (Soal 2), dan Docker (Soal 3).

## Fitur
Tambah, tandai selesai, dan hapus tugas. Data disimpan di MySQL.

## Cara menjalankan

### Dengan Docker Compose (disarankan)
```bash
cp .env.example .env      # lalu ubah DB_PASSWORD
docker compose up -d --build
```
Buka http://localhost:3001 (port host 3000 dipakai `npm start`)

Hentikan: `docker compose down` (data tetap ada di volume `mysqldata`).
Hapus beserta data: `docker compose down -v`.

### Tanpa Docker
Butuh Node.js 20+ dan MySQL 8. Jalankan `db/init.sql` di database `tododb` lebih dulu.
```bash
npm ci
mysql -u root -p tododb < db/init.sql
DB_HOST=localhost DB_PORT=3306 DB_USER=todo DB_PASSWORD=todo DB_NAME=tododb npm start
```

### Test
```bash
npm test
```

## Struktur
- `src/` kode server, `public/` antarmuka, `db/init.sql` skema tabel
- `test/` unit test, `.gitlab-ci.yml` pipeline CI
- `Dockerfile`, `compose.yaml` kontainerisasi

## Pipeline CI
Stage `build` (menyiapkan artifact `dist/`) lalu `test` (unit test). Berjalan pada setiap push dan merge request.