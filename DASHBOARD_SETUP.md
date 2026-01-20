# Dashboard Authentication Setup

This document explains how to set up and use the authenticated dashboard for viewing onboarding submissions.

## Features

The dashboard includes:
- **Authentication**: Secure login using Clerk
- **Submissions List**: View all onboarding submissions in a table format
- **Detailed View**: Click any submission to see complete details including:
  - Brand assets and guidelines
  - Car information and images
  - Driver profiles and social media
  - Track and event photography
  - Team and staff information
  - Event preferences
  - Custom FAQs
  - Approval status

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**
3. Update your `.env.local` file with these values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### 3. Configure Redirect URLs (Optional)

The following redirect URLs are already configured in your `.env.local`:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Start the Development Server

```bash
pnpm dev
```

## Accessing the Dashboard

### Routes

- **Dashboard**: `http://localhost:3000/dashboard`
- **Sign In**: `http://localhost:3000/sign-in`
- **Sign Up**: `http://localhost:3000/sign-up`
- **Submission Details**: `http://localhost:3000/dashboard/submissions/{referenceId}`

### Authentication Flow

1. Navigate to `/dashboard`
2. If not authenticated, you'll be redirected to `/sign-in`
3. Sign in or create an account
4. After authentication, you'll be redirected to the dashboard

## Dashboard Features

### Submissions Table

The main dashboard displays a table with:
- Reference ID (unique identifier)
- Chassis information
- Engine information
- Assets approval status
- Submission date
- View Details button

### Detailed View

Click "View Details" on any submission to see:

#### Brand Assets
- Logo files (with download links)
- Light/dark background versions
- Brand guidelines
- Brand notes

#### Car Information
- Chassis and engine specs
- Other specifications
- Car images (with download links)
- Image requirements (white background, multiple angles)

#### Drivers
- Driver names and personal information
- Hometown and current residence
- Birthdate
- Social media links (Instagram, Facebook, Twitter, TikTok)
- Driver biography
- Headshot and hero images

#### Photography
- Track information and images
- Experiential events with descriptions
- Event photography

#### Team & Staff
- Ownership information
- Team background
- Staff members with contact details
- Role assignments

#### Event Preferences
- IndyCar only setting
- IndyCar NXT inclusion
- Event types

#### Custom FAQs
- Custom questions and answers

#### Review & Approval
- Assets approval status
- Additional notes
- Submission timestamp
- Last updated timestamp

## User Management

### Adding Users

In your Clerk dashboard:

1. Go to **Users**
2. Click **Create User**
3. Add user details (email, name, etc.)
4. The user will receive an invitation email

### Managing Permissions

By default, all authenticated users can access the dashboard. To add role-based access control:

1. In Clerk dashboard, go to **Organizations** or **Roles**
2. Set up roles (e.g., Admin, Viewer)
3. Modify the middleware to check for specific roles

## Security Features

### Protected Routes

The `/dashboard` route and all sub-routes are protected by Clerk middleware:

```typescript
// middleware.ts
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);
```

### User Session

- Users must be authenticated to access the dashboard
- Sessions are managed securely by Clerk
- User can sign out using the UserButton in the header

## Customization

### Styling

The dashboard uses Tailwind CSS and shadcn/ui components. To customize:

1. Update component styles in the respective files
2. Modify the color scheme in `tailwind.config.js`
3. Adjust the layout in `app/dashboard/layout.tsx`

### Adding Features

To add new features:

1. **Export Data**: Add export buttons to download submissions as CSV/JSON
2. **Filters**: Add filtering by date, status, or other fields
3. **Search**: Implement search functionality
4. **Sorting**: Add column sorting to the table
5. **Pagination**: Implement pagination for large datasets
6. **Analytics**: Add charts and statistics

## Troubleshooting

### "Clerk: Missing Publishable Key"

Make sure your `.env.local` has the correct Clerk keys and restart your dev server.

### Can't Access Dashboard

1. Check that you're signed in
2. Verify the middleware is working
3. Check browser console for errors

### Submissions Not Loading

1. Verify your database connection
2. Check that the API route is working: `http://localhost:3000/api/submissions`
3. Check for errors in the terminal

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - All database variables
   - Clerk keys
   - Blob storage token
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`

## Support

For issues with:
- **Clerk Authentication**: [Clerk Documentation](https://clerk.com/docs)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Database**: Check `DATABASE_SETUP.md`
