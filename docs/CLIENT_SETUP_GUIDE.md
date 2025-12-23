# Medomni Pharmacy - Client Setup Guide

This guide contains instructions for setting up custom email and Google login for your Medomni Pharmacy website.

---

## Part 1: Custom Email Domain Setup

To make confirmation emails come from `noreply@medomnipharmacy.com` instead of Supabase:

### Option A: Use a Custom SMTP Provider (Recommended)

You'll need an email service. Options include:
- **Gmail/Google Workspace** (if you have a business email)
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)

**Provide to your developer:**
- SMTP Host (e.g., `smtp.gmail.com`)
- SMTP Port (usually `587`)
- SMTP Username (your email)
- SMTP Password or App Password
- Sender Email Address (e.g., `noreply@medomnipharmacy.com`)

### Option B: Add DNS Records for Supabase Email

Add these records to your domain's DNS settings:

| Type | Name | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:amazonses.com ~all` |
| CNAME | supabase._domainkey | *(Provided by Supabase)* |

---

## Part 2: Google Login Setup

Follow these steps in order:

### Step 1: Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Project name: `Medomni Pharmacy`
5. Click **Create**

### Step 2: Enable Required APIs

1. Go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click on it and press **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **"External"** → Click **Create**
3. Fill in:
   - App name: `Medomni Pharmacy`
   - User support email: *Your email*
   - App logo: *Upload pharmacy logo (optional)*
   - App domain: `https://medomnipharmacy.com`
   - Authorized domains: `medomnipharmacy.com`
   - Developer contact email: *Your email*
4. Click **Save and Continue**
5. On Scopes page, click **Add or Remove Scopes**
   - Select: `email` and `profile`
   - Click **Update** → **Save and Continue**
6. On Test users page, click **Save and Continue**
7. Review and click **Back to Dashboard**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Medomni Pharmacy Web`
5. **Authorized JavaScript origins** - Add these URLs:
   ```
   https://medomnipharmacy.com
   https://www.medomnipharmacy.com
   ```
6. **Authorized redirect URIs** - Add this URL:
   ```
   https://jxndmsorpriyvvxyetut.supabase.co/auth/v1/callback
   ```
7. Click **Create**

### Step 5: Copy Your Credentials

After creating, you'll see a popup with:
- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

**Send both of these to your developer securely.**

---

## Part 3: Domain DNS Records Summary

Add these records at your domain registrar (Namecheap, GoDaddy, etc.):

### For Website (Vercel):
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `316a2990b784e3a4.vercel-dns-017.com` |

### For Email (if using Supabase email):
| Type | Name | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:amazonses.com ~all` |

---

## Questions?

Contact your developer if you have any questions about these steps.
