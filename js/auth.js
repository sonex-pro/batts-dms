/**
 * Authentication JavaScript file for Batts Management System
 * Handles user registration, login, and logout functionality
 * Integrates with Supabase for database operations
 */

// Auth Controller
const authController = {
    /**
     * Register a new user
     * @param {Object} userData - User data including fullName, email, phone, password, membershipType
     * @returns {Promise} - Promise resolving to registration result
     */
    register: async function(userData) {
        try {
            // Wait for Supabase to be initialized
            await waitForSupabase();
            
            // Generate a unique membership ID
            const membershipId = utils.generateMembershipId(userData.membershipType);
            
            // First, create auth user
            const { user, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            });
            
            if (authError) throw authError;
            
            // Then, store additional user data in profiles table
            const { data, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        full_name: userData.fullName,
                        email: userData.email,
                        phone: userData.phone,
                        membership_type: userData.membershipType,
                        membership_id: membershipId,
                        status: 'Pending Approval'
                    }
                ]);
            
            if (profileError) throw profileError;
            
            return { success: true, user: data[0] };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Promise resolving to login result
     */
    login: async function(email, password) {
        try {
            // Wait for Supabase to be initialized
            await waitForSupabase();
            
            // Sign in with email and password
            const { user, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (authError) throw authError;
            
            // Get user profile data
            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (profileError) throw profileError;
            
            // Store user data in localStorage
            localStorage.setItem('battsUser', JSON.stringify(data));
            
            return { success: true, user: data };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Logout the current user
     * @returns {Promise} - Promise resolving to logout result
     */
    logout: async function() {
        try {
            // Wait for Supabase to be initialized
            await waitForSupabase();
            
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            // Remove user data from localStorage
            localStorage.removeItem('battsUser');
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get the current logged-in user
     * @returns {Object|null} - User object or null if not logged in
     */
    getCurrentUser: function() {
        const userStr = localStorage.getItem('battsUser');
        return userStr ? JSON.parse(userStr) : null;
    }
};

/**
 * Update user profile information
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Promise resolving to update result
 */
async function updateUserProfile(userId, profileData) {
    try {
        // Wait for Supabase to be initialized
        await waitForSupabase();
        
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);
            
        if (error) throw error;
        
        // Update local storage with new profile data
        const currentUser = JSON.parse(localStorage.getItem('battsUser') || '{}');
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('battsUser', JSON.stringify(updatedUser));
        
        return { success: true, data };
    } catch (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
    }
}

// DOM Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Registration Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const membershipType = document.querySelector('input[name="membershipType"]:checked')?.value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                utils.showAlert('error', 'Passwords do not match', 'register-error');
                return;
            }
            
            // Validate membership type is selected
            if (!membershipType) {
                utils.showAlert('error', 'Please select a membership type', 'register-error');
                return;
            }
            
            // Register user
            const result = await authController.register({
                fullName,
                email,
                phone,
                password,
                membershipType
            });
            
            if (result.success) {
                utils.showAlert('success', 'Thank you, your membership will be approved shortly.', 'register-success');
                
                // Clear form
                registerForm.reset();
                
                // Redirect to login page after 3 seconds
                utils.redirect('login.html', 3000);
            } else {
                utils.showAlert('error', result.error || 'Registration failed. Please try again.', 'register-error');
            }
        });
    }
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Login user
            const result = await authController.login(email, password);
            
            if (result.success) {
                utils.showAlert('success', 'You are logged in successfully!', 'login-success');
                
                // Clear form
                loginForm.reset();
                
                // Redirect to dashboard after 1.5 seconds
                utils.redirect('dashboard.html', 1500);
            } else {
                utils.showAlert('error', result.error || 'Invalid email or password.', 'login-error');
            }
        });
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const result = await authController.logout();
            
            if (result.success) {
                utils.redirect('index.html');
            }
        });
    }
});
