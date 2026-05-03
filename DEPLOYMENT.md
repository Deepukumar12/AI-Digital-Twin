# 🚀 AI Digital Twin: Production Deployment Guide

Since this project uses a decoupled **3-Tier Architecture** (Backend API, Main Frontend, Admin Frontend), you will need to deploy the components independently. This guide uses the most popular, free/low-cost modern hosting platforms.

---

## Step 1: Database Setup (MongoDB Atlas)
Your local backend currently uses `mongodb://localhost:27017`. For production, you need a cloud database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a new cluster (the free **M0 Sandbox** is perfect).
3. Under **Database Access**, create a database user and securely save the password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Click **Connect** -> **Drivers** and copy your Connection String (URI). It will look something like:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/aidigitaltwin?retryWrites=true&w=majority`

---

## Step 2: Deploy the Backend (Render or Railway)
We recommend **Render.com** as it is highly optimized for Node.js backends.

1. Create a free account on [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub account and select the `AI-Digital-Twin` repository.
4. **Configuration Settings:**
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (Make sure your `backend/package.json` has `"start": "node app.js"`)
5. **Environment Variables:** Scroll down to Advanced -> Environment Variables and add your production keys:
   - `PORT`: `5000`
   - `MONGODB_URI`: *(Paste the Atlas string from Step 1)*
   - `JWT_SECRET`: *(Create a long, random secure string)*
   - `GEMINI_API_KEY`: *(Your Google AI key)*
   - `OPENAI_API_KEY`: *(Your OpenAI key)*
6. Click **Create Web Service**. Render will deploy your API and give you a live URL (e.g., `https://ai-digital-twin-backend.onrender.com`).

---

## Step 3: Deploy the Frontends (Vercel or Netlify)
We recommend **Vercel** for lightning-fast React deployments. You will do this process **twice** (once for the Main Frontend, once for the Admin Portal).

### Part A: Deploying the Main Frontend
1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import the `AI-Digital-Twin` GitHub repository.
4. **Configuration Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit this and select `frontend`
5. **Environment Variables:**
   - Name: `VITE_API_URL`
   - Value: `https://ai-digital-twin-backend.onrender.com/api` *(Use your live backend URL from Step 2!)*
6. Click **Deploy**. Vercel will give you a live URL for your main user platform!

### Part B: Deploying the Admin Portal
1. Go back to the Vercel dashboard and click **Add New** -> **Project**.
2. Import the exact same `AI-Digital-Twin` GitHub repository again.
3. **Configuration Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit this and select `admin`  *(This is the only difference!)*
4. **Environment Variables:**
   - Name: `VITE_API_URL`
   - Value: `https://ai-digital-twin-backend.onrender.com/api` *(Same backend URL)*
5. Click **Deploy**. Vercel will give you a live URL specifically for your Admin Portal.

---

## Step 4: Final Security Checks
Once everything is live:
1. Visit your new Admin Portal URL.
2. Log in using your admin credentials (e.g., `admin@example.com`).
3. Verify that the stats and vector memories load successfully from the live database.
4. Visit your Main Frontend URL and try uploading a resume to ensure the AI Gateway triggers successfully in production!

> **Note on Free Tiers**: Render spins down free backend servers after 15 minutes of inactivity. When a user uploads a resume after inactivity, the first request might take ~45 seconds while the server "wakes up". For instant responses, upgrade to a $7/mo Render tier.
