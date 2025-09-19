# ![](assets/img/playlister.love-logo.png)



# Playlister 🎵

A lightweight playlist management app for Spotify.
Quickly add or remove the currently playing track across multiple playlists.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Postgres](https://img.shields.io/badge/Postgres-14.x-blue.svg)](https://www.postgresql.org/)



## ✨ Features

- Add/remove songs from multiple playlists with one click
- React frontend + Express backend, 🐘 Postgres persistence
- Secure OAuth flow with Spotify
- Works with your personal Spotify account



## 🚀 Getting Started

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Postgres](https://www.postgresql.org/) 14.X
- A [Spotify Developer Account](https://developer.spotify.com/dashboard/)

### 🖥️ Server

For the purposes of this guide, we will assume that you are running this in an Ubuntu VM (virtual) with:

**Host:** `playlister`  
**User:** `code`  
**IP:** 127.0.0.1  
**Port:** 8001 (default in `.env`)

### 🎵 Spotify Developer App

https://developer.spotify.com  

**NOTE:** Spotify requires that OAuth callback URLs are secure. More on that in the "Mock SSL" section below.

This is all you need for your server with attributes above.

```bash
https://127.0.0.1:8001/auth/spotify/callback
```

### ⚙️ Installation

```bash
# Clone the repo
git clone git@github.com:dethbird/playlister.git
cd playlister

# Run build.sh
sh build.sh
```

#### 🛠️ build.sh

Does the following:

- 📦 Build `frontend-src` project into a single bundle (`main.js` and `main.css`).
- 📂 Run `/deploy-tools` and move the built frontend static assets into the `/public` directory, where the express app server is setup to serve static files from.
- 🔨 Build the Express app.

### 🐘 Database

Use `/database/playlister-schema.dump` for this.

#### Create Local DB / User on VM

```bash
sudo -u postgres psql
CREATE DATABASE playlister_love;
CREATE USER playlister_db WITH ENCRYPTED PASSWORD 'XXXX';
GRANT ALL PRIVILEGES ON DATABASE playlister_love TO playlister_db;
```

#### Restore Schema on VM

```bash
sudo -u postgres psql -d playlister_love -c "DROP SCHEMA public CASCADE;
 CREATE SCHEMA public AUTHORIZATION playlister_db;
 GRANT USAGE ON SCHEMA public TO public;"    

PGPASSWORD='XXXX' pg_restore -h 127.0.0.1 -U playlister_db -d playlister_love -j 4 --clean --if-exists --no-owner database/playlister-schema.dump
```

### 🔑 Environment Variables

Copy `shadow.env` to `.env` and add your values.

### ▶️ Start Server

```bash
npm run start
```

This will start the server on `localhost` at the port in `.env`. 

### 🔐 Mock SSL

In order for OAuth authentication with Spotify to work, your machine must see your Express server as running on SSL (https).

#### Windows

On Windows, this can be done in PowerShell with the command:

```
ssh -fNL 127.0.0.1:8001:playlister:8001 code@playlister
```

After entering your SSH password for your local server, your Windows machine will now see `http://127.0.0.1:8001` as being SSL secured.

It will look like it's hanging but that means it's "on".

### 🔑 Login with Spotify

Go to http://playlister:8001 and authorize your own Spotify app, and begin using Playlister.



## 🧪 Testing

### Backend Tests

In repo root `/`

#### Watch

Run in watch mode:

```bash
npm run test
```

#### Coverage

To output a coverage report to `/coverage`, use

```bash
npm run test-coverage
```

To view the output locally, `scp` the coverage report to your host machine from your server.

Using a terminal on Windows:

```bash
cd ~/Documents
rm -rf backend-coverage
scp -r code@playlister:/home/code/playlister/coverage ~/Documents/backend-coverage
```

Then double click `index.html` in `~/Documents/backend-covergage` on your machine.

### Frontend Tests

In `/frontend-src`

#### Watch

```bash
npm run test
```

Type `a` to run then watch all tests.

#### Coverage

​	`@todo` coverage doesn't seem to be outputting ---------

To output a coverage report to `/coverage`, use

```bash
npm run test-coverage 
# will begin watch mode but also output report
```

Pull onto your Windows machine:

```bash
cd ~/Documents
rm -rf frontend-coverage
scp -r code@playlister:/home/code/playlister/frontend-src/coverage/lcov-report ~/Documents/frontend-coverage
```



## 🛠 Contributing

Contributions are welcome! 💡

1. Fork the project  
2. Create your feature branch (`git checkout -b feature/amazing-thing`)  
3. Commit your changes (`git commit -m 'Add amazing thing'`)  
4. Push to the branch (`git push origin feature/amazing-thing`)  
5. Open a Pull Request  

See CONTRIBUTING.md for more details.



## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).  
Copyright © 2025 **Rishi Satsangi**



## 🙌 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- All contributors who make Playlister better
