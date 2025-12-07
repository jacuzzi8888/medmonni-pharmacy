# 🚀 Medomni Pharmacy Website - Client Handoff Guide

This guide explains how to take ownership of the project's backend (Supabase) and configure it for production.

---

## 1️⃣ Create Your Own Supabase Project

The website uses **Supabase** for user authentication and database features. You need to create your own account to have full control.

1.  Go to [supabase.com](https://supabase.com) and sign up.
2.  Click **"New Project"**.
3.  **Name:** Medomni Pharmacy
4.  **Database Password:** Create a strong password and **save it** (you cannot see it again).
5.  Select a **Region** close to your users (e.g., *Europe (Frankfurt)* or *London* if Africa is not available).
6.  Click **"Create new project"**.

---

## 2️⃣ Get Your API Keys

Once your project is ready (takes ~2 minutes):

1.  Go to **Project Settings** (gear icon) → **API**.
2.  Copy the **Project URL**.
3.  Copy the **anon / public** key.

You will need these for the website configuration.

---

## 3️⃣ Set Up Database Tables

You need to create the database structure for user profiles.

1.  Go to **SQL Editor** (sidebar icon).
2.  Click **New Query**.
3.  Copy and paste the code below:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    is_subscribed_newsletter BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view/edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant access
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
```

4.  Click **Run**.

---

## 4️⃣ Configure Email (SMTP)

To make emails come from `info@medomnipharmacy.com` instead of `noreply@supabase.co`:

1.  Go to **Project Settings** → **Authentication**.
2.  Scroll down to **SMTP Settings**.
3.  Toggle **Enable Custom SMTP**.
4.  Enter your email provider details (ask your IT team or email host for these):
    *   **Sender Email:** `info@medomnipharmacy.com`
    *   **Sender Name:** Medomni Pharmacy
    *   **Host:** (e.g., `smtp.gmail.com` or `smtp.office365.com`)
    *   **Port:** (usually `465` or `587`)
    *   **User:** Your email address
    *   **Password:** Your email password (or App Password)
5.  Click **Save**.

---

## 5️⃣ Update Website Configuration

Finally, update the website to use your new project.

1.  Open the file `.env` in the project folder.
2.  Replace the values with your new keys from Step 2:

```env
VITE_SUPABASE_URL=https://your-new-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-key
```

3.  Save the file.
4.  Restart the website server.

---

✅ **That's it! You now have full control over the website's backend.**
