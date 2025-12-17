# Welcome Email Configuration Guide

This guide explains how to set up welcome emails for new user signups in Supabase.

## Option 1: Supabase Auth Email Templates (Recommended)

1. **Go to Supabase Dashboard** → Your Project → **Authentication** → **Email Templates**

2. **Select "Confirm signup"** template and customize it:

```html
<h2>Welcome to Medomni Pharmacy! 🎉</h2>

<p>Dear {{ .Email }},</p>

<p>Thank you for joining the Medomni family! We're thrilled to have you as part of our community.</p>

<h3>Your Benefits:</h3>
<ul>
  <li>✅ Exclusive member discounts</li>
  <li>✅ Priority appointment booking</li>
  <li>✅ Weekly health tips</li>
  <li>✅ New product alerts</li>
</ul>

<p>Please confirm your email by clicking the link below:</p>

<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>

<p>Visit our store at:<br>
<strong>1A Admiralty Road, Lekki Phase 1, Lagos</strong></p>

<p>Questions? Call us: +234 705 235 0000</p>

<p>Stay healthy,<br>
<strong>The Medomni Team</strong></p>
```

3. **Save** the template

## Option 2: Supabase Edge Function (Advanced)

For more complex email logic (like including discount codes), create an Edge Function:

1. Create `supabase/functions/welcome-email/index.ts`
2. Trigger on `auth.users.insert` event
3. Use a service like SendGrid, Mailgun, or Resend

## Testing

1. Create a new account on the website
2. Check your email for the welcome message
3. Verify the confirmation link works
