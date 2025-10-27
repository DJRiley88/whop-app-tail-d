# Deployment Instructions for Whop App

## 🚀 Deploy to Production

### Step 1: Seed Your Database

Your database is currently empty. You need to seed it with demo challenges and data.

#### Option A: Run Locally

```bash
# Make sure you have your .env.development.local file with database credentials
pnpm run seed
```

#### Option B: Run on Vercel (Recommended)

1. Go to your Vercel project dashboard
2. Open the "Deployments" tab
3. Find your latest deployment
4. Click on the deployment → "Logs" tab
5. Open the terminal/console and run:
   ```bash
   pnpm run seed
   ```

#### Option C: Use Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run seed command on your deployment
vercel env pull  # Pull environment variables
pnpm run seed
```

### Step 2: Verify Your App URL

**⚠️ IMPORTANT:** Make sure your Whop App URL is set to your **root Vercel URL**, not a specific challenge URL.

**Correct App URL:**
```
https://your-app.vercel.app
```

**Incorrect App URLs:**
```
https://your-app.vercel.app/experiences/123  ❌
https://your-app.vercel.app/dashboard        ❌
```

### Step 3: Update Whop App Settings

1. Go to https://dashboard.whop.com
2. Navigate to "Develop" or "Apps"
3. Find your app
4. Click on it → "Settings"
5. Update "App URL" to your Vercel production URL (root URL only)
6. Save changes

### Step 4: Test Your App

1. Install your app into a Whop space using the "Install" button
2. The app should now load and show:
   - Dashboard with demo challenges
   - Active challenges you can explore
   - Leaderboards with demo data

### Step 5: Submit to App Store

Once everything works:

1. Go to your app in Whop Dashboard
2. Click "Submit to App Store"
3. Fill in the required information:
   - App name and description
   - Screenshots (at least 3)
   - Category
   - Pricing (if applicable)
4. Submit for review

## 🔧 Troubleshooting

### Issue: "Challenge Not Found" Error

**Cause:** Database is empty or app URL is pointing to a specific challenge that doesn't exist.

**Solution:**
1. Run the seed script: `pnpm run seed`
2. Make sure your Whop App URL is the root URL (see Step 2)
3. Clear your browser cache
4. Reinstall the app in Whop

### Issue: Database Connection Error

**Cause:** Environment variables not set correctly in Vercel.

**Solution:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify these variables are set:
   - `POSTGRES_URL_NON_POOLING` - Your Supabase/Postgres connection string
   - `WHOP_API_KEY`
   - `NEXT_PUBLIC_WHOP_APP_ID`
   - `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
   - `NEXT_PUBLIC_WHOP_COMPANY_ID`
3. Redeploy after updating environment variables

### Issue: App Not Loading in Whop

**Cause:** App URL configuration is wrong.

**Solution:**
1. Check that your Vercel deployment is live (green status)
2. Verify the App URL in Whop dashboard is correct
3. Try opening the URL directly in a browser to test
4. Make sure there are no CORS issues

## 📝 Environment Variables Checklist

Make sure these are set in Vercel:

### Whop Configuration
- ✅ `WHOP_API_KEY` - Your Whop API key
- ✅ `NEXT_PUBLIC_WHOP_APP_ID` - Your Whop app ID
- ✅ `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - Agent user ID
- ✅ `NEXT_PUBLIC_WHOP_COMPANY_ID` - Your company ID
- ✅ `WHOP_WEBHOOK_SECRET` - Webhook secret (optional)

### Database
- ✅ `POSTGRES_URL_NON_POOLING` - PostgreSQL connection string

## 🎯 Next Steps After Deployment

1. **Customize Demo Data**: Update challenge names, descriptions, and prize pools
2. **Create Real Challenges**: Use the dashboard to create your own challenges
3. **Add More Bets**: Post betting slips through the admin interface
4. **Invite Users**: Share your Whop space with members to start competing
5. **Monitor Analytics**: Check the analytics dashboard to track engagement

## 💡 Tips

- Keep your database connection string private
- Regularly backup your database
- Monitor your Vercel usage and database connections
- Test your app in a staging environment before going live
- Collect user feedback and iterate on features

---

**Questions or Issues?** Contact support or check the Whop documentation at https://dev.whop.com

