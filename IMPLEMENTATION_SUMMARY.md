# Database Integration Summary

## ✅ What Has Been Completed

### 1. Package Installation
- Installed `@neondatabase/serverless` package for connecting to your Neon PostgreSQL database

### 2. Server Action Created
**File:** [lib/actions.ts](lib/actions.ts)
- Created `submitOnboardingForm()` Server Action that:
  - Accepts the complete form data
  - Generates a unique reference ID (e.g., `CEDO-XYZ123-ABC4`)
  - Saves all data across 7 database tables
  - Returns success status and reference ID
  - Handles errors gracefully

### 3. Form Updated
**File:** [components/onboarding/onboarding-form.tsx](components/onboarding/onboarding-form.tsx)
- Updated `onSubmit` function to call the Server Action
- Added error handling with user feedback
- Made the function async to wait for database response

### 4. Database Schema
**File:** [database-schema.sql](database-schema.sql)
- Created comprehensive SQL schema with 7 tables:
  - `onboarding_submissions` - Main form data
  - `drivers` - Driver information
  - `tracks` - Track photography details
  - `experiential_events` - Event photography
  - `ownership` - Team ownership
  - `staff` - Team staff members
  - `custom_faqs` - Custom FAQ entries
- All tables linked via `reference_id` foreign key
- Includes indexes for query performance
- Uses proper data types and constraints

### 5. API Route (Optional)
**File:** [app/api/submissions/route.ts](app/api/submissions/route.ts)
- GET endpoint to view submissions
- List all submissions: `GET /api/submissions`
- View specific submission: `GET /api/submissions?referenceId=CEDO-XXX`
- Useful for testing and admin purposes

## 🚀 Next Steps - ACTION REQUIRED

### Step 1: Create Database Tables
You **must** run the SQL schema before the form will work:

1. Open your [Vercel Dashboard](https://vercel.com)
2. Go to your project → Storage tab
3. Click "Open in Neon Console"
4. Navigate to SQL Editor
5. Copy the entire contents of `database-schema.sql`
6. Paste and click "Run"

### Step 2: Test Locally
```bash
pnpm dev
```
Navigate to http://localhost:3000 and test a submission.

### Step 3: Verify Data
After submitting the test form, check your database:
```sql
-- See latest submission
SELECT * FROM onboarding_submissions ORDER BY created_at DESC LIMIT 1;

-- See related data (replace with your reference ID)
SELECT * FROM drivers WHERE reference_id = 'CEDO-XXX';
```

Or use the API:
```bash
curl http://localhost:3000/api/submissions
```

## 📊 Data Flow

```
User fills form → Clicks Submit → 
  ↓
onSubmit() called →
  ↓
submitOnboardingForm() Server Action →
  ↓
Connects to Neon Database →
  ↓
Saves data to 7 tables →
  ↓
Returns reference ID →
  ↓
Shows confirmation screen
```

## 🗂️ Database Structure

```
onboarding_submissions (parent)
├── reference_id (unique identifier)
├── brand assets data
├── car information
├── photography settings
├── event preferences
└── FAQ settings

drivers (child) ──────┐
tracks (child) ───────┤
experiential_events ──┤── All linked by reference_id
ownership (child) ────┤
staff (child) ────────┤
custom_faqs (child) ──┘
```

## ⚠️ Current Limitations

### File Handling
The current implementation stores **file metadata** (name, type, size) as JSON, not the actual files.

**For production, you should:**
1. Upload files to Vercel Blob Storage or AWS S3
2. Get the file URL from the upload
3. Store the URL in the database instead of metadata
4. Update the Server Action to handle uploads

Example with Vercel Blob:
```typescript
import { put } from '@vercel/blob'

// In your Server Action:
const blob = await put(fileName, file, { access: 'public' })
// Then save blob.url to database
```

## 🔒 Security Considerations

- Environment variables are properly configured in `.env.local`
- Database connection uses SSL (required by Neon)
- Server Actions run on the server, not exposed to client
- No sensitive data logged to console

## 📝 Environment Variables

Your `.env.local` already contains:
```env
DATABASE_URL=postgresql://...
```

For Vercel deployment, add the same variable:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add `DATABASE_URL` with the same value
3. Deploy

## 🐛 Troubleshooting

**"relation does not exist"**
→ Run the database schema SQL

**"DATABASE_URL is not defined"**
→ Check `.env.local` exists and is properly formatted

**Form doesn't show reference ID**
→ Check browser console for errors
→ Verify database tables were created
→ Check network tab for failed requests

**Can't see data in database**
→ Use Neon SQL Editor to query directly
→ Use the `/api/submissions` endpoint

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) (for file uploads)

## 🎯 Production Checklist

Before going live:
- [ ] Run database schema in production Neon instance
- [ ] Set DATABASE_URL environment variable in Vercel
- [ ] Implement proper file upload solution (Vercel Blob/S3)
- [ ] Add email notifications on form submission
- [ ] Create admin dashboard to view submissions
- [ ] Add data export functionality
- [ ] Set up database backups
- [ ] Add rate limiting to prevent spam
- [ ] Implement form validation on server side
- [ ] Add logging and monitoring

## 💡 Tips

- The reference ID is unique for each submission - use it to track forms
- All related data (drivers, tracks, etc.) share the same reference ID
- Foreign keys ensure data integrity - deleting a submission cascades to related records
- Indexes on reference_id fields ensure fast queries
- JSON fields (photography_types, event_types) allow flexible arrays
