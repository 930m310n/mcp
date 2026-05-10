#!/usr/bin/env node
import 'dotenv/config';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main() {
  const apiKey = process.env.GEOMELON_API_KEY;
  if (!apiKey) {
    console.error('Error: GEOMELON_API_KEY environment variable is required');
    process.exit(1);
  }

  const server = createServer(apiKey);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
