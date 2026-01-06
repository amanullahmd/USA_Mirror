# Railway Deployment Guide

## Overview

This guide covers deploying the USA Mirror project to Railway with PostgreSQL database.

## Database Setup (Completed ✅)

### Railway PostgreSQL Connection Details

```
Host: yamanote.proxy.rlwy.net
Port: 46135
Database: railway
Username: postgres
Password: JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN
```

### Connection String

```
postgresql://postgres:JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN@yamanote.proxy.rlwy.net:46135/railway
```

### Environment Variable

The `.env` file has been updated with:

```env
DATABASE_URL=postgresql://postgres:JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN@yamanote.proxy.rlwy.net:46135/railway
```

## Database Migrations (Completed ✅)

### Applied Migrations

✅ **0001_professional_schema.sql** - Complete database schema with:
- All 11 tables created
- 30+ performance indexes
- Foreign key constraints
- Unique constraints
- Timestamp tracking

✅ **0002_seed_reference_data.sql** - Reference data seeded:
- 9 business categories
- 3 promotional packages
- 14 sample countries
- 4 US regions
- 5 sample US cities
- 13 field configurations

### Verification

```bash
# Push migrations to Railway database
npm run db:push

# Output:
# [✓] Pulling schema from database...
# [✓] Changes applied
```

## Deployment Steps

### 1. Connect to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link
```

### 2. Set Environment Variables

In Railway dashboard, set:

```
DATABASE_URL=postgresql://postgres:JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN@yamanote.proxy.rlwy.net:46135/railway
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-production-secret-key-here
```

### 3. Deploy Application

```bash
# Build project
npm run build

# Deploy to Railway
railway up
```

### 4. Verify Deployment

```bash
# Check logs
railway logs

# Test API
curl https://your-railway-app.up.railway.app/api/health
```

## Database Connection Methods

### Method 1: Railway CLI

```bash
railway connect Postgres
```

### Method 2: psql Command

```bash
PGPASSWORD=JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN psql \
  -h yamanote.proxy.rlwy.net \
  -U postgres \
  -p 46135 \
  -d railway
```

### Method 3: Connection String

```
postgresql://postgres:JoYDHCbCdLKpKGUrTOWXdbPFktOtlEUN@yamanote.proxy.rlwy.net:46135/railway
```

## Database Backup

### Backup Database

```bash
pg_dump \
  -h yamanote.proxy.rlwy.net \
  -U postgres \
  -p 46135 \
  -d railway \
  > backup.sql
```

### Restore Database

```bash
psql \
  -h yamanote.proxy.rlwy.net \
  -U postgres \
  -p 46135 \
  -d railway \
  < backup.sql
```

## Monitoring

### Check Database Connection

```bash
# From application
npm run check

# From command line
psql -h yamanote.proxy.rlwy.net -U postgres -p 46135 -d railway -c "SELECT 1"
```

### View Logs

```bash
# Railway logs
railway logs

# Application logs
railway logs --service=app
```

## Troubleshooting

### Connection Issues

1. **Verify credentials**
   ```bash
   psql -h yamanote.proxy.rlwy.net -U postgres -p 46135 -d railway
   ```

2. **Check firewall**
   - Ensure port 46135 is accessible
   - Check Railway network settings

3. **Verify DATABASE_URL**
   ```bash
   echo $DATABASE_URL
   ```

### Migration Issues

1. **Rerun migrations**
   ```bash
   npm run db:push
   ```

2. **Check migration status**
   ```bash
   npx drizzle-kit introspect:pg
   ```

3. **View schema**
   ```bash
   psql -h yamanote.proxy.rlwy.net -U postgres -p 46135 -d railway -c "\dt"
   ```

### Application Issues

1. **Check logs**
   ```bash
   railway logs
   ```

2. **Restart service**
   ```bash
   railway restart
   ```

3. **Redeploy**
   ```bash
   npm run build
   railway up
   ```

## Security Considerations

### Production Checklist

- [ ] Change SESSION_SECRET to a strong random value
- [ ] Enable SSL/TLS for database connections
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular database backups
- [ ] Rotate credentials periodically

### Environment Variables

Never commit sensitive data. Use Railway's environment variable management:

```bash
# Set via Railway CLI
railway variables set DATABASE_URL=...
railway variables set SESSION_SECRET=...
```

## Performance Optimization

### Database Indexes

All 30+ indexes are already created:
- Email lookups
- Slug-based queries
- Foreign key columns
- Frequently filtered columns
- Date range queries

### Connection Pooling

Configured in `src/app/config/database.config.ts`:
- Uses Neon serverless connection pooling
- Automatic connection management
- Optimal for serverless deployments

### Caching

Consider implementing:
- Redis for session storage
- Query result caching
- Static asset caching

## Scaling

### Horizontal Scaling

Railway supports automatic scaling:
1. Set min/max instances in Railway dashboard
2. Configure CPU/memory limits
3. Enable auto-scaling policies

### Database Scaling

For larger datasets:
1. Upgrade Railway PostgreSQL plan
2. Enable read replicas
3. Implement database sharding

## Maintenance

### Regular Tasks

- [ ] Monitor database size
- [ ] Review slow query logs
- [ ] Update dependencies
- [ ] Backup database weekly
- [ ] Review security logs
- [ ] Update SSL certificates

### Update Migrations

When schema changes are needed:

1. Create new migration file
2. Update Drizzle schema
3. Test locally
4. Deploy to Railway

```bash
# Example: Add new table
# 1. Update src/app/shared/schema.ts
# 2. Generate migration
npx drizzle-kit generate:pg
# 3. Push to Railway
npm run db:push
```

## References

- [Railway Documentation](https://docs.railway.app/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## Support

For issues or questions:
1. Check Railway dashboard
2. Review application logs
3. Consult documentation
4. Contact Railway support

---

**Last Updated**: January 5, 2025  
**Status**: ✅ Database connected and migrations applied
