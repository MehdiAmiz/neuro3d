#!/usr/bin/env node

// Start the unified server
import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting Unified Server...');

// Start the unified server using tsx for TypeScript support
const server = spawn('npx', ['tsx', 'src/server/unified-server.ts'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});
