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
    fs.copyFile(src, dest, (err) => {
        if (err) {
            console.error('Error copying file:', err);
        } else {
            console.log(`${src} copied`);
        }
    });
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

    if (fs.existsSync(viteManifestPath)) {
        // Vite-style manifest
        const data = fs.readFileSync(viteManifestPath, 'utf8');
        const manifest = JSON.parse(data);

        // find the main entry (the one marked as isEntry or the 'main' key)
        const entryKey = Object.keys(manifest).find(k => manifest[k].isEntry) || 'main';
        const entry = manifest[entryKey];
        if (entry) {
            // copy main JS
            if (entry.file) {
                const src = `${buildDir}/${entry.file}`;
                const dest = `../public/${entry.file}`;
                copyAsset(src, dest);
            }
            // copy main CSS (if present)
            if (entry.css && entry.css.length) {
                const cssSrc = `${buildDir}/${entry.css[0]}`;
                const cssDest = `../public/${entry.css[0]}`;
                copyAsset(cssSrc, cssDest);
            }
        }

        // copy all manifest files to ../public preserving directories
        Object.keys(manifest).forEach(key => {
            const val = manifest[key];
            if (val.file) {
                const src = `${buildDir}/${val.file}`;
                const destPath = `../public/${val.file}`;
                copyAsset(src, destPath);
            }
            if (val.css && val.css.length) {
                val.css.forEach(cssFile => {
                    const src = `${buildDir}/${cssFile}`;
                    const dest = `../public/${cssFile}`;
                    copyAsset(src, dest);
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


