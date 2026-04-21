# 🚀 Vercel Deployment Guide - Quantum Trade Solutions

Follow these steps to deploy your platform and set up your MySQL database for production.

## 1. Set Up Your MySQL Database
Vercel does not host databases. We recommend using **Aiven** or **Railway** (Free Tiers available).

### Using Aiven (Recommended)
1. Go to [aiven.io](https://aiven.io/) and create a free MySQL service.
2. Once active, copy the following details:
   - **Host** (e.g. `mysql-xxxx.aivencloud.com`)
   - **Port** (usually `28148` or `3306`)
   - **User** (usually `avnadmin`)
   - **Password**
   - **Database Name** (usually `defaultdb`)

## 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/) and click **"Add New" > "Project"**.
2. Select your repository: `jaikeerthi07/quantum-trade-solutions`.
3. **Project Name**: Keep as `quantum-trade-solutions`.
4. **Framework Preset**: Select **Vite**.
5. **Root Directory**: Leave as the repository root (Vercel will detect `vercel.json`).

## 3. Configure Environment Variables
In the Vercel Dashboard, go to **Settings > Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `DB_HOST` | Your Aiven/Railway host |
| `DB_USER` | Your database username |
| `DB_PASS` | Your database password |
| `DB_NAME` | `defaultdb` (or your DB name) |
| `DB_SSL` | `true` (Required for Aiven/Railway) |
| `ENCRYPTION_KEY` | Any random 32-character string |

## 4. Finalize
Click **Deploy**. Vercel will build the frontend and set up the Express backend as serverless functions.

---
**Status**: Once deployed, your API will be available at `/api` and your frontend will be served at the root domain.
