const fs = require('fs');
const fse = require('fs-extra');

const buildDir = '../frontend-src/build';

const rootAssets = [
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/manifest.json',
    '/robots.txt',
];

const copyAsset = (src, dest) => {
    try {
        const destDir = dest.substring(0, dest.lastIndexOf('/'));
        if (destDir && !fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
        console.log(`${src} copied -> ${dest}`);
    } catch (err) {
        console.error('Error copying file:', err, 'src:', src, 'dest:', dest);
    }
}

const clearDir = dir => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = dir + file;
        const stat = fs.lstatSync(filePath);
        if (!stat.isDirectory()) {
            console.log('deleting: ' + filePath);
            fs.unlinkSync(filePath);
        }
    })
}

// Clear static assets
clearDir('../public/js/');
clearDir('../public/css/');
clearDir('../public/img/');


// Copy over all images
fse.copy(buildDir + '/img', '../public/img/')
    .then(() => console.log('Image directory copied successfully!'))
    .catch(err => console.error('Error copying image directory:', err));

// Copy manifest entries (support both CRA asset-manifest.json and Vite manifest.json)
const tryCopyManifest = () => {
    const craManifestPath = `${buildDir}/asset-manifest.json`;
    const viteManifestPath = `${buildDir}/manifest.json`;

    if (fs.existsSync(craManifestPath)) {
        // CRA-style manifest
        const data = fs.readFileSync(craManifestPath, 'utf8');
        const jsonData = JSON.parse(data);

        // Copy the main assets
        if (jsonData.files && jsonData.files['main.css']) {
            copyAsset(buildDir + jsonData['files']['main.css'], '../public/css/main.css');
        }
        if (jsonData.files && jsonData.files['main.js']) {
            copyAsset(buildDir + jsonData['files']['main.js'], '../public/js/main.js');
        }

        const fileKeys = Object.keys(jsonData.files || {});
        fileKeys.forEach(key => {
            if (jsonData.files[key] !== '/index.html') {
                copyAsset(
                    buildDir + jsonData.files[key],
                    jsonData.files[key].replace('/static', '../public'));
            }
        });

        rootAssets.forEach(asset => {
            copyAsset(buildDir + asset, `../public${asset}`);
        });
        return;
    }

    // try multiple possible locations for Vite manifest (some Vite setups place it under .vite/)
    // prefer the .vite nested manifest if present (some Vite setups emit it there)
    const viteManifestPaths = [`${buildDir}/.vite/manifest.json`, viteManifestPath];
    const foundViteManifestPath = viteManifestPaths.find(p => fs.existsSync(p));
    if (foundViteManifestPath) {
        // Vite-style manifest
        const data = fs.readFileSync(foundViteManifestPath, 'utf8');
        const manifest = JSON.parse(data);

        // Also copy the vite manifest into the public dir so the server can read it at runtime
        try {
            const destManifest = '../public/vite-manifest.json';
            copyAsset(foundViteManifestPath, destManifest);
        } catch (err) {
            console.warn('Failed to copy vite manifest to public dir:', err);
        }

        // find the main entry: prefer 'src/main.jsx' or 'main' or the first isEntry
        const entryKey =
            Object.keys(manifest).find(k => k === 'src/main.jsx') ||
            Object.keys(manifest).find(k => k === 'main') ||
            Object.keys(manifest).find(k => manifest[k].isEntry) ||
            Object.keys(manifest)[0];

        const entry = manifest[entryKey];
        if (entry) {
            // copy main JS to ../public/js/main.js (legacy contract)
            if (entry.file) {
                const src = `${buildDir}/${entry.file}`;
                const dest = `../public/js/main.js`;
                if (fs.existsSync(src)) {
                    copyAsset(src, dest);
                } else {
                    console.warn('Expected main JS not found at', src);
                }
            }
            // copy main CSS (if present) to ../public/css/main.css (legacy contract)
            if (entry.css && entry.css.length) {
                const cssSrc = `${buildDir}/${entry.css[0]}`;
                const cssDest = `../public/css/main.css`;
                if (fs.existsSync(cssSrc)) {
                    copyAsset(cssSrc, cssDest);
                } else {
                    console.warn('Expected main CSS not found at', cssSrc);
                }
            }
        }

        // copy all manifest files to ../public preserving directories
        Object.keys(manifest).forEach(key => {
            const val = manifest[key];
            if (val.file) {
                const src = `${buildDir}/${val.file}`;
                const destPath = `../public/${val.file}`;
                if (fs.existsSync(src)) copyAsset(src, destPath);
            }
            if (val.css && val.css.length) {
                val.css.forEach(cssFile => {
                    const src = `${buildDir}/${cssFile}`;
                    const dest = `../public/${cssFile}`;
                    if (fs.existsSync(src)) copyAsset(src, dest);
                });
            }
        });

        // copy any root assets if they exist in the build Dir
        rootAssets.forEach(asset => {
            const src = `${buildDir}${asset}`;
            const dest = `../public${asset}`;
            if (fs.existsSync(src)) copyAsset(src, dest);
        });
        return;
    }

    console.error('No recognizable manifest found in build dir:', buildDir);
};

tryCopyManifest();


