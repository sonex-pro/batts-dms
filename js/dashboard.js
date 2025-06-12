/**
 * Dashboard JavaScript file for Batts Management System
 * Handles displaying user information on the dashboard
 */

// Dashboard Controller
const dashboardController = {
    /**
     * Initialize the dashboard
     */
    init: function() {
        // Check if user is logged in
        const user = authController.getCurrentUser();
        if (!user) {
            utils.redirect('login.html');
            return;
        }
        
        // Display user information
        this.displayUserInfo(user);
    },
    
    /**
     * Display user information on the dashboard
     * @param {Object} user - User object
     */
    displayUserInfo: function(user) {
        // Set user name in welcome message
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.full_name || 'Member';
        }
        
        // Set membership ID
        const membershipIdElement = document.getElementById('membership-id');
        if (membershipIdElement) {
            membershipIdElement.textContent = user.membership_id || 'Not assigned';
        }
        
        // Set user details
        const detailElements = {
            name: document.getElementById('detail-name'),
            email: document.getElementById('detail-email'),
            phone: document.getElementById('detail-phone'),
            type: document.getElementById('detail-type'),
            status: document.getElementById('detail-status')
        };
        
        if (detailElements.name) detailElements.name.textContent = user.full_name || 'Not provided';
        if (detailElements.email) detailElements.email.textContent = user.email || 'Not provided';
        if (detailElements.phone) detailElements.phone.textContent = user.phone || 'Not provided';
        if (detailElements.type) detailElements.type.textContent = user.membership_type || 'Not specified';
        if (detailElements.status) detailElements.status.textContent = user.status || 'Pending';
        
        // Apply status styling
        if (detailElements.status) {
            if (user.status === 'Approved') {
                detailElements.status.classList.add('status-approved');
            } else if (user.status === 'Pending Approval') {
                detailElements.status.classList.add('status-pending');
            }
        }
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dashboardController.init();
});
