# Batts Management System (DMS)

A membership and user management system for Batts using Supabase for authentication and database management.

## Security Configuration

This project uses a secure configuration approach for Supabase credentials:

1. The main configuration file (`js/supabase-config.js`) contains no sensitive data
2. A template file (`js/supabase-config.template.js`) provides instructions for developers
3. A local configuration file (`js/supabase-config.local.js`) stores actual credentials (gitignored)

## Setup Instructions

### 1. Set up Supabase credentials

Create a file named `supabase-config.local.js` in the `js` directory with the following content:

```javascript
// Supabase credentials - KEEP THIS FILE PRIVATE
const SUPABASE_CONFIG = {
    SUPABASE_URL: 'https://your-actual-supabase-url.supabase.co',
    SUPABASE_KEY: 'your-actual-supabase-anon-key'
};
```

Replace the placeholder values with your actual Supabase URL and anon key.

### 2. Security Notes

- The `supabase-config.local.js` file is excluded from Git via `.gitignore`
- Never commit sensitive credentials to the repository
- For production deployment, set environment variables or use a secure secrets management solution

## GitHub Repository

This project is hosted on GitHub at: https://github.com/sonex-pro/batts-dms

## Development

1. Clone the repository
2. Create the `supabase-config.local.js` file as described above
3. Open any HTML file in a browser to test the application
