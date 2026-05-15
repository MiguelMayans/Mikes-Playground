# AGENTS.md

## Repository Overview

This is a personal learning/playground repository containing many **independent** subprojects across multiple languages and frameworks. It is **not a monorepo** — there is no shared build system, no root package manager, and no global test suite.

## Critical Rules

- **Never run build/test/install commands from the repository root.** Each subproject is standalone; always `cd` into the specific project directory first.
- **Watch for spaces in directory names.** `Proyecto Dan/dans-game/`, `Java-Sandbox/Head First/`, and `Python-Sandbox/Factorio proyect/` contain spaces. Quote paths in shell commands.
- **This is a learning repo.** Projects are often tutorial-based, partially complete, or experimental. Do not assume production-grade error handling, tests, or documentation exist.

## Factorio Ratio Calculator (Python-Sandbox/Factorio proyect/)

**Active project** — Full-stack calculator for Factorio 2.0 + Space Age production ratios.

### Architecture
- **Backend:** Flask (Python), parses real Factorio game data from JSON dumps
- **Frontend:** Vite + React + TypeScript, Factorio-themed dark UI
- **Data source:** Extracted from local Steam Flatpak installation via `--dump-data`

### Project Structure
```
Factorio proyect/
├── backend/
│   ├── app/
│   │   ├── data/              # Factorio JSON dumps (data-raw-dump.json, etc.)
│   │   ├── services/
│   │   │   ├── factorio_data.py   # Parses game data into recipes/items/machines
│   │   │   └── calculator.py      # Ratio calculation algorithm
│   │   ├── static/
│   │   │   └── icons/         # Factorio item icons (~1180 PNGs, copied from game)
│   │   └── main.py            # Flask entrypoint
│   └── requirements.txt       # flask, flask-cors
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main calculator UI
│   │   ├── api.ts             # HTTP client (calls localhost:8000)
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── App.css            # Factorio dark theme styles
│   └── package.json           # Vite + React + TS
└── scripts/
    └── (dump scripts)
```

### Running the Project

**Backend (Python):**
```bash
cd "Python-Sandbox/Factorio proyect/backend"
PYTHONPATH=. python3 app/main.py
# Runs on http://localhost:8000
```

**Frontend (React + Vite):**
```bash
cd "Python-Sandbox/Factorio proyect/frontend"
pnpm run dev
# Runs on http://localhost:5173
```

**Required:** Both servers must run simultaneously (Option A architecture).

### Key Backend Details

- Data files are **27MB** (`data-raw-dump.json`). Loading takes ~2-3 seconds on startup.
- Game data is in **Spanish** (user's Factorio locale). Item names like "Placa de hierro", not "Iron plate".
- **Recycling recipes are explicitly skipped** in the calculator to prevent infinite loops (e.g., concrete → iron ore → concrete).
- Default machines are auto-selected by highest crafting speed per category.
- **Icons served statically** from `app/static/icons/` (~1180 PNGs, processed to 64x64). Factorio's original PNGs contain mipmaps (multiple sizes in one file); they are auto-cropped to extract just the 64x64 main icon. Endpoint: `GET /icons/{item_id}.png`
- No database; all state is in-memory parsed from JSON.

### Key Frontend Details

- CORS configured for `http://localhost:5173`
- Factorio color scheme: dark grays (`#1a1a1a`, `#2a2a2a`) with orange accent (`#ff8c00`)
- Uses plain CSS (no Tailwind or UI framework) to keep dependencies minimal
- **Item icons displayed** in search list and calculation results (pixelated rendering)

### How to Update Factorio Data

If the user updates Factorio or installs new DLCs:
```bash
flatpak run --command=.local/share/Steam/steamapps/common/Factorio/bin/x64/factorio \
    com.valvesoftware.Steam --dump-data
flatpak run --command=.local/share/Steam/steamapps/common/Factorio/bin/x64/factorio \
    com.valvesoftware.Steam --dump-prototype-locale
# Files appear in ~/.var/app/com.valvesoftware.Steam/.factorio/script-output/
# Copy JSON files to backend/app/data/
# To update icons, re-copy PNGs from game installation:
# find ~/.var/app/com.valvesoftware.Steam/.local/share/Steam/steamapps/common/Factorio/data \
#   -path "*/icons/*.png" -exec cp {} backend/app/static/icons/ \;
```

### Known Issues / TODOs

- Mining drills are treated as machines but ore rates depend on patch richness (not modeled)
- No support for modules, beacons, or quality modifiers yet
- Fluid temperatures and boiler recipes are not handled

## Other Sandbox Projects

| Directory | Stack | Notes |
|---|---|---|
| `bash-sandbox/` | Shell scripts | No build system |
| `C++/` | C++ | `adivina-numero/` |
| `CSharp-Sandbox/` | C# | `Brais/` |
| `Docker-Sandbox/` | Docker | `devops-directive-docker-course/` |
| `Go-Sandbox/` | Go | `BasicServer/`, `Server/`, `Brais/` |
| `Java-Sandbox/` | Java | `Head First/` (has compiled `.class` files) |
| `JS-Sandbox/` | JS/TS | Multiple projects: Angular, React Native, Vite games, Node backends |
| `Proyecto Dan/` | React + Vite + TS | `dans-game/` — React game using Vite |
| `Python-Sandbox/` | Python | `audio_translator/`, `ugit/` (empty) |
| `Rust-Sandbox/` | Rust | `server/`, `Brais/hello-world/` |

## Package Manager Notes

- **pnpm** is preferred for Node.js projects in this repo (user explicitly requested no npm).
- Python uses pip3 (system Python 3.14.4). No virtualenvs are created by default.
