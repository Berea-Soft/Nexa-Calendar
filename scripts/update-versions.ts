import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = process.argv[2];

if (!version) {
  console.error('No version provided');
  process.exit(1);
}

const packages = ['core', 'ui', 'react', 'vue', 'angular', 'svelte'];

packages.forEach(pkg => {
  const pkgPath = path.join(__dirname, '..', 'packages', pkg, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkgJson.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`Updated ${pkg} to ${version}`);
});
