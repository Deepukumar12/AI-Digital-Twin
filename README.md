# AI-Based Personal Digital Twin for Career Intelligence

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that analyzes student resumes using the OpenAI API to extract structured career intelligence and build a dynamic Digital Twin profile.

## Prerequisites

Before running the project, you **must** have the following installed on your system:
1. **Node.js & npm**: Download and install from [nodejs.org](https://nodejs.org/) (Recommended: LTS version).
2. **MongoDB**: Install MongoDB locally ([Community Server](https://www.mongodb.com/try/download/community)) or use a cloud database like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **OpenAI API Key**: You need an active API key from OpenAI to process resumes and power the AI mentor chat.

## Project Structure

- `/backend`: Node.js + Express API server
- `/frontend`: React + Vite frontend application
- `/docs`: System documentation and architecture diagrams

## 🚀 Setup & Running Instructions

You will need to run the backend and frontend in **two separate terminal windows**.

### Step 1: Backend Setup

1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd /Users/deepukumar/Desktop/AI-Digital-Twin/backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables:
   - Open `/Users/deepukumar/Desktop/AI-Digital-Twin/backend/.env` in your code editor.
   - Update the variables with your actual keys. Example:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/aidigitaltwin
     JWT_SECRET=super_secret_jwt_key_12345
     OPENAI_API_KEY=sk-your-actual-openai-api-key-here
     ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend should now be running on `http://localhost:5000`.*

### Step 2: Frontend Setup

1. Open a **second** terminal and navigate to the frontend folder:
   ```bash
   cd /Users/deepukumar/Desktop/AI-Digital-Twin/frontend
   ```
2. Install the necessary frontend dependencies:
   ```bash
   npm install
   ```
3. Install Tailwind CSS and its peer dependencies (if `npm install` didn't catch them):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be accessible in your web browser, typically at `http://localhost:5173`.*

## Important Notes
- **Testing the App**: Start by going to the local frontend URL, click **Sign Up** to create an account, and then proceed to **Upload Resume** with a sample PDF.
- **Port Conflicts**: Ensure port `5000` and `5173` are not currently in use by other applications on your system.
# AI-Digital-Twin
