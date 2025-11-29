# Custom App Tracker

A comprehensive web application for managing, documenting, and sharing custom Frappe/ERPNext applications. Built with Next.js 14, MongoDB, and NextAuth.

## Features

- **App Management**: Create, edit, and organize custom Frappe apps
- **Documentation Hub**: Write and manage documentation in Markdown
- **GitHub Integration**: Auto-fetch repo metadata, README, and releases
- **Version Control**: Track changelogs and version history
- **File Attachments**: Upload PDFs, images, and documentation files
- **Role-Based Access**: Admin, Developer, and Viewer roles
- **Search & Filter**: Powerful search across apps and documentation
- **Modern UI**: Built with Tailwind CSS and Shadcn/UI components

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI** components
- **React Query** (TanStack Query)
- **NextAuth** for authentication

### Backend
- **Next.js API Routes**
- **MongoDB** with Mongoose
- **JWT** secured APIs
- **GitHub API** integration (Octokit)

### Deployment
- **Vercel** (Frontend + API)
- **MongoDB Atlas** (Database)
- **Vercel Blob** (File storage in production)

## Prerequisites

- Node.js 20.x or higher
- MongoDB (local or Atlas)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CustomAppTracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/custom-app-tracker
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/custom-app-tracker

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub API (Optional - improves rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Vercel Blob Storage (Production only)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- The app will connect to `mongodb://localhost:27017/custom-app-tracker`

**Option B: MongoDB Atlas**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string and add it to `.env.local`

### 5. Seed the database

Create the default admin user:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Important:** Change this password after first login!

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### User Roles

- **Admin**: Full access - create, edit, delete everything
- **Dev**: Can create and edit apps and documentation (cannot delete)
- **Viewer**: Read-only access

### Creating Your First App

1. Sign in with admin credentials
2. Click "Add New App" on the dashboard
3. Fill in the app details:
   - Name, Client, Description
   - GitHub Repository URL (optional)
   - Frappe Cloud Install URL (optional)
   - Version and Status
4. Click "Fetch Data" to auto-populate from GitHub
5. Add tags for better organization
6. Save the app

### Managing Documentation

1. Go to an app's detail page
2. Navigate to the "Documentation" tab
3. Click "Add Documentation"
4. Write content in Markdown format
5. Preview before saving
6. Documents are organized by order

### Adding Changelogs

1. Go to an app's detail page
2. Navigate to the "Changelog" tab
3. Click "Add Changelog"
4. Enter version number and changes
5. Use Markdown for formatting

### Uploading Files

1. Go to an app's detail page
2. Navigate to the "Attachments" tab
3. Click "Upload File"
4. Select a file (PDF, Markdown, or Image)
5. Files are stored locally in development, on Vercel Blob in production

## GitHub Integration

To use the GitHub integration feature:

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate new token (classic)
   - Select scopes: `repo` (for private repos) or `public_repo` (for public only)
   - Copy the token

2. Add to `.env.local`:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

3. When creating an app, paste the GitHub repo URL and click "Fetch Data"
4. The app will automatically fetch:
   - Repository name and description
   - Star count
   - Last commit date
   - Branches
   - README content

## Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variables:
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `NEXTAUTH_URL` (your production URL, e.g., https://yourapp.vercel.app)
   - `NEXTAUTH_SECRET` (generate a new one for production)
   - `GITHUB_TOKEN` (optional)
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob token for file uploads)

4. Deploy!

5. After deployment, run the seed script once:
   ```bash
   # SSH into Vercel or use their CLI
   vercel env pull .env.local
   npm run seed
   ```

### File Storage Setup (Production)

For file uploads in production:

1. Go to your Vercel project settings
2. Navigate to Storage
3. Create a Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to your environment variables

## Project Structure

```
/app                    # Next.js App Router pages
  /api                 # API routes
    /apps             # App CRUD operations
    /auth             # Authentication
    /github           # GitHub integration
    /search           # Search functionality
  /dashboard          # Dashboard page
  /apps               # Apps management pages
  /login              # Login page
  /register           # Registration page

/components            # React components
  /apps               # App-related components
  /common             # Reusable components
  /docs               # Documentation components
  /forms              # Form components
  /layout             # Layout components
  /ui                 # Shadcn UI components

/hooks                 # Custom React hooks
/lib                   # Utility functions
  /validations        # Zod schemas
/models               # Mongoose models
/scripts              # Database scripts
```

## Development

### Adding New Features

1. Create API routes in `/app/api/`
2. Add Mongoose models in `/models/`
3. Create validation schemas in `/lib/validations/`
4. Build React hooks in `/hooks/`
5. Create UI components in `/components/`
6. Add pages in `/app/`

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/UI for components
- React Hook Form + Zod for forms
- React Query for data fetching

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or connection string is correct
- Check network access settings in MongoDB Atlas
- Verify IP whitelist includes your IP

### NextAuth Errors

- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### File Upload Issues

- Development: Check `public/uploads/` directory exists
- Production: Verify `BLOB_READ_WRITE_TOKEN` is set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for your projects!

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review existing issues for solutions

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
