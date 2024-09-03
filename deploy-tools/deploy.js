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

// Copy manifest.json entries
fs.readFile(`${buildDir}/asset-manifest.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);

        // Copy the main assets
        copyAsset(buildDir + jsonData['files']['main.css'], '../public/css/main.css');
        copyAsset(buildDir + jsonData['files']['main.js'], '../public/js/main.js');

        const fileKeys = Object.keys(jsonData.files);
        fileKeys.forEach(key => {
            if (jsonData.files[key] !== '/index.html') {
                copyAsset(
                    buildDir + jsonData.files[key],
                    jsonData.files[key].replace('/static', '../public'));
            }
        });

        rootAssets.forEach(asset => {
            copyAsset(buildDir + asset, `../public${asset}`);
        })

    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});


