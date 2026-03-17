# Deploying NestJS API on Vercel

This guide explains how to deploy your NestJS API (located in the `api/` folder) to Vercel for production use.

---

## Prerequisites

- Vercel account (https://vercel.com/)
- Vercel CLI installed (`npm install -g vercel`)
- Your project repository pushed to GitHub, GitLab, or Bitbucket
- API must be built as a standalone Node.js server (not serverless)

---

## Step 1: Prepare Your API

1. Ensure your NestJS app is ready for production:
   - Run `npm run build` in the `api/` folder.
   - Confirm your main entry point is `dist/main.js`.
   - Check that your `package.json` in `api/` has a `start` script:
     ```json
     "scripts": {
       "start": "node dist/main.js"
     }
     ```

2. Add a `vercel.json` file to the `api/` folder:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "package.json", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "/dist/main.js" }
     ]
   }
   ```

---

## Step 2: Configure Environment Variables

- In the Vercel dashboard, go to your project settings.
- Add all required environment variables (e.g., database connection, API keys) under the **Environment Variables** section.

---

## Step 3: Deploy via Vercel CLI

1. Open a terminal and navigate to the `api/` folder:
   ```sh
   cd api
   ```

2. Run the deploy command:
   ```sh
   vercel --prod
   ```

3. Follow the prompts to link your project and select the correct settings.

---

## Step 4: Automatic Deployments (CI/CD)

- Connect your GitHub/GitLab/Bitbucket repo to Vercel.
- Vercel will automatically deploy on every push to the main branch.

---

## Step 5: Post-Deployment

- Test your API endpoint at the Vercel-provided URL.
- Monitor logs and errors in the Vercel dashboard.
- Update environment variables as needed.

---

## Notes

- Vercel is optimized for serverless, but can run Node.js servers for simple APIs.
- For heavy workloads or background jobs, consider using a dedicated server (e.g., AWS, DigitalOcean).
- If you use TypeORM or other DB libraries, ensure your database is accessible from Vercel.

---

For more details, see:
- https://vercel.com/docs/concepts/projects/deployments
- https://vercel.com/docs/concepts/functions/serverless-functions/nodejs
