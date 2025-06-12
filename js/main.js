/**
 * Main JavaScript file for Batts Management System
 */

// DOM Elements for Navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// Toggle mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (nav && nav.classList.contains('active') && 
        !event.target.closest('.nav') && 
        !event.target.closest('.menu-toggle')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Utility functions
const utils = {
    /**
     * Show an alert message
     * @param {string} type - 'success', 'error', or 'info'
     * @param {string} message - The message to display
     * @param {string} elementId - The ID of the element to show
     */
    showAlert: function(type, message, elementId) {
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.textContent = message;
            alertElement.style.display = 'block';
            
            // Hide the alert after 5 seconds
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 5000);
        }
    },
    
    /**
     * Generate a unique membership ID
     * @param {string} membershipType - 'Junior' or 'Senior'
     * @returns {string} - A unique membership ID
     */
    generateMembershipId: function(membershipType) {
        const prefix = membershipType === 'Junior' ? 'JR' : 'SR';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    },
    
    /**
     * Redirect to a new page
     * @param {string} url - The URL to redirect to
     * @param {number} delay - Delay in milliseconds before redirecting
     */
    redirect: function(url, delay = 0) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    },
    
    /**
     * Check if user is logged in
     * @returns {boolean} - True if user is logged in, false otherwise
     */
    isLoggedIn: function() {
        return localStorage.getItem('battsUser') !== null;
    },
    
    /**
     * Protect routes that require authentication
     * @param {Array} publicRoutes - Array of routes that don't require authentication
     */
    protectRoute: function(publicRoutes = ['/index.html', '/login.html', '/register.html', '/']) {
        const currentPath = window.location.pathname;
        const isPublicRoute = publicRoutes.some(route => 
            currentPath.endsWith(route) || 
            (route === '/' && currentPath.endsWith('/index.html'))
        );
        
        if (!isPublicRoute && !this.isLoggedIn()) {
            this.redirect('login.html');
        } else if (currentPath.endsWith('/dashboard.html') && !this.isLoggedIn()) {
            this.redirect('login.html');
        } else if ((currentPath.endsWith('/login.html') || currentPath.endsWith('/register.html')) && this.isLoggedIn()) {
            this.redirect('dashboard.html');
        }
    }
};

// Initialize route protection
document.addEventListener('DOMContentLoaded', () => {
    utils.protectRoute();
});
