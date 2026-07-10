import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'Gateway', dir: 'backend/gateway', command: 'npm', args: ['run', 'dev'] },
  { name: 'Agent', dir: 'backend/services/agent', command: 'npm', args: ['run', 'dev'] },
  { name: 'Auth', dir: 'backend/services/auth', command: 'npm', args: ['run', 'dev'] },
  { name: 'Billing', dir: 'backend/services/billing', command: 'npm', args: ['run', 'dev'] },
  { name: 'Chat', dir: 'backend/services/chat', command: 'npm', args: ['run', 'dev'] },
  { name: 'Frontend', dir: 'frontend', command: 'npm', args: ['run', 'dev'] }
];

console.log('\x1b[36m===================================================\x1b[0m');
console.log('\x1b[32mStarting all services concurrently...\x1b[0m');
console.log('\x1b[36m===================================================\x1b[0m');

const children = [];

// Handle exit cleanly
process.on('SIGINT', () => {
  console.log('\n\x1b[31mStopping all services...\x1b[0m');
  children.forEach(child => child.kill());
  process.exit();
});

services.forEach(service => {
  const child = spawn(service.command, service.args, {
    cwd: path.resolve(__dirname, service.dir),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  children.push(child);

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.log(`\x1b[36m[${service.name}]\x1b[0m ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.error(`\x1b[31m[${service.name} ERROR]\x1b[0m ${line}`);
    });
  });

  child.on('close', (code) => {
    console.log(`\x1b[33m[${service.name}]\x1b[0m process exited with code ${code}`);
  });
});
