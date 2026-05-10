import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GeomelonClient } from 'geomelon';
import { z } from 'zod';

export function createServer(apiKey: string): McpServer {
  const client = new GeomelonClient({ apiKey });

  const server = new McpServer({
    name: 'geomelon',
    version: '1.0.0',
  });

  // ── Cities ──────────────────────────────────────────────────────────────────

  server.tool(
    'search_cities',
    'Search cities by name, country, population range, and more. Returns matching cities with geographic and translation data.',
    {
      name: z.string().optional().describe('City name prefix to search for'),
      countryCode: z.string().optional().describe('ISO 3166-1 alpha-2 country code (e.g. "US", "DE")'),
      regionId: z.string().optional().describe('Filter by region UUID'),
      minPopulation: z.number().int().optional().describe('Minimum population'),
      maxPopulation: z.number().int().optional().describe('Maximum population'),
      sort: z
        .enum(['population_desc', 'population_asc', 'name_asc', 'name_desc'])
        .optional()
        .describe('Sort order'),
      preferredLanguages: z
        .string()
        .optional()
        .describe('Comma-separated BCP 47 language tags for name translations (e.g. "fr,en")'),
      limit: z.number().int().min(1).max(100).optional().describe('Max results (default 20)'),
      offset: z.number().int().min(0).optional().describe('Pagination offset'),
    },
    async (params) => {
      const result = await client.cities.search(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'get_city',
    'Get full details for a single city by its UUID.',
    { id: z.string().describe('City UUID') },
    async ({ id }) => {
      const result = await client.cities.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'cities_by_coordinates_closest',
    'Find cities nearest to given coordinates, ordered by distance.',
    {
      lat: z.number().describe('Latitude'),
      lon: z.number().describe('Longitude'),
      preferredLanguages: z.string().optional().describe('Comma-separated BCP 47 language tags'),
    },
    async (params) => {
      const result = await client.cities.byCoordinatesClosest(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'cities_by_coordinates_largest',
    'Find the largest cities near given coordinates, ordered by population.',
    {
      lat: z.number().describe('Latitude'),
      lon: z.number().describe('Longitude'),
      preferredLanguages: z.string().optional().describe('Comma-separated BCP 47 language tags'),
    },
    async (params) => {
      const result = await client.cities.byCoordinatesLargest(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'cities_distance',
    'Calculate the distance in kilometres between two cities.',
    {
      city1: z.string().describe('First city UUID'),
      city2: z.string().describe('Second city UUID'),
    },
    async ({ city1, city2 }) => {
      const result = await client.cities.distance(city1, city2);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  // ── Countries ───────────────────────────────────────────────────────────────

  server.tool(
    'list_countries',
    'List countries with optional filtering by name prefix or telephone code. Supports localized names via preferredLanguages.',
    {
      name: z.string().optional().describe('Country name prefix to search for (matches English name and translations in preferredLanguages)'),
      telephoneCode: z.string().optional().describe('Filter by dialing code (e.g. "+1", "+44")'),
      preferredLanguages: z
        .string()
        .optional()
        .describe('Comma-separated BCP 47 language tags; sets localizedName and drives translation name search (e.g. "fr,es,en")'),
      limit: z.number().int().min(1).max(500).optional().describe('Max results'),
      offset: z.number().int().min(0).optional().describe('Pagination offset'),
    },
    async (params) => {
      const result = await client.countries.list(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'get_country',
    'Get full details for a single country by its UUID, including translations and regions.',
    { id: z.string().describe('Country UUID') },
    async ({ id }) => {
      const result = await client.countries.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  // ── Regions ─────────────────────────────────────────────────────────────────

  server.tool(
    'list_regions',
    'List administrative regions, optionally filtered by country.',
    {
      countryId: z.string().optional().describe('Filter by country UUID'),
    },
    async (params) => {
      const result = await client.regions.list(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'get_region',
    'Get full details for a single region by its UUID.',
    { id: z.string().describe('Region UUID') },
    async ({ id }) => {
      const result = await client.regions.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  // ── Languages ────────────────────────────────────────────────────────────────

  server.tool(
    'list_languages',
    'List languages available in the Geomelon database.',
    {
      limit: z.number().int().min(1).max(500).optional().describe('Max results'),
      offset: z.number().int().min(0).optional().describe('Pagination offset'),
    },
    async (params) => {
      const result = await client.languages.list(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'get_language',
    'Get details for a single language by its UUID.',
    { id: z.string().describe('Language UUID') },
    async ({ id }) => {
      const result = await client.languages.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  return server;
}
