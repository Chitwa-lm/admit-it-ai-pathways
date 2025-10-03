# 🚀 Supabase Database Setup Guide

## Quick Fix for Current Errors

The current database connection errors are due to placeholder API keys. Here's how to fix them:

### Step 1: Get Real Supabase Credentials

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project** or use an existing one
3. **Go to Settings > API** in your project dashboard
4. **Copy these values:**
   - Project URL (looks like: `https://your-project-id.supabase.co`)
   - anon/public key (long JWT token)

### Step 2: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Replace these with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

## Setting Up the Database Schema

Once connected, you'll need to run the database migrations:

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### Option 2: Manual Setup via Dashboard

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run each migration file in order:**
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_indexes.sql`
   - `supabase/migrations/003_rls_policies.sql`
   - `supabase/migrations/004_functions_triggers.sql`
   - `supabase/migrations/005_seed_data.sql`

## Testing the Connection

After setup, the app will show:
- ✅ **Green notification**: Database connected successfully
- ❌ **Red notification**: Still having connection issues

## Voice Features Work Without Database

**Good news!** The voice chatbot and speech features work completely independently of the database. You can test voice mode even with database connection issues:

1. **Visit `/voice-demo`** in your browser
2. **Click the floating chat button** 
3. **Use the microphone buttons** in forms
4. **Test voice commands** like "What documents do I need?"

## Need Help?

If you're still having issues:

1. **Check browser console** for specific error messages
2. **Verify your Supabase project is active** (not paused)
3. **Make sure your .env file has no extra spaces** around the values
4. **Try creating a fresh Supabase project** if the current one has issues

The voice features are ready to use immediately - the database is only needed for saving application data!