# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 20.x or higher installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
# On Windows
copy .env.example .env.local

# On Mac/Linux
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/custom-app-tracker

# For MongoDB Atlas (recommended):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/custom-app-tracker

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Your local development URL:
NEXTAUTH_URL=http://localhost:3000

# Optional: GitHub Personal Access Token for repo integration
GITHUB_TOKEN=

# Optional: Vercel Blob token for production file uploads
BLOB_READ_WRITE_TOKEN=
```

### 3. Start MongoDB (if using local)

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Seed the Database

Create the default admin user:

```bash
npm run seed
```

You should see:
```
✅ Admin user created successfully
📧 Email: admin@example.com
🔑 Password: admin123
⚠️  Please change the password after first login
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. First Login

1. Navigate to http://localhost:3000
2. You'll be redirected to the login page
3. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
4. **Important**: Change this password immediately!

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Check if MongoDB is running: `mongo` or `mongosh`
- Verify connection string in `.env.local`
- For Atlas: Check IP whitelist and credentials

### Issue: "NEXTAUTH_SECRET not found"

**Solution:**
- Generate a secret: `openssl rand -base64 32`
- Add it to `.env.local`
- Restart the development server

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## Verify Installation

After starting the dev server, you should be able to:

1. ✅ Access the login page
2. ✅ Login with admin credentials
3. ✅ See the dashboard with stats
4. ✅ Create a new app
5. ✅ Navigate between pages

## Next Steps

1. **Change Admin Password**: Click on your profile > Change password
2. **Add Your First App**: Click "Add New App" from the dashboard
3. **Set Up GitHub Integration**: Add your GitHub token to `.env.local`
4. **Explore Features**: Try adding documentation, changelogs, and attachments

## Development Workflow

### Running the App

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Seed database (creates admin user)
npm run seed
```

### File Structure

```
/app              - Next.js pages and API routes
/components       - React components
/hooks           - Custom React hooks
/lib             - Utilities and helpers
/models          - Mongoose database models
/public          - Static files
/scripts         - Database scripts
```

### Making Changes

1. Edit files in `/app`, `/components`, or `/lib`
2. Changes hot reload automatically
3. Check console for errors
4. Test in browser

## Getting Help

- **Documentation**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Check existing GitHub issues or create a new one

## Tips for Success

✅ Always use the seeded admin account initially
✅ Set a strong password after first login
✅ Test GitHub integration with a public repo first
✅ Use meaningful names and descriptions for apps
✅ Write documentation in Markdown format
✅ Keep changelogs updated with each version
✅ Tag apps appropriately for easy searching

## Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

---

Need help? Open an issue or check the documentation!

