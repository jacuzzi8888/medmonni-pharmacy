# Supabase Migration Guide
## Medomni Pharmacy - Database Migration

This guide walks you through migrating the Medomni Pharmacy database to a new Supabase project.

---

## Prerequisites

- [ ] Access to the **source** Supabase project (your current one)
- [ ] Access to the **destination** Supabase project (client's)
- [ ] The `client_migration.sql` file from this project

---

## Step 1: Create the Database Schema

1. Log into the **client's Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Open `client_migration.sql` from this project
5. Copy the entire contents and paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success - you should see a table listing all created tables

> **Note**: This script is idempotent - safe to run multiple times.

---

## Step 2: Configure Authentication

### 2.1 URL Configuration
1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://medomnipharmacy.com` (client's domain)
3. Under **Redirect URLs**, add:
   - `https://medomnipharmacy.com/*`
   - `http://localhost:5173/*` (for development)

### 2.2 Email Templates (Optional)
1. Go to **Authentication → Email Templates**
2. Customize the following templates:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**

---

## Step 3: Create Storage Buckets

1. Go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Create these buckets:

| Bucket Name | Public? | Purpose |
|------------|---------|---------|
| `product-images` | Yes | Product images |
| `category-images` | Yes | Category icons/images |
| `carousel-images` | Yes | Homepage carousel images |

4. For each bucket, set the policy:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read" ON storage.objects
     FOR SELECT USING (bucket_id = 'BUCKET_NAME');
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated upload" ON storage.objects
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   ```

---

## Step 4: Update Environment Variables

Update the `.env` file in the project:

```env
# OLD VALUES (your development)
# VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
# VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# NEW VALUES (client's production)
VITE_SUPABASE_URL=https://CLIENT_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=CLIENT_ANON_KEY
```

**Where to find these:**
1. Go to client's Supabase Dashboard
2. Navigate to **Settings → API**
3. Copy **Project URL** → `VITE_SUPABASE_URL`
4. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Step 5: Create Admin User

1. Have the client sign up on the website normally
2. Go to **SQL Editor** in Supabase
3. Run this query (replace with their actual email):

```sql
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'admin@clientdomain.com';
```

4. Verify by running:
```sql
SELECT * FROM user_profiles WHERE role = 'super_admin';
```

---

## Step 6: Migrate Existing Data (Optional)

If you need to transfer existing data:

### Option A: Small Dataset (Manual)
1. Go to **Table Editor** in source Supabase
2. Export each table as CSV
3. Import CSV into destination Supabase

### Option B: Large Dataset (pg_dump)
```bash
# Export from source
pg_dump -h SOURCE_DB_HOST -U postgres -d postgres --data-only > data_backup.sql

# Import to destination
psql -h DEST_DB_HOST -U postgres -d postgres < data_backup.sql
```

### Tables to Migrate:
- [ ] `products` - Product catalog
- [ ] `health_articles` - Blog content
- [ ] `newsletter_subscribers` - Email list

> **Note**: User data (`profiles`, `addresses`, etc.) should NOT be migrated - users will create fresh accounts.

---

## Step 7: Deploy the Application

### For Vercel:
1. Go to Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Update:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the application

### For Manual Hosting:
1. Update `.env.production` with new values
2. Run `npm run build`
3. Deploy the `dist` folder

---

## Step 8: Verify Migration

Run through this checklist:

- [ ] **Homepage loads** correctly
- [ ] **Sign up** works - creates user in new Supabase
- [ ] **Sign in** works
- [ ] **Products** display (if migrated)
- [ ] **Categories** display (if migrated)
- [ ] **Carousel slides** display (if migrated)
- [ ] **Articles** display (if migrated)
- [ ] **Newsletter** subscription works
- [ ] **Appointment booking** works
- [ ] **Profile page** works for logged-in users
- [ ] **Admin dashboard** works for admin user
- [ ] **Navigation links** display correctly

---

## Troubleshooting

### "Permission denied" errors
- Check RLS policies are created
- Verify the user has correct role in `user_profiles`

### "Table does not exist" errors
- Re-run `client_migration.sql`
- Check for SQL errors in the output

### Auth not working
- Verify redirect URLs include the correct domain
- Check environment variables are updated

### Images not loading
- Verify storage buckets are created
- Check bucket policies allow public read

---

## Support Contacts

- **Developer**: [Your Name] - [your@email.com]
- **Supabase Docs**: https://supabase.com/docs

---

*Last Updated: December 2024*
