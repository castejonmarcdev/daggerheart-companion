# Daggerheart Companion

A comprehensive reference application for the Daggerheart TTRPG, featuring browsable rules, smart search with autocomplete, and cross-linked game concepts.

## Project Structure

```
Daggerheart/
├── resources/
│   ├── core-rules/         # Daggerheart SRD rules files (10 .txt files)
│   └── character-sheets/   # Editable PDF character sheets
├── backend/                # Express + MongoDB API
├── web-app/                # React + Vite frontend
└── mcp-server/             # MCP Server for Claude Desktop
```

## Features

- **Hierarchical Navigation**: Browse classes, ancestries, communities, domains, equipment, and mechanics
- **Character Creation Guide**: Step-by-step walkthrough for building characters
- **GM Guidance**: Principles, practices, and mechanics for Game Masters
- **Smart Search**: Autocomplete search bar finds any game concept instantly
- **Cross-Linking**: Game terms in descriptions are automatically linked to their reference pages
- **Filterable Equipment**: Filter weapons and armor by tier, category, and traits
- **Mobile Responsive**: Dark fantasy theme with hamburger menu for mobile devices
- **Character Sheets**: Downloadable editable PDFs for all classes (standard and multiclass)

## Quick Start

### Using Docker (Recommended)

```bash
# Start the app with MongoDB
docker-compose up --build

# App will be available at http://localhost:3001
```

### Manual Setup

#### Prerequisites

- Node.js 18+
- MongoDB (running locally on port 27017, or provide a connection string)

#### 1. Start MongoDB

```bash
# If using MongoDB locally
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo
```

#### 2. Set up the Backend

```bash
cd backend
npm install
npm run seed   # Populate database with game data
npm run dev    # Start API server on port 3001
```

#### 3. Set up the Web App

```bash
cd web-app
npm install
npm run dev    # Start frontend on port 5173
```

#### 4. Open the App

Navigate to http://localhost:5173 in your browser.

## Docker Deployment

Build and run the production container:

```bash
# Build the image
docker build -t daggerheart-companion .

# Run with external MongoDB
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/daggerheart \
  -e NODE_ENV=production \
  daggerheart-companion
```

Or use docker-compose for a complete setup with MongoDB:

```bash
docker-compose up -d
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/classes` | List all classes |
| `GET /api/classes/:slug` | Get class details with subclasses |
| `GET /api/ancestries` | List all ancestries |
| `GET /api/ancestries/:slug` | Get ancestry details |
| `GET /api/communities` | List all communities |
| `GET /api/communities/:slug` | Get community details |
| `GET /api/domains` | List all domains |
| `GET /api/domains/:slug` | Get domain details |
| `GET /api/equipment/weapons` | List weapons (filterable) |
| `GET /api/equipment/armor` | List armor (filterable) |
| `GET /api/mechanics` | List all mechanics |
| `GET /api/mechanics/:slug` | Get mechanic details |
| `GET /api/guides` | List all guides |
| `GET /api/guides/:slug` | Get guide details |
| `GET /api/search?q=term` | Full-text search |
| `GET /api/search/autocomplete?q=term` | Autocomplete suggestions |
| `GET /api/health` | Health check endpoint |

## MCP Server (Optional)

The MCP server allows you to use Daggerheart tools with Claude Desktop.

```bash
cd mcp-server
npm install
npm run build
```

Add to Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "daggerheart": {
      "command": "node",
      "args": ["C:/src/Daggerheart/mcp-server/dist/index.js"]
    }
  }
}
```

### MCP Tools Available

| Tool | Description |
|------|-------------|
| `search_rules` | Search rules by keyword or topic |
| `lookup_class` | Get class details (9 classes) |
| `lookup_ancestry` | Get ancestry details (18 ancestries) |
| `lookup_community` | Get community details (9 communities) |
| `lookup_equipment` | Look up weapons or armor |
| `lookup_mechanic` | Get mechanic explanations |
| `get_domain_info` | Get domain information (9 domains) |
| `list_options` | List available options by category |

## Technology Stack

- **Backend**: Express.js, MongoDB, Mongoose, TypeScript
- **Frontend**: React 18, Vite, TypeScript, React Router, Zustand, Axios
- **MCP Server**: Node.js, TypeScript, @modelcontextprotocol/sdk
- **Deployment**: Docker, Docker Compose

## Development

### Backend

```bash
cd backend
npm run dev    # Start with tsx watch mode
npm run build  # Compile TypeScript
npm run seed   # Seed database with game data
npm start      # Run compiled version
```

### Frontend

```bash
cd web-app
npm run dev     # Start dev server
npm run build   # Production build
npm run preview # Preview production build
```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/daggerheart` |
| `PORT` | API server port | `3001` |
| `HOST` | Server bind address | `0.0.0.0` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Character Sheets

The `resources/character-sheets/` folder contains editable PDF character sheets for:

- All 9 core classes (Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard)
- Multiclass variants for each class
- Blank fillable sheets for custom characters

## License

This project uses the Daggerheart System Reference Document under the Darrington Press Community Gaming License.

Daggerheart is a trademark of Critical Role LLC.
