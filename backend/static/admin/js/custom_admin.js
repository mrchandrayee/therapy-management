// Custom Admin JavaScript for Therapy Management Platform

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize custom functionality
    initializeCustomFeatures();
    
    // Add fade-in animation to content
    addFadeInAnimation();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Add confirmation dialogs for dangerous actions
    addConfirmationDialogs();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
    
});

function initializeCustomFeatures() {
    // Add custom classes to elements
    document.querySelectorAll('.badge').forEach(function(badge) {
        badge.classList.add('fade-in');
    });
    
    // Enhance table rows with hover effects
    document.querySelectorAll('table tbody tr').forEach(function(row) {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(44, 90, 160, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

function addFadeInAnimation() {
    // Add fade-in animation to main content
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.classList.add('fade-in');
    }
    
    // Add slide-in animation to sidebar
    const sidebar = document.querySelector('.main-sidebar');
    if (sidebar) {
        sidebar.classList.add('slide-in');
    }
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add custom tooltips for status badges
    document.querySelectorAll('.badge').forEach(function(badge) {
        const text = badge.textContent.trim();
        let tooltipText = '';
        
        switch(text.toLowerCase()) {
            case 'approved':
                tooltipText = 'This therapist has been approved and can accept clients';
                break;
            case 'pending':
                tooltipText = 'Waiting for admin approval';
                break;
            case 'completed':
                tooltipText = 'Session has been completed successfully';
                break;
            case 'scheduled':
                tooltipText = 'Session is scheduled and confirmed';
                break;
            case 'in progress':
                tooltipText = 'Session is currently in progress';
                break;
        }
        
        if (tooltipText) {
            badge.setAttribute('title', tooltipText);
        }
    });
}

function addConfirmationDialogs() {
    // Add confirmation for delete actions
    document.querySelectorAll('a[href*="delete"], input[name*="delete"]').forEach(function(element) {
        element.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                e.preventDefault();
                return false;
            }
        });
    });
    
    // Add confirmation for bulk actions
    document.querySelectorAll('select[name="action"]').forEach(function(select) {
        select.addEventListener('change', function() {
            const selectedAction = this.value;
            const dangerousActions = ['delete_selected', 'suspend_therapists', 'cancel_sessions'];
            
            if (dangerousActions.includes(selectedAction)) {
                const actionButton = document.querySelector('button[name="index"]');
                if (actionButton) {
                    actionButton.addEventListener('click', function(e) {
                        if (!confirm(`Are you sure you want to perform "${selectedAction}" on the selected items?`)) {
                            e.preventDefault();
                            return false;
                        }
                    });
                }
            }
        });
    });
}

function initializeRealTimeUpdates() {
    // Update timestamps to show relative time
    updateRelativeTimestamps();
    
    // Update every minute
    setInterval(updateRelativeTimestamps, 60000);
    
    // Add live status indicators
    addLiveStatusIndicators();
}

function updateRelativeTimestamps() {
    document.querySelectorAll('[data-timestamp]').forEach(function(element) {
        const timestamp = element.getAttribute('data-timestamp');
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        let relativeTime = '';
        
        if (diff < 60000) { // Less than 1 minute
            relativeTime = 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            relativeTime = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            relativeTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diff / 86400000);
            relativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
        }
        
        element.textContent = relativeTime;
        element.setAttribute('title', date.toLocaleString());
    });
}

function addLiveStatusIndicators() {
    // Add pulsing animation to "in progress" sessions
    document.querySelectorAll('.badge').forEach(function(badge) {
        if (badge.textContent.trim().toLowerCase() === 'in progress') {
            badge.style.animation = 'pulse 2s infinite';
        }
    });
    
    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for use in other scripts
window.TherapyAdmin = {
    showNotification: showNotification,
    formatCurrency: formatCurrency,
    formatDateTime: formatDateTime
};

// Add custom styles for enhanced UI
const customStyles = `
    .pulse {
        animation: pulse 2s infinite;
    }
    
    .hover-shadow:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .status-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
    }
    
    .status-online {
        background-color: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
    }
    
    .status-offline {
        background-color: #6c757d;
    }
    
    .status-busy {
        background-color: #ffc107;
        box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
    }
`;

// Inject custom styles
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);