const fs = require('fs');
const path = require('path');

const srcPublic = path.join(__dirname, '..', 'public');
const destPublic = path.join(__dirname, '..', '..', 'public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log(`Copying static assets from ${srcPublic} to ${destPublic}`);
  copyRecursive(srcPublic, destPublic);
  console.log('Copy complete.');
} catch (err) {
  console.error('Error copying public files:', err);
  process.exit(1);
}