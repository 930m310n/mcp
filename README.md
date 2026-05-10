# geomelon-mcp

MCP server for the [Geomelon](https://rapidapi.com/hom3chuk/api/geomelon) geographic API. Exposes cities, countries, regions, and languages as tools any MCP-compatible AI client can call.

Two transports are included:

| Binary | Transport | Use case |
|---|---|---|
| `geomelon-mcp` | stdio | Local clients — Claude Desktop, Cursor, Cline, Continue |
| `geomelon-mcp-http` | HTTP (Streamable) | Remote / hosted server |

## Requirements

- Node.js 18+
- A [RapidAPI](https://rapidapi.com/hom3chuk/api/geomelon) key with the Geomelon API subscribed

## Setup

Copy `.env.example` to `.env` and fill in your key:

```bash
cp .env.example .env
```

```env
GEOMELON_API_KEY=your_rapidapi_key_here
PORT=3000   # HTTP transport only
```

## Local usage (stdio)

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "geomelon": {
      "command": "npx",
      "args": ["-y", "geomelon-mcp"],
      "env": {
        "GEOMELON_API_KEY": "your_rapidapi_key_here"
      }
    }
  }
}
```

### Cursor / Windsurf / Cline

Add to your editor's MCP config (exact path varies by editor):

```json
{
  "geomelon": {
    "command": "npx",
    "args": ["-y", "geomelon-mcp"],
    "env": {
      "GEOMELON_API_KEY": "your_rapidapi_key_here"
    }
  }
}
```

## Remote usage (HTTP)

Start the server:

```bash
GEOMELON_API_KEY=your_key PORT=3000 npx geomelon-mcp-http
```

Then point your MCP client at `http://your-host:3000/mcp`.

The HTTP transport is stateless — each request is independent, no sessions to manage.

## Available tools

### Cities

| Tool | Description |
|---|---|
| `search_cities` | Search by name, country code, region, population range, sort order |
| `get_city` | Full details for a city by UUID |
| `cities_by_coordinates_closest` | Cities nearest to a lat/lon, ordered by distance |
| `cities_by_coordinates_largest` | Largest cities near a lat/lon, ordered by population |
| `cities_distance` | Distance in km between two cities |

### Countries

| Tool | Description |
|---|---|
| `list_countries` | List all countries, filter by telephone dialing code |
| `get_country` | Full details for a country by UUID (includes translations and regions) |

### Regions

| Tool | Description |
|---|---|
| `list_regions` | List regions, filter by country UUID |
| `get_region` | Full details for a region by UUID |

### Languages

| Tool | Description |
|---|---|
| `list_languages` | List all languages in the database |
| `get_language` | Details for a language by UUID |

## Development

```bash
npm install
npm run build      # compile TypeScript → dist/
```

Run stdio server directly:

```bash
GEOMELON_API_KEY=your_key node dist/stdio.js
```

Run HTTP server directly:

```bash
GEOMELON_API_KEY=your_key PORT=3000 node dist/http.js
```
