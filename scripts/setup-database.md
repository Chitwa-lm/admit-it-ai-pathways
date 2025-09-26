# Database Setup Instructions

## Prerequisites

1. **Supabase Project**: Make sure you have a Supabase project created
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in your Supabase credentials

## Step 1: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 2: Run Database Migrations

You have two options to run the migrations:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-id
```

4. Push migrations:
```bash
supabase db push
```

### Option B: Manual SQL Execution

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_indexes.sql`
   - `supabase/migrations/003_rls_policies.sql`
   - `supabase/migrations/004_functions_triggers.sql`
   - `supabase/migrations/005_seed_data.sql`

## Step 3: Create Storage Buckets

In your Supabase Dashboard, go to Storage and create these buckets:

1. **documents** - For application documents
   - Public: No
   - File size limit: 5MB
   - Allowed MIME types: PDF, DOC, DOCX, images

2. **profile-photos** - For user profile photos
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: Images only

## Step 4: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:8080/test-database`

3. Click "Run Database Tests" to verify everything is working

## Expected Test Results

All tests should pass:
- ✅ Database Connection
- ✅ Table: user_profiles
- ✅ Table: schools
- ✅ Table: available_places
- ✅ Table: applications
- ✅ Table: application_documents
- ✅ Table: application_status_history
- ✅ Table: notifications
- ✅ Table: school_administrators
- ✅ Table: audit_logs
- ✅ Enum Values
- ✅ Seed Data - Schools
- ✅ Seed Data - Available Places
- ✅ RLS Policies
- ✅ Database Functions
- ✅ Query Performance (Indexes)
- ✅ Table Relationships

## Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Ensure your Supabase project is active

2. **Table Not Found**
   - Make sure all migrations have been run in order
   - Check the SQL Editor for any error messages

3. **RLS Policy Errors**
   - This is expected if you're not authenticated
   - The test will show "RLS Active" which is correct

4. **Seed Data Missing**
   - Make sure migration 005_seed_data.sql was executed
   - Check if there are any constraint violations

5. **Function Errors**
   - Ensure migration 004_functions_triggers.sql was executed
   - Check for any syntax errors in the functions

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Review the Supabase Dashboard logs
3. Ensure all migrations were applied successfully
4. Verify your environment variables are correct

## Next Steps

Once all tests pass:
1. You can proceed with Task 2: Authentication System
2. Start building the frontend components
3. Begin implementing the application workflow