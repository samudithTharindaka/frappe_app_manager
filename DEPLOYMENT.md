# Deployment Guide

This guide will help you deploy the Custom App Tracker to production.

## Prerequisites

- [ ] GitHub/GitLab/Bitbucket account
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] MongoDB Atlas account ([mongodb.com/atlas](https://www.mongodb.com/cloud/atlas))

## Step 1: Set Up MongoDB Atlas

1. **Create an Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred region
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Vercel deployments
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - It should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/custom-app-tracker`

## Step 2: Set Up Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up (use GitHub for easy integration)

2. **Import Your Repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - In Vercel dashboard, click "Add New" > "Project"
   - Import your repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Environment Variables**
   - In the import screen, expand "Environment Variables"
   - Add the following variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/custom-app-tracker
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-using-openssl-rand-base64-32
   GITHUB_TOKEN=your_github_token (optional)
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~2-5 minutes)
   - Your app will be live at `https://your-app.vercel.app`

## Step 3: Set Up File Storage (Vercel Blob)

1. **Create Blob Store**
   - Go to your project in Vercel
   - Click "Storage" tab
   - Click "Create Database"
   - Choose "Blob"
   - Name it (e.g., "custom-app-tracker-files")
   - Click "Create"

2. **Get Token**
   - The token will be automatically added to your environment variables as `BLOB_READ_WRITE_TOKEN`
   - If not, copy it from the storage settings

3. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## Step 4: Seed the Database

After your first deployment:

1. **Option A: Using Vercel CLI (Recommended)**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link to your project
   vercel link

   # Run seed script
   vercel env pull .env.local
   npm run seed
   ```

2. **Option B: Manual Database Insertion**
   
   Connect to your MongoDB Atlas cluster using MongoDB Compass or the shell and run:

   ```javascript
   use custom-app-tracker;

   db.users.insertOne({
     name: "Admin User",
     email: "admin@example.com",
     password: "$2a$10$...", // You'll need to hash this manually
     role: "Admin",
     createdAt: new Date(),
     updatedAt: new Date()
   });
   ```

3. **Option C: Create User via API**

   Make a POST request to your registration endpoint:
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin User","email":"admin@example.com","password":"admin123"}'
   ```

   Then update the user role in MongoDB to "Admin"

## Step 5: Update NEXTAUTH_URL

After deployment, Vercel assigns you a URL. Update the environment variable:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Edit `NEXTAUTH_URL` to your actual deployment URL
4. Redeploy the application

## Step 6: Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to "Settings" > "Domains"
   - Add your custom domain
   - Follow Vercel's instructions to configure DNS

2. **Update NEXTAUTH_URL**
   - Update the environment variable to your custom domain
   - Redeploy

## Step 7: Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Can login with admin credentials
- [ ] Can create new apps
- [ ] Can upload files
- [ ] GitHub integration works
- [ ] Search functionality works
- [ ] All pages load without errors

## Monitoring and Maintenance

### Vercel Dashboard

- Monitor deployments in the "Deployments" tab
- Check logs in real-time
- View analytics and performance metrics

### MongoDB Atlas

- Monitor database performance
- Set up alerts for high CPU/memory usage
- Regular backups are automatic in Atlas

### GitHub Token

- Renew your GitHub token before it expires
- Update the `GITHUB_TOKEN` environment variable in Vercel
- Redeploy after updating

## Troubleshooting

### Build Failures

**Error: MongoDB connection failed**
- Check your `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas includes 0.0.0.0/0
- Ensure database user credentials are correct

**Error: NextAuth configuration error**
- Verify `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your deployment URL
- Check there are no typos in environment variables

### Runtime Errors

**Error: Cannot connect to database**
- Check MongoDB Atlas cluster is running
- Verify network access settings
- Test connection string in MongoDB Compass

**Error: File upload failed**
- Ensure `BLOB_READ_WRITE_TOKEN` is set
- Verify Vercel Blob storage is created
- Check file size limits (10MB max)

**Error: GitHub API rate limit**
- Add `GITHUB_TOKEN` to environment variables
- Use a Personal Access Token with proper scopes
- Check token hasn't expired

### Performance Issues

**Slow page loads**
- Enable Vercel Analytics to identify bottlenecks
- Check MongoDB indexes are in place
- Consider upgrading MongoDB cluster if needed

**API timeout errors**
- Increase serverless function timeout in Vercel settings
- Optimize database queries
- Add indexes to frequently queried fields

## Scaling

### Database

- **M0 Sandbox** (Free): Good for up to 100 apps
- **M10** ($0.08/hr): Recommended for production with 500+ apps
- **M20+**: For heavy usage with thousands of apps

### Vercel

- **Hobby Plan** (Free): Perfect for personal/small team use
- **Pro Plan** ($20/month): Recommended for business use
- **Enterprise**: For large organizations

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use strong, unique secrets for production
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Keep MongoDB version updated
   - Enable audit logs in production

3. **Application Security**
   - Keep dependencies updated (`npm audit`)
   - Use Content Security Policy headers
   - Enable rate limiting for APIs

4. **Access Control**
   - Review user roles regularly
   - Implement 2FA for admin accounts (future feature)
   - Monitor access logs

## Backup Strategy

### MongoDB Atlas

- Automatic backups with M10+ clusters
- Manual snapshots available
- Export important data regularly

### Code

- Keep code in version control
- Tag releases
- Maintain a changelog

## Support

For deployment issues:
- [Vercel Support](https://vercel.com/support)
- [MongoDB Atlas Support](https://support.mongodb.com)
- GitHub Issues for app-specific problems

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

1. **Production Branch**
   - Push to `main` or `master` for production
   - Automatic deployment to your domain

2. **Preview Deployments**
   - Every PR gets a preview URL
   - Test changes before merging
   - Automatic cleanup after merge

3. **Rollback**
   - Instant rollback from Vercel dashboard
   - Choose any previous deployment
   - Zero downtime

## Conclusion

Your Custom App Tracker is now live! 🎉

Regular maintenance:
- Monitor performance weekly
- Update dependencies monthly
- Review and rotate secrets quarterly
- Back up critical data regularly

Happy tracking!

