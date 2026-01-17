// ===================================
// MOCK USER DATABASE
// ===================================
const userData = {
    name: "Alex Chen",
    progress: 68,
    streak: 12,
    totalHours: 47,
    coursesCompleted: 8,
    recentActivity: [
        {
            icon: "🧠",
            title: "Completed AI Tutor Session",
            time: "2 hours ago"
        },
        {
            icon: "📚",
            title: "Reviewed 25 Flashcards",
            time: "5 hours ago"
        },
        {
            icon: "🎮",
            title: "Played Math Challenge Game",
            time: "Yesterday"
        },
        {
            icon: "✨",
            title: "Generated Smart Summary",
            time: "2 days ago"
        },
        {
            icon: "🏆",
            title: "Achieved 10-day Streak",
            time: "3 days ago"
        }
    ]
};

// ===================================
// THEME MANAGEMENT
// ===================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Add smooth transition effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// ===================================
// USER AVATAR DROPDOWN
// ===================================
const userAvatar = document.getElementById('userAvatar');
const avatarDropdown = document.getElementById('avatarDropdown');

userAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    userAvatar.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    userAvatar.classList.remove('active');
});

avatarDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// ===================================
// DATA BINDING
// ===================================

// Load user name
document.getElementById('userName').textContent = userData.name;

// Load progress ring
const progressCircle = document.getElementById('progressCircle');
const progressPercentage = document.getElementById('progressPercentage');
const circumference = 2 * Math.PI * 70; // radius = 70
const offset = circumference - (userData.progress / 100) * circumference;

// Add SVG gradient for progress ring
const svg = progressCircle.closest('svg');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
gradient.setAttribute('id', 'progressGradient');
gradient.setAttribute('x1', '0%');
gradient.setAttribute('y1', '0%');
gradient.setAttribute('x2', '100%');
gradient.setAttribute('y2', '100%');

const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop1.setAttribute('offset', '0%');
stop1.setAttribute('style', 'stop-color:#00d4ff;stop-opacity:1');

const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop2.setAttribute('offset', '100%');
stop2.setAttribute('style', 'stop-color:#8b5cf6;stop-opacity:1');

gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);
svg.insertBefore(defs, svg.firstChild);

// Animate progress ring
setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
}, 100);

progressPercentage.textContent = `${userData.progress}%`;

// Load streak
document.getElementById('streakNumber').textContent = userData.streak;

// Load recent activity
const activityTimeline = document.getElementById('activityTimeline');
userData.recentActivity.forEach((activity, index) => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.animationDelay = `${index * 0.1}s`;
    
    activityItem.innerHTML = `
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;
    
    activityTimeline.appendChild(activityItem);
});

// ===================================
// FEATURE CARD INTERACTIONS
// ===================================
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('click', () => {
        const feature = card.getAttribute('data-feature');
        handleFeatureClick(feature);
    });
    
    // Add ripple effect on click
    card.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 212, 255, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        const rect = card.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// FLOATING ACTION BUTTONS
// ===================================
const fabs = document.querySelectorAll('.fab');

fabs.forEach(fab => {
    fab.addEventListener('click', () => {
        const feature = fab.getAttribute('data-feature');
        handleFeatureClick(feature);
    });
});

// ===================================
// CTA BUTTON
// ===================================
const ctaButton = document.getElementById('ctaButton');

ctaButton.addEventListener('click', () => {
    // Simulate starting learning
    ctaButton.innerHTML = '<span class="cta-text">Loading...</span>';
    
    setTimeout(() => {
        ctaButton.innerHTML = '<span class="cta-text">Start Learning</span><span class="cta-icon">→</span>';
        showNotification('🚀 Let\'s begin your learning journey!');
    }, 1000);
});

// ===================================
// BOTTOM NAVIGATION (MOBILE)
// ===================================
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
        bottomNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===================================
// FEATURE CLICK HANDLER
// ===================================
function handleFeatureClick(feature) {
    const featureNames = {
        'ai-tutor': 'AI Tutor',
        'flashcards': 'Flashcards',
        'games': 'Learning Games',
        'summary': 'Smart Summary',
        'avatar': 'Avatar Tutor'
    };
    
    const featureName = featureNames[feature] || feature;
    showNotification(`🎯 Opening ${featureName}...`);
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 212, 255, 0.4)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s',
        fontWeight: '600'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.feature-card, .widget').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    // Add any resize-specific logic here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ===================================
// INITIALIZATION
// ===================================
console.log('🤖 EduBot AI Dashboard initialized');
console.log('User:', userData.name);
console.log('Progress:', userData.progress + '%');
console.log('Streak:', userData.streak, 'days');
