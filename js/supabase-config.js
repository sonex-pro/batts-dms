/**
 * Supabase Configuration for Batts Management System
 * This file initializes the Supabase client and provides helper functions
 * for interacting with the Supabase database.
 *
 * SECURITY NOTICE:
 * This file is designed to securely load Supabase credentials from multiple sources:
 * 1. From window.SUPABASE_CONFIG if set (for production environments)
 * 2. From an imported local config file (for development, excluded from git)
 * 3. Fallback to placeholder values (which won't work but prevent errors)
 */

// Load Supabase from CDN
document.addEventListener('DOMContentLoaded', () => {
    // Create script element for Supabase JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    
    // After script loads, initialize Supabase
    script.onload = () => {
        console.log('Supabase JS loaded');
        initSupabase();
    };
    
    // Append script to document
    document.head.appendChild(script);
});

// Supabase configuration
let supabase = null;

/**
 * Get Supabase credentials from available sources
 * @returns {Object} Object containing SUPABASE_URL and SUPABASE_KEY
 */
function getSupabaseCredentials() {
    // Priority 1: Check for window.SUPABASE_CONFIG (set by production environment)
    if (window.SUPABASE_CONFIG && 
        window.SUPABASE_CONFIG.SUPABASE_URL && 
        window.SUPABASE_CONFIG.SUPABASE_KEY) {
        console.log('Using Supabase credentials from window.SUPABASE_CONFIG');
        return {
            SUPABASE_URL: window.SUPABASE_CONFIG.SUPABASE_URL,
            SUPABASE_KEY: window.SUPABASE_CONFIG.SUPABASE_KEY
        };
    }
    
    // Priority 2: Try to load from local config file
    try {
        // This will only work if the file exists and is properly formatted
        // The file should be excluded from git via .gitignore
        if (typeof SUPABASE_CONFIG !== 'undefined') {
            console.log('Using Supabase credentials from local config file');
            return SUPABASE_CONFIG;
        }
    } catch (e) {
        console.warn('Local Supabase config not found or invalid');
    }
    
    // Priority 3: Fallback to placeholder values
    console.warn('No valid Supabase credentials found. Using placeholder values.');
    console.warn('Please set up your Supabase credentials properly for the application to work.');
    return {
        SUPABASE_URL: 'https://your-supabase-url.supabase.co',
        SUPABASE_KEY: 'your-supabase-anon-key'
    };
}

/**
 * Initialize Supabase client
 */
function initSupabase() {
    // Get credentials from available sources
    const credentials = getSupabaseCredentials();
    
    // Create Supabase client
    supabase = window.supabase.createClient(credentials.SUPABASE_URL, credentials.SUPABASE_KEY);
    
    // Check if Supabase is initialized
    if (supabase) {
        console.log('Supabase client initialized');
    } else {
        console.error('Failed to initialize Supabase client');
    }
}

/**
 * Database schema initialization
 * Run this function once to create necessary tables in Supabase
 */
async function initDatabase() {
    // This function would typically be run once by an admin
    // or during initial setup, not in production code
    
    // Example SQL to create profiles table
    // You would execute this in the Supabase SQL editor
    /*
    CREATE TABLE profiles (
        id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        membership_type TEXT NOT NULL,
        membership_id TEXT NOT NULL UNIQUE,
        status TEXT DEFAULT 'Pending Approval',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );

    -- Set up Row Level Security (RLS)
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    -- Allow users to view their own profile
    CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

    -- Allow users to update their own profile
    CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);
    */
}
