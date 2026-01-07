# Railway Deployment Guide

## Problem Fixed

The app was crashing on Railway because:
- Build script creates `/dist/public` directory
- App was looking for `/dist/public` from wrong path
- In production, `import.meta.dirname` points to `/dist` (not source root)
- Path resolution was incorrect: `../../dist/public` doesn't exist in dist folder

## Solution

Changed path resolution in `src/app/vite.ts`:
```typescript
// Before (❌ WRONG):
const distPath = path.resolve(import.meta.dirname, '../../dist/public');

// After (✅ CORRECT):
const distPath = path.resolve(import.meta.dirname, 'public');
```

When compiled to `/dist/index.js`:
- `import.meta.dirname` = `/dist`
- `path.resolve('/dist', 'public')` = `/dist/public` ✅

## Deployment Steps

### 1. Build Locally (Verify)
```bash
npm run build
```

Expected output:
```
✓ vite v5.4.20 building for production...
✓ built in 2.34s
✓ esbuild built successfully
```

Verify structure:
```bash
ls -la dist/
# Should show:
# - index.js (backend)
# - public/ (frontend)
```

### 2. Push to GitHub
```bash
git add -A
git commit -m "Fix Railway deployment: correct static file path resolution"
git push origin main
```

### 3. Deploy on Railway

**Option A: Auto-Deploy (Recommended)**
1. Go to Railway dashboard
2. Select your project
3. Go to Settings → GitHub
4. Enable "Auto Deploy on Push"
5. Push code to GitHub
6. Railway automatically builds and deploys

**Option B: Manual Deploy**
1. Go to Railway dashboard
2. Select your project
3. Click "Deploy"
4. Select branch (main)
5. Wait for build to complete

### 4. Configure Environment Variables

In Railway dashboard, set:
```
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
```

### 5. Verify Deployment

Check logs:
```
✓ Server running on port 5000
✓ Environment: production
✓ Static file serving ready
```

Test endpoints:
```bash
curl https://your-railway-app.up.railway.app/api/listings
```

## Build Process Explained

### Local Development
```
npm run dev
├─ Vite dev server (port 5173)
├─ Express server (port 5000)
└─ Hot reload enabled
```

### Production Build
```
npm run build
├─ Vite builds React app
│  └─ Output: dist/public/
├─ esbuild bundles backend
│  └─ Output: dist/index.js
└─ Result: dist/
   ├─ index.js (backend)
   └─ public/ (frontend)
```

### Production Start
```
npm start
├─ NODE_ENV=production
├─ node dist/index.js
├─ Serves static files from dist/public
└─ API routes from dist/index.js
```

## File Structure After Build

```
dist/
├── index.js                    # Backend (compiled)
├── public/                     # Frontend (built)
│   ├── index.html
│   ├── assets/
│   │   ├── main-xxx.js
│   │   ├── main-xxx.css
│   │   └── ...
│   └── ...
└── ...
```

## Troubleshooting

### Build fails: "Could not find the build directory"
```bash
# Make sure build completes successfully
npm run build

# Check dist structure
ls -la dist/
ls -la dist/public/
```

### Railway deployment fails
1. Check build logs in Railway dashboard
2. Verify DATABASE_URL is set
3. Check NODE_ENV=production
4. Verify PORT is set

### App crashes on startup
```
Error: Could not find the build directory: /dist/public
```

**Solution**: This is now fixed. The path resolution is correct.

### Static files not loading
1. Check if `dist/public/` exists
2. Verify `index.html` is in `dist/public/`
3. Check browser console for 404 errors
4. Verify Railway logs show "Static file serving ready"

## Performance Tips

1. **Enable Gzip Compression**
   - Railway does this automatically

2. **Use CDN for Static Assets**
   - Optional: Configure Cloudflare in front of Railway

3. **Database Connection Pooling**
   - Already configured in schema

4. **Monitor Performance**
   - Use Railway dashboard metrics
   - Check response times
   - Monitor database queries

## Security Checklist

- ✅ DATABASE_URL is secure (Railway managed)
- ✅ SESSION_SECRET is strong (set in Railway)
- ✅ NODE_ENV=production (set in Railway)
- ✅ HTTPS enabled (Railway default)
- ✅ CORS configured (if needed)
- ✅ Rate limiting (optional)

## Rollback

If deployment fails:
1. Go to Railway dashboard
2. Select previous deployment
3. Click "Redeploy"
4. Or push a fix and redeploy

## Monitoring

### Check Logs
```
Railway Dashboard → Logs
```

### Common Log Messages
```
✓ Server running on port 5000
✓ Environment: production
✓ Static file serving ready
✓ API routes registered
```

### Error Logs
```
Failed to initialize application: Error: ...
```

Check:
1. DATABASE_URL is correct
2. All environment variables set
3. Build completed successfully

## Next Steps

1. ✅ Fix applied to code
2. ✅ Push to GitHub
3. ⏳ Deploy on Railway
4. ⏳ Test endpoints
5. ⏳ Monitor logs

## Support

If deployment still fails:
1. Check Railway logs
2. Verify all environment variables
3. Ensure build completes locally
4. Check database connection
5. Review error messages carefully

---

**Status**: ✅ Ready for Railway deployment

