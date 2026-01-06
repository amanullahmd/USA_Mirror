# Database Migrations Guide

## Overview

This document describes the professional migration strategy for the USA Mirror project. Migrations are versioned and applied sequentially to maintain database integrity.

## Migration Files

### 0000_brown_salo.sql (Deprecated)
- **Status**: Deprecated - kept for reference only
- **Description**: Initial schema migration (legacy)
- **Note**: Use `0001_professional_schema.sql` for new installations

### 0001_professional_schema.sql (Current)
- **Status**: Active
- **Version**: 1.0.0
- **Description**: Complete professional database schema with:
  - All table definitions with proper constraints
  - Foreign key relationships with CASCADE/RESTRICT rules
  - Comprehensive indexes for performance optimization
  - `updated_at` timestamps on all tables
  - Proper ON DELETE/UPDATE behaviors

**Tables Created**:
- Core: `admin_users`, `users`
- Geographic: `countries`, `regions`, `cities`
- Business: `categories`, `listings`, `submissions`, `promotional_packages`
- Analytics: `listing_views`
- Configuration: `field_configs`

**Key Features**:
- 30+ performance indexes
- Proper foreign key constraints with CASCADE/RESTRICT
- Unique constraints on slugs and codes
- Timestamp tracking (created_at, updated_at)

### 0002_seed_reference_data.sql
- **Status**: Active
- **Version**: 1.0.0
- **Description**: Reference data seeding with:
  - 9 business categories
  - 3 promotional packages
  - 14 sample countries
  - 4 US regions (states)
  - 5 sample US cities
  - 13 field configurations

**Features**:
- Uses `ON CONFLICT` for safe re-runs
- Idempotent - can be run multiple times
- Automatically updates existing records
- Maintains referential integrity

## Running Migrations

### Using Drizzle Kit

```bash
# Push migrations to database
npm run db:push

# Generate new migrations from schema changes
npx drizzle-kit generate
```

### Manual SQL Execution

```bash
# Connect to PostgreSQL
psql -U username -d database_name -h localhost

# Run migration file
\i src/migrations/0001_professional_schema.sql
\i src/migrations/0002_seed_reference_data.sql
```

## Migration Strategy

### Development Environment
1. Run all migrations in order
2. Seed reference data
3. Create test data as needed

### Production Environment
1. Backup database before running migrations
2. Run migrations in order (0001, 0002, etc.)
3. Verify data integrity
4. Monitor application performance

## Best Practices

### Creating New Migrations

1. **Naming Convention**: `NNNN_description.sql`
   - Use sequential numbers (0003, 0004, etc.)
   - Use descriptive names in snake_case

2. **Structure**:
   ```sql
   -- ========================================
   -- DESCRIPTION
   -- Version: X.Y.Z
   -- Created: YYYY-MM-DD
   -- ========================================
   
   BEGIN;
   
   -- Your migration SQL here
   
   COMMIT;
   ```

3. **Safety**:
   - Always use `BEGIN;` and `COMMIT;`
   - Use `IF NOT EXISTS` for idempotency
   - Test migrations locally first
   - Include rollback strategy in comments

4. **Performance**:
   - Add indexes for frequently queried columns
   - Use appropriate foreign key constraints
   - Consider query patterns when designing schema

### Modifying Existing Migrations

**Never modify existing migrations** - instead:
1. Create a new migration file
2. Include the changes needed
3. Document the reason for the change

Example:
```sql
-- 0003_add_user_preferences.sql
-- Adds user preferences table (requested in issue #123)

ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
CREATE INDEX idx_users_preferences ON users USING GIN(preferences);
```

## Schema Documentation

### Table Relationships

```
users (1) ──→ (many) listings
users (1) ──→ (many) submissions
users (1) ──→ (many) categories (created_by)

categories (1) ──→ (many) listings
categories (1) ──→ (many) submissions
categories (1) ──→ (many) categories (parent_id - self-referential)

countries (1) ──→ (many) regions
countries (1) ──→ (many) cities
countries (1) ──→ (many) listings
countries (1) ──→ (many) submissions

regions (1) ──→ (many) cities
regions (1) ──→ (many) listings
regions (1) ──→ (many) submissions

cities (1) ──→ (many) listings
cities (1) ──→ (many) submissions

listings (1) ──→ (many) listing_views
promotional_packages (1) ──→ (many) listings
promotional_packages (1) ──→ (many) submissions
```

### Key Constraints

- **Cascade Delete**: User deletion cascades to listings, submissions, views
- **Restrict Delete**: Category/Country/Region deletion restricted if listings exist
- **Set Null**: Optional foreign keys set to NULL on parent deletion

## Troubleshooting

### Migration Fails

1. Check database connection
2. Verify user permissions
3. Review error message for specific constraint violations
4. Check for existing tables/indexes

### Data Integrity Issues

1. Run `SELECT * FROM information_schema.table_constraints;`
2. Verify foreign key relationships
3. Check for orphaned records
4. Use `ON CONFLICT` clauses to handle duplicates

### Performance Issues

1. Verify indexes are created: `\d table_name`
2. Check query plans: `EXPLAIN ANALYZE SELECT ...`
3. Consider adding additional indexes
4. Monitor slow query logs

## Rollback Strategy

For production issues:

1. **Identify Problem**: Check logs and error messages
2. **Backup**: Always have recent backups
3. **Rollback Options**:
   - Restore from backup
   - Create reverse migration
   - Manual SQL fixes

Example reverse migration:
```sql
-- 0003_rollback_user_preferences.sql
-- Rollback for 0003_add_user_preferences.sql

BEGIN;

DROP INDEX IF EXISTS idx_users_preferences;
ALTER TABLE users DROP COLUMN IF EXISTS preferences;

COMMIT;
```

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Migrations](https://orm.drizzle.team/docs/migrations)
- [Database Design Best Practices](https://en.wikipedia.org/wiki/Database_design)
