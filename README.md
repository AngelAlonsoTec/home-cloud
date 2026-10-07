# Home Cloud

*Host your own cloud at home*

#### Table of Contents
- [Development Setup](#development-setup)
  - [Local setup (Linux & Windows)](#local-setup-linux--windows)
  - [Run locally](#run-locally)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Docker](#docker)
  - [Run on Docker containers](#run-on-docker-containers)
- [Production Setup](#production-setup)
  - [Local (Linux & Windows)](#local-linux--windows)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Docker](#docker-1)
- [Credits](#credits)


## Development Setup

First, clone the repo and cd into the project:
```bash
git clone https://github.com/AngelAlonsoTec/home-cloud.git
cd home-cloud
```

### Local setup (Linux & Windows)
You'll need **Node.js 22** or newer. Install dependencies:
```bash
cd server
npm i
cd ../client # ..\client on Windows
npm i
cd ..
```

### Run locally

#### Backend

Move to the server directory:

```bash
cd server
```

Open **sample.env** and copy its content into a new file named **.env**,
then set the correct values for **HOME_CLOUD_STORAGE** and
**HOME_CLOUD_PASSWORD** (you'll need this password to log in). Now start the
server:
```bash
npm run dev
```

#### Frontend

Move to the client directory:

```bash
cd client
```

Start the development server:
```bash
npm run dev
```

Backend will be running on port **5000** and frontend on port **3000** (if not
already in use). The frontend forwards every request to **/api** to the
backend, so you only need to open http://localhost:3000.

### Docker

Open **sample.env** (the one in the root of the project) and copy its content
into a new file named **.env**, then set the correct values for
**HOME_CLOUD_STORAGE** and **HOME_CLOUD_PASSWORD**:
```bash
HOME_CLOUD_STORAGE="/home/user/example"
HOME_CLOUD_PASSWORD="change-me"
```

Dependencies are installed when the containers start, no need to do anything
else.

### Run on Docker containers

```bash
docker compose up
```

The app will be running on port **8080** (if not already in use).

## Production Setup

### Local (Linux & Windows)

#### Backend

Move to **./server/** and set the correct values for **HOME_CLOUD_STORAGE**
and **HOME_CLOUD_PASSWORD** in **.env** (see examples in **sample.env**), and
then run npm start:
```bash
npm start
```

#### Frontend
Move to **./client/** and build the app:

```bash
npm run build
```

Then serve the **dist** directory with a web server that also forwards
**/api** to the backend. If you use nginx, you can copy the config from
**nginx.conf** (change **http://api:5000** with **http://localhost:5000**).

### Docker

Set the correct values in **.env** like in the
[development setup](#docker). You can also change the port with
**HOME_CLOUD_PORT**.

On Linux, the backend runs as user **node** (uid 1000), so make sure that
user can write to **HOME_CLOUD_STORAGE**.

Build images and run containers:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

The app will be running on port **8080**, so you can access it from any device
in your network using your IP address, for example http://192.168.1.2:8080.

## Credits

Originally based on
[home-cloud](https://github.com/antoniosarosi/home-cloud) by Antonio Sarosi.
