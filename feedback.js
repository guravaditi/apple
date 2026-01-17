// ===================================
// FEEDBACK PAGE - INTERACTIONS & SUBMISSION
// ===================================

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const starRating = document.getElementById('starRating');
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
const feedbackType = document.getElementById('feedbackType');
const feedbackMessage = document.getElementById('feedbackMessage');
const charCount = document.getElementById('charCount');
const fileUpload = document.getElementById('fileUpload');
const filePreview = document.getElementById('filePreview');
const submitButton = document.getElementById('submitButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const successMessage = document.getElementById('successMessage');
const newFeedbackButton = document.getElementById('newFeedbackButton');

let selectedRating = 0;
let uploadedFile = null;

// ===================================
// STAR RATING INTERACTION
// ===================================
stars.forEach(star => {
    star.addEventListener('click', function () {
        selectedRating = parseInt(this.getAttribute('data-rating'));
        ratingValue.value = selectedRating;
        updateStars();
    });

    star.addEventListener('mouseenter', function () {
        const hoverRating = parseInt(this.getAttribute('data-rating'));
        highlightStars(hoverRating);
    });
});

starRating.addEventListener('mouseleave', () => {
    updateStars();
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

// ===================================
// CHARACTER COUNTER
// ===================================
feedbackMessage.addEventListener('input', function () {
    const length = this.value.length;
    const maxLength = 500;

    charCount.textContent = length;

    const counter = charCount.parentElement;
    counter.classList.remove('warning', 'error');

    if (length > maxLength) {
        counter.classList.add('error');
        this.value = this.value.substring(0, maxLength);
        charCount.textContent = maxLength;
    } else if (length > maxLength * 0.9) {
        counter.classList.add('warning');
    }
});

// ===================================
// FILE UPLOAD
// ===================================
fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        uploadedFile = file;
        displayFilePreview(file);
    }
});

function displayFilePreview(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        filePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview" class="file-preview-image">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile()">×</button>
        `;
        filePreview.classList.add('active');
    };

    reader.readAsDataURL(file);
}

function removeFile() {
    uploadedFile = null;
    fileUpload.value = '';
    filePreview.classList.remove('active');
    filePreview.innerHTML = '';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ===================================
// FORM VALIDATION
// ===================================
function validateForm() {
    if (selectedRating === 0) {
        showToast('Please select a star rating', 'error');
        return false;
    }

    if (!feedbackType.value) {
        showToast('Please select a feedback type', 'error');
        return false;
    }

    if (feedbackMessage.value.trim().length < 10) {
        showToast('Please provide at least 10 characters of feedback', 'error');
        return false;
    }

    return true;
}

// ===================================
// FORM SUBMISSION
// ===================================
feedbackForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Collect feedback data
    const feedbackData = {
        userId: 'user_' + Date.now(), // Mock user ID
        rating: selectedRating,
        type: feedbackType.value,
        message: feedbackMessage.value.trim(),
        file: uploadedFile ? uploadedFile.name : null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    // Show loading overlay
    loadingOverlay.classList.add('active');
    submitButton.disabled = true;

    // Simulate API call
    await simulateSubmission(feedbackData);

    // Hide loading overlay
    loadingOverlay.classList.remove('active');

    // Show success message
    showSuccessMessage();
});

async function simulateSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store in localStorage (mock database)
    const feedbackList = JSON.parse(localStorage.getItem('edubot_feedback') || '[]');
    feedbackList.push(data);
    localStorage.setItem('edubot_feedback', JSON.stringify(feedbackList));

    console.log('Feedback submitted:', data);
    console.log('Total feedback count:', feedbackList.length);
}

function showSuccessMessage() {
    feedbackForm.style.display = 'none';
    successMessage.classList.add('active');
}

// ===================================
// NEW FEEDBACK BUTTON
// ===================================
newFeedbackButton.addEventListener('click', () => {
    resetForm();
    successMessage.classList.remove('active');
    feedbackForm.style.display = 'flex';
});

function resetForm() {
    // Reset form
    feedbackForm.reset();

    // Reset star rating
    selectedRating = 0;
    ratingValue.value = 0;
    updateStars();

    // Reset character counter
    charCount.textContent = '0';

    // Reset file upload
    removeFile();

    // Re-enable submit button
    submitButton.disabled = false;
}

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(message, type = 'error') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)';
    }

    Object.assign(toast.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(255, 68, 68, 0.4)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s',
        fontWeight: '600',
        color: 'white'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===================================
// DRAG AND DROP FILE UPLOAD
// ===================================
const fileUploadLabel = document.querySelector('.file-upload-label');

fileUploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadLabel.style.borderColor = 'var(--accent-cyan)';
    fileUploadLabel.style.background = 'rgba(0, 212, 255, 0.1)';
});

fileUploadLabel.addEventListener('dragleave', () => {
    fileUploadLabel.style.borderColor = 'var(--glass-border)';
    fileUploadLabel.style.background = 'var(--glass-bg)';
});

fileUploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadLabel.style.borderColor = 'var(--glass-border)';
    fileUploadLabel.style.background = 'var(--glass-bg)';

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        uploadedFile = file;
        displayFilePreview(file);

        // Update file input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileUpload.files = dataTransfer.files;
    }
});

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (feedbackForm.style.display !== 'none') {
            feedbackForm.dispatchEvent(new Event('submit'));
        }
    }
});

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Feedback page initialized');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) themeIcon.textContent = '☀️';
    }
});

// ===================================
// SMOOTH SCROLL TO TOP ON LOAD
// ===================================
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
