const fs = require('fs');

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

fs.readFile(`${buildDir}/asset-manifest.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        console.log(jsonData);

        copyAsset(buildDir + jsonData['files']['main.css'], '../public/css/main.css');
        copyAsset(buildDir + jsonData['files']['main.js'], '../public/js/main.js');
        copyAsset(buildDir + '/favicon.ico', '../public/favicon.ico');

        rootAssets.forEach(asset => {
            copyAsset(buildDir + asset, `../public${asset}`);
        })

    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});
