# Database Setup Instructions

This document explains how to set up the Neon PostgreSQL database for the CEDO Onboarding Form.

## Prerequisites

- Vercel account with a project connected to this repository
- Neon database already provisioned (you have this set up)
- `.env.local` file with database credentials (already configured)

## Setup Steps

### 1. Install Dependencies ✅

The required package has already been installed:
```bash
pnpm add @neondatabase/serverless
```

### 2. Create Database Tables

You need to run the SQL schema to create all the necessary tables in your Neon database.

**Option A: Using Neon Console (Recommended)**
1. Go to your Vercel Dashboard
2. Navigate to the Storage tab
3. Click "Open in Neon Console"
4. Go to the SQL Editor
5. Copy the entire contents of `database-schema.sql`
6. Paste into the SQL Editor and click "Run"

**Option B: Using Vercel Dashboard**
1. Go to your Vercel project
2. Navigate to Storage → Neon Database
3. Click on "Query" or "SQL Editor"
4. Run the SQL from `database-schema.sql`

### 3. Verify Tables Created

After running the schema, verify these tables exist:
- `onboarding_submissions` (main table)
- `drivers`
- `tracks`
- `experiential_events`
- `ownership`
- `staff`
- `custom_faqs`

You can verify by running:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 4. Test the Application

Run the development server:
```bash
pnpm dev
```

Navigate to `http://localhost:3000` and submit a test form to verify the database integration works.

### 5. Verify Data Submission

After submitting the form, check your database:
```sql
SELECT * FROM onboarding_submissions ORDER BY created_at DESC LIMIT 1;
SELECT * FROM drivers WHERE reference_id = 'YOUR_REFERENCE_ID';
```

## Database Structure

### Main Tables

**onboarding_submissions**
- Stores all form data from Steps 1-3, 6-8
- Uses `reference_id` as a unique identifier for each submission

**Related Tables** (linked by `reference_id`)
- `drivers` - Driver information (Step 4)
- `tracks` - Track photography details (Step 3)
- `experiential_events` - Event photography (Step 3)
- `ownership` - Team ownership info (Step 5)
- `staff` - Team staff members (Step 5)
- `custom_faqs` - Custom FAQ entries (Step 7)

### File Storage

Currently, file metadata (name, type, size) is stored as JSON in TEXT fields. For production, you may want to:
1. Upload actual files to Vercel Blob Storage or S3
2. Store the file URLs in the database instead of metadata
3. Update the Server Action to handle file uploads

## Environment Variables

Make sure your `.env.local` contains:
```env
DATABASE_URL=your_neon_connection_string
```

For production deployment, add these same variables to your Vercel project settings.

## Troubleshooting

**Error: "relation does not exist"**
- The database tables haven't been created yet
- Run the SQL schema from `database-schema.sql`

**Error: "DATABASE_URL is not defined"**
- Check that `.env.local` exists and contains DATABASE_URL
- For local development, run: `vercel env pull .env.local`

**Connection Issues**
- Verify your IP is whitelisted in Neon (usually automatic with Neon)
- Check that the DATABASE_URL is correct and uses SSL mode

## Next Steps

Consider implementing:
1. **File Upload Service**: Integrate Vercel Blob or AWS S3 for actual file storage
2. **Error Handling**: Add better error messages and user feedback
3. **Data Validation**: Add database-level constraints and triggers
4. **Admin Dashboard**: Create a view to browse submissions
5. **Email Notifications**: Send confirmation emails on submission
