# EmailJS Setup Guide - Step by Step

This guide will help you set up EmailJS to receive contact form submissions at support@dimenxioner.com.

## 🚀 Quick Start (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Click "Connect Account"
5. Sign in with your Gmail account (support@dimenxioner.com)
6. Allow EmailJS access
7. **Copy your Service ID** (looks like: `service_abc123`)

### Step 3: Create Email Template
1. Click "Email Templates" in the dashboard
2. Click "Create New Template"
3. Set template name: "Contact Form Template"
4. Use this template content:

**Subject:**
```
New Contact Form Submission from {{from_name}}
```

**Email Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #007bff; }
        .message { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h2>📧 New Contact Form Submission</h2>
        <p>You have received a new message from your website contact form.</p>
    </div>
    
    <div class="content">
        <div class="field">
            <span class="label">Name:</span> {{from_name}}
        </div>
        
        <div class="field">
            <span class="label">Email:</span> {{from_email}}
        </div>
        
        <div class="field">
            <span class="label">Subject:</span> {{subject}}
        </div>
        
        <div class="field">
            <span class="label">Message:</span>
            <div class="message">{{message}}</div>
        </div>
        
        <hr style="margin: 30px 0;">
        <p><em>This message was sent from your website contact form. Reply directly to this email to respond to {{from_name}}.</em></p>
    </div>
</body>
</html>
```

5. Click "Save"
6. **Copy your Template ID** (looks like: `template_xyz789`)

### Step 4: Get Your Public Key
1. Click "Account" in the dashboard
2. Click "API Keys"
3. **Copy your Public Key** (looks like: `user_def456`)

### Step 5: Update Your Configuration
1. Open `src/config/email.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
export const emailConfig = {
  publicKey: "EZ-hfzXAyIXKU1iis", // Your actual public key
  serviceId: "service_w35p2rp", // Your actual service ID
  templateId: "template_1l2wq1x", // Your actual template ID
  toEmail: "dimenxioner@gmail.com"
};
```

### Step 6: Test the Form
1. Your development server should be running at http://localhost:8081/
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email at support@dimenxioner.com

## 🔧 Troubleshooting

### Form not sending emails?
- ✅ Check that all credentials are correct in `src/config/email.ts`
- ✅ Make sure your Gmail account is properly connected
- ✅ Check the browser console for error messages

### Email not received?
- ✅ Check your spam folder
- ✅ Check EmailJS dashboard for delivery status
- ✅ Verify your Gmail account settings

### Template variables not working?
- ✅ Make sure variable names match: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`

## 📧 EmailJS Free Tier Limits

- **200 emails per month**
- **Basic templates**
- **Standard support**

For higher volumes, consider upgrading to a paid plan.

## 🔒 Security Notes

- The public key is safe to expose in client-side code
- EmailJS handles email sending securely
- Consider adding rate limiting to prevent spam

## 🎯 Next Steps

1. **Test thoroughly** - Send a few test emails
2. **Monitor usage** - Check EmailJS dashboard for delivery rates
3. **Customize template** - Modify the email template to match your brand
4. **Add spam protection** - Consider adding CAPTCHA or rate limiting

## 📞 Support

If you need help:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Check the EmailJS dashboard for delivery status

---

**Your contact form is now ready to receive emails at support@dimenxioner.com! 🎉** 