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

// Flag to track Supabase initialization status
let supabaseInitialized = false;

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
        supabaseInitialized = true;
        // Dispatch event for other scripts to know Supabase is ready
        document.dispatchEvent(new CustomEvent('supabaseInitialized'));
    } else {
        console.error('Failed to initialize Supabase client');
    }
}

/**
 * Wait for Supabase to be initialized
 * @param {Function} callback - Function to execute when Supabase is ready
 * @returns {Promise} - Promise that resolves when Supabase is initialized
 */
function waitForSupabase(callback) {
    return new Promise((resolve) => {
        if (supabaseInitialized && supabase) {
            // If already initialized, execute callback immediately
            if (callback && typeof callback === 'function') {
                callback(supabase);
            }
            resolve(supabase);
        } else {
            // Otherwise wait for initialization event
            document.addEventListener('supabaseInitialized', () => {
                if (callback && typeof callback === 'function') {
                    callback(supabase);
                }
                resolve(supabase);
            }, { once: true });
        }
    });
}

/**
 * Database schema initialization
 * Run this function once to create necessary tables in Supabase
 * @returns {Promise<Object>} - Promise resolving to result of operation
 */
async function initDatabase() {
    try {
        // Wait for Supabase to be initialized
        await waitForSupabase();
        
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        // This function would typically be run once by an admin
        // or during initial setup, not in production code
        
        // In a real application with admin access, you would execute SQL directly:
        // const { data, error } = await supabase.rpc('execute_sql', {
        //     sql_query: `
        //         CREATE TABLE IF NOT EXISTS profiles (
        //             id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
        //             full_name TEXT NOT NULL,
        //             email TEXT NOT NULL UNIQUE,
        //             phone TEXT,
        //             membership_type TEXT NOT NULL,
        //             membership_id TEXT NOT NULL UNIQUE,
        //             status TEXT DEFAULT 'Pending Approval',
        //             created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        //             updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        //         );
        //     `
        // });
        
        // For checking if the table exists:
        const { data, error } = await supabase
            .from('profiles')
            .select('count()')
            .limit(1);
            
        if (error) {
            console.error('Database check failed:', error);
            return { success: false, error };
        }
        
        return { success: true, message: 'Database schema verified' };
    } catch (error) {
        console.error('Error initializing database:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check the database connection and configuration
 * @returns {Promise<Object>} - Promise resolving to connection status
 */
async function checkDatabaseConnection() {
    try {
        await waitForSupabase();
        
        // Test a simple query to verify connection
        const { data, error } = await supabase
            .from('profiles')
            .select('count(*)')
            .limit(1);
            
        if (error) {
            throw error;
        }
        
        return { 
            success: true, 
            message: 'Database connection successful',
            url: getSupabaseCredentials().SUPABASE_URL
        };
    } catch (error) {
        return { 
            success: false, 
            error: error.message,
            details: 'Database connection failed. Check your Supabase credentials.'
        };
    }
}
