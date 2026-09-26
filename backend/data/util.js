const fs = require('node:fs/promises');

// Overridable for deployments with a persistent volume
// (e.g. Fly.io: DATA_FILE=/data/events.json). Defaults to local dev file.
const DATA_FILE = process.env.DATA_FILE || 'events.json';

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Fresh volume / first boot: start empty and persist it.
      const empty = { users: [], events: [] };
      await writeData(empty);
      return empty;
    }
    throw error;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data));
}

exports.readData = readData;
exports.writeData = writeData;