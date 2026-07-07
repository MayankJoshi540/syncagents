# 🧠 SyncAgents — The Ultimate Microservice AI Agent Playground! 🚀🤖

Welcome to **SyncAgents**! 🌟 This is a state-of-the-art, supercharged microservice platform engineered to host multiple AI agents with live coding previews, PPT/PDF generation, vision analysis, and vector search capabilities. It's modular, lightning-fast, and powered by modern tools. 😎🔥

---

## 🏛️ System Architecture at a Glance 🗺️

```mermaid
graph TD
    Client[React Frontend - Port 5173] -->|API Requests| Gateway[Gateway - Port 8000]
    Gateway -->|Session Storage| Redis[(Redis Session Store)]
    
    Gateway -->|/auth| AuthSvc[Auth Service - Port 8001]
    
    AuthSvc --> MongoDB[(MongoDB Atlas)]
    AuthSvc --> Firebase[Firebase Auth Admin]
```

---

## 🛠️ The Powerhouse Tech Stack ⚡🔋

Here are the technologies powering this beast:

### 🌐 Frontend (The Face)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

* **React 19:** Building smooth, interactive, declarative components. ⚛️
* **Vite:** Instantly fast builds and Hot Module Replacement (HMR). ⚡
* **Tailwind CSS v4:** Sleek, modern styling system for rich custom designs. 🎨
* **Firebase SDK:** User authentication and sign-in handlers. 🔑

---

### ⚙️ Backend & API Gateway (The Brains)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Nodemon](https://img.shields.io/badge/nodemon-76DEC2?style=for-the-badge&logo=nodemon&logoColor=white)

* **API Gateway:** Proxies and channels requests to sub-services on different ports. 🚥
* **Auth Service:** Dedicated microservice checking Firebase session tokens and talking to MongoDB. 🛡️
* **Shared Redis Modules:** Custom fast memory layers using `ioredis`. 💾

---

### 🗄️ Databases & Infrastructure (The Memory)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

* **MongoDB Atlas:** Cloud database storing permanent user profiles and agent memory. 🍃
* **Redis:** In-memory store utilized for gateway caching and high-speed session tracking. ⚡
* **Docker:** Containerized setup for running the local Redis container seamlessly. 🐳

---

## 📂 Codebase Directory Layout 🗂️

```text
syncagents-ai/
├── backend/
│   ├── gateway/                  # 🚦 API Gateway (Port 8000)
│   ├── shared/                   # 🤝 Shared libraries & Redis client wrapper
│   ├── services/
│   │   ├── auth/                 # 🔐 Auth Service (Port 8001)
│   └── docker-compose.yml        # 🐳 Container orchestration for Redis
└── frontend/                     # 🎨 React + Vite UI client SPA (Port 5173)
```

---

## 🔐 Environment Setup 🧬

To power up the environment locally, configure the following `.env` files:

### 1️⃣ Frontend (`frontend/.env`)
```env
VITE_FIREBASE_API=your_firebase_client_api_key
VITE_SERVER_URL=http://localhost:8000
```

### 2️⃣ Gateway (`backend/gateway/.env`)
```env
PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Auth Service (`backend/services/auth/.env`)
```env
PORT=8001
MONGODB_URL=your_mongodb_connection_string
```
> [!IMPORTANT]
> Make sure to drop your Firebase Admin Private Key JSON file at `backend/services/auth/serviceAccountKey.json`. 🔑

---

## 🚀 Speedrun: Local Launch Guide 🏃‍♂️💨

### 🐳 Step 1: Fire Up Redis
Start the Redis docker container in detached mode:
```bash
cd backend
docker compose up -d
```

### 🤝 Step 2: Set Up Shared Modules
Install dependencies for the shared Redis helpers:
```bash
cd backend/shared
npm install
```

### 🚦 Step 3: Start the Backend Engines
Open new terminals and run:

* **Gateway:**
  ```bash
  cd backend/gateway
  npm install
  npm run dev
  ```
* **Auth Service:**
  ```bash
  cd backend/services/auth
  npm install
  npm run dev
  ```

### 🎨 Step 4: Run the UI App
In a final terminal window, spin up the React dev server:
```bash
cd frontend
npm install
npm run dev
```
Open up your browser to **[http://localhost:5173](http://localhost:5173)** and start exploring! 🚀🌌
