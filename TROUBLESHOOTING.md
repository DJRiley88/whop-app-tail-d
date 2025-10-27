# Troubleshooting Guide for Whop App

## Issue: App not working in Whop

### Step 1: Check Your Whop App URL
In your Whop Dashboard (https://dashboard.whop.com):
1. Go to Apps → Your App
2. Click Settings
3. Check the "App URL" field
4. It should be: `https://whop-app-tail-d.vercel.app` (root URL only)
5. Click Save if you changed it

### Step 2: Check Vercel Deployment Status
1. Go to https://vercel.com/dashboard
2. Find your `whop-app-tail-d` project
3. Check if the latest deployment is "Ready" (green)
4. If there's an error (red), click "Build Logs" to see what failed

### Step 3: Test Your App Directly
Open these URLs in your browser to test:
- Root: https://whop-app-tail-d.vercel.app
- Dashboard: https://whop-app-tail-d.vercel.app/dashboard
- Experiences: https://whop-app-tail-d.vercel.app/experiences

If these work in a regular browser but not in Whop, it's likely a Whop App URL configuration issue.

### Step 4: Check Environment Variables in Vercel
Make sure these are set in Vercel → Settings → Environment Variables:
- `WHOP_API_KEY`
- `NEXT_PUBLIC_WHOP_APP_ID`
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
- `NEXT_PUBLIC_WHOP_COMPANY_ID`
- `POSTGRES_URL_NON_POOLING` (your database connection)
- `WHOP_WEBHOOK_SECRET`

### Step 5: Check Vercel Build Logs
If the deployment failed:
1. Click on the failed deployment
2. Click "Build Logs"
3. Look for errors (usually syntax errors, missing environment variables, or build failures)
4. Share the error message

### Step 6: Force a New Deployment
If you made code changes:
```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```
This triggers a new Vercel build even without changes.

## Common Issues

### "Challenge Not Found" Error
**Cause:** Database is empty or app URL is wrong
**Solution:** 
1. Run the seed script: `pnpm run seed` 
2. Make sure Whop App URL is the root URL
3. Clear browser cache

### App URL Wrong
**Symptom:** App doesn't load or shows errors in Whop
**Solution:** 
- Whop App URL should be `https://your-app.vercel.app` (root)
- NOT `https://your-app.vercel.app/dashboard`
- NOT `https://your-app.vercel.app/experiences/123`

### Build Failures
**Common causes:**
- Syntax errors (check build logs)
- Missing environment variables
- TypeScript errors
- Missing dependencies

### User Context Loading Forever
**Cause:** User API failing because no Whop headers
**Solution:** App should show demo admin user when Whop headers are missing

## Need Help?
Share:
1. What you see when opening the app in Whop
2. Any error messages
3. Your Whop App URL configuration
4. Vercel deployment status

