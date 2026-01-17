// ===================================
// PROFILE PAGE - USER DATA & INTERACTIONS
// ===================================

// Mock user database (extended from main app)
const profileData = {
    name: "Alex Chen",
    email: "alex.chen@edubot.ai",
    role: "student",
    accentColor: "#00d4ff",
    theme: "dark",
    stats: {
        flashcardsCompleted: 247,
        gamesPlayed: 18,
        learningStreak: 12,
        lastSession: "Today"
    }
};

// ===================================
// DOM ELEMENTS
// ===================================
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const accentColor = document.getElementById('accentColor');
const colorPreview = document.getElementById('colorPreview');
const colorLabel = document.getElementById('colorLabel');
const darkThemeBtn = document.getElementById('darkThemeBtn');
const lightThemeBtn = document.getElementById('lightThemeBtn');
const saveButton = document.getElementById('saveButton');
const toast = document.getElementById('toast');

// Display elements
const displayName = document.getElementById('displayName');
const displayRole = document.getElementById('displayRole');
const flashcardsCount = document.getElementById('flashcardsCount');
const gamesCount = document.getElementById('gamesCount');
const streakCount = document.getElementById('streakCount');
const lastSession = document.getElementById('lastSession');

// ===================================
// LOAD USER DATA
// ===================================
function loadProfileData() {
    // Load from localStorage if available, otherwise use mock data
    const savedData = localStorage.getItem('edubot_profile');
    const data = savedData ? JSON.parse(savedData) : profileData;

    // Populate form fields
    userName.value = data.name;
    userEmail.value = data.email;
    userRole.value = data.role;
    accentColor.value = data.accentColor;

    // Update display elements
    displayName.textContent = data.name;
    displayRole.textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1);

    // Update color preview
    updateColorPreview(data.accentColor);

    // Update theme buttons
    updateThemeButtons(data.theme);

    // Load stats
    flashcardsCount.textContent = data.stats.flashcardsCompleted;
    gamesCount.textContent = data.stats.gamesPlayed;
    streakCount.textContent = data.stats.learningStreak;
    lastSession.textContent = data.stats.lastSession;
}

// ===================================
// COLOR PICKER
// ===================================
function updateColorPreview(color) {
    colorPreview.style.background = color;
    colorLabel.textContent = color.toUpperCase();

    // Apply accent color to elements
    document.documentElement.style.setProperty('--accent-cyan', color);
}

accentColor.addEventListener('input', (e) => {
    updateColorPreview(e.target.value);
});

// ===================================
// THEME SELECTOR
// ===================================
function updateThemeButtons(theme) {
    if (theme === 'dark') {
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
        document.body.classList.remove('light-theme');
    } else {
        lightThemeBtn.classList.add('active');
        darkThemeBtn.classList.remove('active');
        document.body.classList.add('light-theme');
    }
}

darkThemeBtn.addEventListener('click', () => {
    updateThemeButtons('dark');
    profileData.theme = 'dark';
});

lightThemeBtn.addEventListener('click', () => {
    updateThemeButtons('light');
    profileData.theme = 'light';
});

// ===================================
// FORM VALIDATION
// ===================================
function validateForm() {
    const name = userName.value.trim();

    if (name.length < 2) {
        showToast('Name must be at least 2 characters', 'error');
        return false;
    }

    return true;
}

// ===================================
// SAVE PROFILE
// ===================================
saveButton.addEventListener('click', () => {
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const updatedData = {
        name: userName.value.trim(),
        email: userEmail.value,
        role: userRole.value,
        accentColor: accentColor.value,
        theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
        stats: profileData.stats
    };

    // Save to localStorage
    localStorage.setItem('edubot_profile', JSON.stringify(updatedData));

    // Update display
    displayName.textContent = updatedData.name;
    displayRole.textContent = updatedData.role.charAt(0).toUpperCase() + updatedData.role.slice(1);

    // Success animation
    saveButton.classList.add('success');
    setTimeout(() => {
        saveButton.classList.remove('success');
    }, 600);

    // Show toast
    showToast('Profile updated successfully!', 'success');

    // Update global user data (if script.js is loaded)
    if (typeof userData !== 'undefined') {
        userData.name = updatedData.name;
    }
});

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.textContent = message;

    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)';
        toastIcon.textContent = '✗';
    } else {
        toast.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
        toastIcon.textContent = '✓';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// INPUT ANIMATIONS
// ===================================
const inputs = document.querySelectorAll('.form-input, .form-select');

inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateX(5px)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateX(0)';
    });
});

// ===================================
// REAL-TIME NAME UPDATE
// ===================================
userName.addEventListener('input', (e) => {
    const name = e.target.value.trim();
    if (name.length > 0) {
        displayName.textContent = name;
    }
});

// ===================================
// REAL-TIME ROLE UPDATE
// ===================================
userRole.addEventListener('change', (e) => {
    const role = e.target.value;
    displayRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
});

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveButton.click();
    }
});

// ===================================
// SYNC WITH MAIN THEME TOGGLE
// ===================================
const mainThemeToggle = document.getElementById('themeToggle');
if (mainThemeToggle) {
    mainThemeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        updateThemeButtons(isLight ? 'light' : 'dark');
    });
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    console.log('🤖 Profile page initialized');
});

// ===================================
// SMOOTH SCROLL TO TOP ON LOAD
// ===================================
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
