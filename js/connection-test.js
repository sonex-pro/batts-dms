/**
 * Supabase Connection Test Utility
 * This file provides utilities to test the Supabase connection
 * and display the status on the page.
 */

// Connection Test Controller
const connectionTestController = {
    /**
     * Initialize connection test
     * @param {string} containerId - ID of the container element to display results
     */
    init: async function(containerId = 'connection-status') {
        // Create container if it doesn't exist
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'connection-status';
            document.body.appendChild(container);
        }
        
        // Show testing message
        container.innerHTML = `
            <div class="alert alert-info">
                <p><i class="fas fa-spinner fa-spin"></i> Testing Supabase connection...</p>
            </div>
        `;
        
        // Test connection
        const result = await this.testConnection();
        
        // Display result
        if (result.success) {
            container.innerHTML = `
                <div class="alert alert-success">
                    <p><i class="fas fa-check-circle"></i> ${result.message}</p>
                    <p>Connected to: ${result.url}</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <p><i class="fas fa-exclamation-triangle"></i> ${result.details}</p>
                    <p>Error: ${result.error}</p>
                </div>
            `;
        }
    },
    
    /**
     * Test Supabase connection
     * @returns {Promise<Object>} - Promise resolving to connection status
     */
    testConnection: async function() {
        try {
            // Check if checkDatabaseConnection function exists
            if (typeof checkDatabaseConnection === 'function') {
                return await checkDatabaseConnection();
            } else {
                // Fallback to basic connection test
                await waitForSupabase();
                
                // Test a simple query
                const { data, error } = await supabase
                    .from('profiles')
                    .select('count(*)')
                    .limit(1);
                    
                if (error) throw error;
                
                return { 
                    success: true, 
                    message: 'Database connection successful',
                    url: supabase.supabaseUrl
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message,
                details: 'Database connection failed. Check your credentials and network.'
            };
        }
    }
};

// Add connection test widget to admin pages
document.addEventListener('DOMContentLoaded', () => {
    // Only add test widget to admin pages
    const isAdminPage = window.location.pathname.includes('admin') || 
                        window.location.pathname.includes('dashboard');
    
    if (isAdminPage) {
        // Create connection test button
        const testButton = document.createElement('button');
        testButton.id = 'test-connection-btn';
        testButton.className = 'btn btn-secondary btn-sm';
        testButton.innerHTML = '<i class="fas fa-database"></i> Test Database Connection';
        testButton.style.position = 'fixed';
        testButton.style.bottom = '20px';
        testButton.style.right = '20px';
        testButton.style.zIndex = '1000';
        
        // Add button to page
        document.body.appendChild(testButton);
        
        // Add event listener
        testButton.addEventListener('click', () => {
            connectionTestController.init();
        });
    }
});
