# ⚠️ IMPORTANT: Submit Button Not Working?

## The Problem

If clicking the Submit button does nothing, it's almost certainly because **the database tables haven't been created yet**.

The form tries to save data to the database, but if the tables don't exist, the operation fails silently.

## The Solution

You **MUST** create the database tables before the form will work. Here's how:

### Step 1: Open Neon Console

1. Go to your [Vercel Dashboard](https://vercel.com)
2. Click on your project
3. Go to the **Storage** tab
4. Click **"Open in Neon Console"**

### Step 2: Run the SQL Schema

1. In the Neon Console, click on **SQL Editor** in the left sidebar
2. Open the file `database-schema.sql` in VS Code
3. **Copy the ENTIRE contents** (all 100+ lines)
4. **Paste** into the Neon SQL Editor
5. Click **"Run"** button

### Step 3: Verify Tables Were Created

After running the SQL, you should see output showing 7 tables were created:
- ✓ onboarding_submissions
- ✓ drivers  
- ✓ tracks
- ✓ experiential_events
- ✓ ownership
- ✓ staff
- ✓ custom_faqs

You can verify by running this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Step 4: Test the Form

1. Go back to http://localhost:3000
2. Fill out the form
3. Click Submit
4. You should now see a confirmation screen with a reference ID!

## How to Debug

If it still doesn't work after creating tables:

### Check Browser Console
1. Open browser DevTools (F12 or Cmd+Opt+I)
2. Go to Console tab
3. Try submitting the form
4. Look for errors in red

### Check Server Terminal
Look at your terminal where `pnpm dev` is running. You should see logs like:
```
Server Action called - starting submission...
Database connection initialized
Generated reference ID: CEDO-XXX
Main onboarding record inserted successfully
```

If you see errors instead, they will tell you what's wrong.

### Common Errors

**"relation does not exist"**
→ Tables haven't been created. Run database-schema.sql

**"DATABASE_URL is not defined"**
→ .env.local file is missing or incorrect

**"Failed to save onboarding data"**
→ Check the terminal for the specific database error

## Still Having Issues?

1. Make sure `.env.local` exists and has `DATABASE_URL=...`
2. Restart the dev server: Stop `pnpm dev` and run it again  
3. Clear your browser cache and reload
4. Check that you're on Step 8 (Review) before clicking Submit
5. Check browser console for JavaScript errors

## Quick Test

Want to verify your database is set up correctly? Run this query in Neon SQL Editor:

```sql
-- This should return 7 rows
SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'onboarding_submissions',
  'drivers',
  'tracks', 
  'experiential_events',
  'ownership',
  'staff',
  'custom_faqs'
);
```

If `table_count` is 7, you're good to go! ✅  
If `table_count` is 0, you need to run the schema SQL. ❌
