# Setting Up Vercel Blob Storage for File Uploads

Your form now uploads images to Vercel Blob Storage and stores the URLs in the database, making them accessible from anywhere.

## Quick Setup (5 minutes)

### 1. Create Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com)
2. Click on your project
3. Go to **Storage** tab
4. Click **Create Database** or **Connect Store**
5. Select **Blob**
6. Click **Create**

### 2. Get Your Blob Token

After creating the Blob store:
1. You'll see the connection details
2. Copy the `BLOB_READ_WRITE_TOKEN` value
3. It looks like: `vercel_blob_rw_XXXXXXXXX`

### 3. Add Token to Environment Variables

**For Local Development:**
1. Open `.env.local` in your project
2. Uncomment the line and add your token:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_actual_token_here
   ```
3. Save the file
4. Restart your dev server (`pnpm dev`)

**For Production (Vercel):**
The token is automatically added when you create the Blob store in your Vercel project.

### 4. Test It Out

1. Run `pnpm dev`
2. Fill out the form with some images
3. Submit the form
4. Check the database - you'll see URLs like:
   ```
   https://xxxxxxxxx.public.blob.vercel-storage.com/onboarding/CEDO-XXX/logos/1234567890-logo.png
   ```

## How It Works

### Before (Old Way) ❌
```
Database: { name: "logo.png", type: "image/png", size: 12345 }
```
- Can't view images
- Can't share images
- Just metadata

### After (New Way) ✅
```
Database: https://xxxxx.blob.vercel-storage.com/onboarding/.../logo.png
```
- Direct image URL
- Publicly accessible
- Can be displayed anywhere

## File Organization

Files are organized by submission:
```
onboarding/
  └── CEDO-ABC123/
      ├── logos/
      │   ├── 1234567890-logo.png
      │   └── 1234567891-logo-dark.png
      ├── brand-guidelines/
      │   └── 1234567892-guidelines.pdf
      ├── car-images/
      │   ├── 1234567893-front.jpg
      │   └── 1234567894-side.jpg
      ├── drivers/
      │   ├── headshots/
      │   │   └── 1234567895-driver.jpg
      │   └── hero-images/
      │       └── 1234567896-action.jpg
      ├── tracks/
      ├── experiential-events/
      ├── ownership/
      └── staff/
```

## Database Changes

The database now stores URLs instead of file metadata:

**Single Files** (e.g., brand guidelines, headshots):
- Stores a single URL string
- Example: `https://...blob.../guidelines.pdf`

**Multiple Files** (e.g., logos, car images):
- Stores JSON array of URLs
- Example: `["https://.../logo1.png", "https://.../logo2.png"]`

## Viewing Uploaded Images

### Query Example
```sql
SELECT 
  reference_id,
  logos,
  car_images
FROM onboarding_submissions
WHERE reference_id = 'CEDO-XXX';
```

### Parse JSON Arrays in Your App
```typescript
// In your app code
const submission = await fetchSubmission(referenceId)
const logoUrls = JSON.parse(submission.logos) // Array of URLs
```

## Pricing

Vercel Blob Storage:
- **Hobby (Free)**: 500 MB storage
- **Pro**: $0.15/GB storage + $0.15/GB bandwidth
- **Enterprise**: Custom pricing

For most use cases, the free tier is sufficient for development and testing.

## Local Development vs Production

**Local Development:**
- Files upload to production Blob storage
- You need the BLOB_READ_WRITE_TOKEN in .env.local

**Production:**
- Token is automatically configured
- Files stored in same Blob storage

**Note:** Even in development, files go to the real Blob storage (there's no "local" blob storage).

## Troubleshooting

**Error: "BLOB_READ_WRITE_TOKEN is not defined"**
→ Add the token to `.env.local` and restart dev server

**Error: "Failed to upload file"**
→ Check your Blob storage is created in Vercel Dashboard

**Files uploading but not showing in database**
→ Make sure you created the database tables (run `database-schema.sql`)

**Want to delete old files?**
→ Use Vercel Dashboard → Storage → Blob → Browse files

## Security Notes

- Files are **public** by default (anyone with URL can access)
- URLs are unique and hard to guess
- For private files, you'd need to change `access: "public"` to `access: "private"` and use signed URLs
- File uploads are validated by Next.js Server Actions

## Next Steps

1. ✅ Create Blob store in Vercel
2. ✅ Add BLOB_READ_WRITE_TOKEN to .env.local
3. ✅ Restart dev server
4. ✅ Test uploading files
5. ✅ View URLs in database

After this, your images will be accessible via direct URLs that you can use in your app!
