# Roland Garrulos '26

Torneo de pádel — **Liguilla con Fase Final**. 8 parejas, 2 grupos, 4 pistas, 1 día.

## Stack

- **Next.js 16** (App Router + TypeScript)
- **Prisma 6** + SQLite (dev) / PostgreSQL (prod)
- **CSS Modules** con tokens de diseño personalizados
- **Proxy** para autenticación admin

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Home: hero, KPIs, partidos, progreso |
| `/grupos` | Clasificación por grupos (liguilla A/B) |
| `/cuadro` | Fase Final — 4 cruces por puesto |
| `/stats` | Leaderboards por pareja |
| `/perfil?id=1` | Perfil de jugador |
| `/reglamento` | Normativa completa |
| `/admin` | Login protegido |
| `/admin/participantes` | CRUD de jugadores |
| `/admin/resultados` | Editor de resultados |
| `/admin/cuadro` | Generar fase final |

## Arranque local

```bash
npm install
cp .env.example .env        # Ajusta ADMIN_PASSWORD si quieres
npm run db:migrate          # Crea la BD SQLite
npm run db:seed             # Datos de ejemplo (16 jugadores)
npm run dev                 # http://localhost:3000
```

Admin: `/admin` · Contraseña por defecto: `admin123`

## Formato de competición

**8 parejas fijas** repartidas en **Grupo A** y **Grupo B** (4 parejas cada uno).

### Fase de grupos — Liguilla
- Todos contra todos en cada grupo (3 partidos por pareja)
- 1 set a 9 juegos con **bola de oro**
- Máximo 40 minutos por partido
- Grupo A en pistas 1 y 2, Grupo B en pistas 3 y 4

### Fase Final — Cruces por puesto
- 🥇 Pista 1: 1º Grupo A vs 1º Grupo B (Gran Final)
- 🥈 Pista 2: 2º Grupo A vs 2º Grupo B
- Pista 3: 3º Grupo A vs 3º Grupo B
- Pista 4: 4º Grupo A vs 4º Grupo B

### Puntuación
```
PTS = PJ × 10 + PG × 20 + (JF − JC) × 2
```

## Desplegar en Vercel

### Opción A — Solo frontend (sin admin interactivo)

La app se despliega como sitio estático. Los datos precargados del seed serán visibles, pero el panel admin no podrá guardar cambios.

```bash
npx vercel --prod
```

### Opción B — Completo con base de datos

1. Crea una base de datos PostgreSQL:
   - [Vercel Postgres](https://vercel.com/storage/postgres) (gratis en hobby)
   - o [Neon](https://neon.tech) (gratis con límite generoso)

2. Configura las variables de entorno en Vercel:
   ```
   DATABASE_URL = postgres://...
   ADMIN_PASSWORD = tu-contraseña
   ```

3. Cambia el provider en `prisma/schema.prisma`:
   ```diff
   - provider = "sqlite"
   + provider = "postgresql"
   ```

4. Despliega:
   ```bash
   npx vercel --prod
   ```

Vercel ejecutará `prisma generate` y `next build` automáticamente.

## Comandos

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:reset` | Resetear BD y re-seedear |

## Diseño

Paleta de color y tipografía basadas en el diseño original:
- **Display:** Bricolage Grotesque (700-800)
- **Body:** DM Sans (400-700)
- **Mono:** JetBrains Mono (datos, scores, tags)
- Colores: verde pádel (#1f6b3a), azul pista (#1d4e89), amarillo pelota (#d4e84a), crema (#f4efe2)

## Licencia

Organiza: Comité Tertulia & Tortilla · Club Pádel La Boleadora
