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

userAvatar?.addEventListener('click', (e) => {
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
const userNameEl = document.getElementById('userName');
if (userNameEl) userNameEl.textContent = userData.name;

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
const streakNumberEl = document.getElementById('streakNumber');
if (streakNumberEl) streakNumberEl.textContent = userData.streak;

// Load recent activity
const activityTimeline = document.getElementById('activityTimeline');
if (activityTimeline) {
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
}

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
// ===================================
// API CONFIGURATION
// ===================================
const API_BASE_URL = "http://localhost:8000";

// CONFIG: REPLACE WITH YOUR SUPABASE KEYS
const SUPABASE_URL = "https://vkdduawecojsokegtywe.supabase.co/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZGR1YXdlY29qc29rZWd0eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzQxMjMsImV4cCI6MjA4NDI1MDEyM30.fDnDvTBHXsyAUnqASngYG5ak0NGl3FhZ8qpi_Gon59A";

// Initialize Supabase Client
let sbClient = null;
try {
    if (window.supabase) {
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error("Supabase CDN not loaded in index.html");
    }
} catch (e) {
    console.error("Supabase Init Error:", e);
}

// Check Auth & Load User
async function checkAuthAndLoadUser() {
    const accessToken = localStorage.getItem('sb-access-token');

    if (!accessToken) {
        // Not logged in -> Redirect
        window.location.href = 'login.html';
        return;
    }

    if (sbClient) {
        // 1. Get User Session
        const { data: { user }, error } = await sbClient.auth.getUser(accessToken);

        if (error || !user) {
            console.error("Invalid Token:", error);
            localStorage.removeItem('sb-access-token');
            window.location.href = 'login.html';
            return;
        }

        // 2. Update UI with User Email
        console.log("Logged in as:", user.email);
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            // Use email or metadata if available
            userNameEl.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
        }

        // 3. (Optional) Create Profile in DB if missing
        // This usually happens via Postgres Triggers, but for safety:
        // await createProfileIfNeeded(user);
    }
}

// Run Auth Check on Load
document.addEventListener('DOMContentLoaded', checkAuthAndLoadUser);

// ===================================
// FEATURE CLICK HANDLER & API LOGIC
// ===================================
// ===================================
// FEATURE CLICK HANDLER & API LOGIC
// ===================================
const heroGenerator = document.getElementById("heroGenerator");
const generateBtn = document.getElementById("generateBtn");
const generatorTitle = document.getElementById("generatorTitle");
const resultArea = document.getElementById("resultArea");
const sourceText = document.getElementById("sourceText");
const fileUpload = document.getElementById("fileUpload");
const attachBtn = document.getElementById("attachBtn");
const filePreview = document.getElementById("filePreview");
const fileNameSpan = document.getElementById("fileName");
const removeFileBtn = document.getElementById("removeFile");

// Default feature
let currentFeature = "deep-dive";
let selectedFile = null;

function handleFeatureClick(feature) {
    const featureNames = {
        'ai-tutor': 'AI Tutor', 'flashcards': 'Flashcards',
        'games': 'Games', 'summary': 'Summary', 'avatar': 'Avatar'
    };
    const typeMapping = {
        'flashcards': 'flashcards', 'games': 'quiz',
        'summary': 'deep-dive', 'ai-tutor': 'deep-dive'
    };

    if (!typeMapping[feature]) {
        showNotification(`🚧 ${featureNames[feature] || feature} coming soon!`);
        return;
    }

    currentFeature = typeMapping[feature];
    if (generatorTitle) {
        generatorTitle.textContent = `Generate ${featureNames[feature] || feature}`;
    }

    // Clear previous results or keep them? 
    // Usually better to start fresh or keep context. Let's keep context unless specific request.
    // User request: "Preserve all existing logic". Existing logic reset inputs on open.
    // So we should probably reset inputs if context switches, to match previous behavior of "opening fresh modal"

    resultArea.style.display = 'none';
    resultArea.textContent = '';

    // Reset inputs to preserve original "new session" feel
    sourceText.value = '';
    selectedFile = null;
    fileUpload.value = '';
    filePreview.style.display = 'none';

    // Scroll to generator
    heroGenerator.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Focus text area
    setTimeout(() => {
        sourceText.focus();
    }, 500);

    showNotification(`Selected: ${featureNames[feature] || feature}`);
}

// File Attachment Logic
attachBtn.onclick = () => fileUpload.click();

fileUpload.onchange = (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        fileNameSpan.textContent = selectedFile.name;
        filePreview.style.display = 'block';
        sourceText.placeholder = "File attached. Add any extra context if needed...";
    }
};

removeFileBtn.onclick = () => {
    selectedFile = null;
    fileUpload.value = '';
    filePreview.style.display = 'none';
    sourceText.placeholder = "Paste text or attach a file...";
};

generateBtn.onclick = async () => {
    const text = sourceText.value;

    if (!text && !selectedFile) {
        showNotification("⚠️ Please paste text OR upload a file");
        return;
    }

    generateBtn.textContent = "Processing...";
    generateBtn.disabled = true;

    try {
        let documentId = null;

        // SCENARIO 1: FILE UPLOAD
        if (selectedFile) {
            showNotification("📤 Uploading file...");

            // 1. Upload to Supabase Storage
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/${fileName}`; // Assumes 'uploads' bucket exists

            const { data: uploadData, error: uploadError } = await sbClient.storage
                .from('documents') // User needs to create this bucket or 'uploads'
                .upload(filePath, selectedFile);

            if (uploadError) {
                // If bucket doesn't exist, try 'uploads' or alert user
                console.error(uploadError);
                throw new Error(`Upload Failed: ${uploadError.message}. Does 'documents' bucket exist?`);
            }

            // 2. Ingest Reference
            const ingestRes = await fetch(`${API_BASE_URL}/ingest/file-reference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`
                },
                body: JSON.stringify({
                    title: selectedFile.name,
                    file_path: filePath,
                    file_type: fileExt
                })
            });

            if (!ingestRes.ok) throw new Error("File Ingestion failed");
            const ingestData = await ingestRes.json();
            documentId = ingestData.document_id;

            // SCENARIO 2: RAW TEXT
        } else {
            const ingestRes = await fetch(`${API_BASE_URL}/ingest/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`
                },
                body: JSON.stringify({ title: "Frontend Text", content: text })
            });

            if (!ingestRes.ok) throw new Error("Text Ingestion failed");
            const ingestData = await ingestRes.json();
            documentId = ingestData.document_id;
        }

        // 3. Generate Content
        showNotification("✨ Generating Content...");
        const genRes = await fetch(`${API_BASE_URL}/generate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`
            },
            body: JSON.stringify({
                document_id: documentId,
                type: currentFeature
            })
        });

        if (!genRes.ok) throw new Error("Generation failed");
        const genData = await genRes.json();

        // Render Result (JSON formatted)
        resultArea.style.display = 'block';

        // Simple formatter for visibility
        let formatted = JSON.stringify(genData.content, null, 2);
        if (currentFeature === 'deep-dive' && genData.content.markdown) {
            formatted = genData.content.markdown; // If backend sends MD
        }

        resultArea.textContent = formatted;
        showNotification("✅ content Ready!");

    } catch (e) {
        console.error(e);
        showNotification(`❌ Error: ${e.message}`);
        resultArea.style.display = 'block';
        resultArea.textContent = "Error: " + e.message;
    } finally {
        generateBtn.textContent = "Generate";
        generateBtn.disabled = false;
    }
};

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
