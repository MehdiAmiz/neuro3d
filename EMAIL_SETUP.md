# Email Setup Guide

This guide will help you set up EmailJS to receive contact form submissions at support@dimenxioner.com.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., "service_abc123")

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

```html
Subject: New Contact Form Submission from {{from_name}}

Hello,

You have received a new message from your website contact form:

**Name:** {{from_name}}
**Email:** {{from_email}}
**Subject:** {{subject}}

**Message:**
{{message}}

---
This message was sent from your website contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. Save the template and note down your **Template ID** (e.g., "template_xyz789")

## Step 4: Get Your Public Key

1. Go to "Account" → "API Keys" in your dashboard
2. Copy your **Public Key** (e.g., "user_def456")

## Step 5: Update Configuration

1. Open `src/config/email.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
export const emailConfig = {
  publicKey: "user_def456", // Your actual public key
  serviceId: "service_abc123", // Your actual service ID
  templateId: "template_xyz789", // Your actual template ID
  toEmail: "support@dimenxioner.com"
};
```

## Step 6: Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email at support@dimenxioner.com

## Troubleshooting

- **Form not sending**: Check that all credentials are correct in `src/config/email.ts`
- **Email not received**: Check your spam folder and EmailJS dashboard for delivery status
- **Template variables not working**: Make sure the variable names in your template match those in the code

## Security Notes

- The public key is safe to expose in client-side code
- EmailJS handles the email sending securely
- Consider rate limiting on the form to prevent spam

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic templates
- Standard support

For higher volumes, consider upgrading to a paid plan. 