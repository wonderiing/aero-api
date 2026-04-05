# Aero API

## Configuración

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y coloca los valores:

```bash
cp .env.example .env
```

### 3. Base de datos

Levanta el contenedor de **PostgreSQL** definido en `docker-compose.yml`:

```bash
docker compose up -d
```

### 4. Ejecutar

```bash
pnpm run start:dev
```
