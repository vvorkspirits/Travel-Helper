const userDatabase = {
    'demo': { 
        password: 'demo123', 
        email: 'demo@example.com',
        itineraries: []
    },
    'john': { 
        password: 'password123', 
        email: 'john@example.com',
        itineraries: []
    },
    'jane': { 
        password: 'password123', 
        email: 'jane@example.com',
        itineraries: []
    }
};

const backgroundImages = [
    'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)', // Original
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple gradient
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink gradient
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue gradient
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green gradient
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Sunset gradient
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Pastel gradient
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', // Soft gradient
];

// ADDED: Subtitle sentences for rotation
const subtitleSentences = [
    "Your journey matters. Every trip is an adventure worth remembering.",
    "Explore new horizons and create unforgettable memories.",
    "Travel far enough to meet yourself.",
    "Adventure awaits. Let's plan your next journey!",
    "Collect moments, not things.",
    "The world is a book, and those who do not travel read only one page.",
    "Not all those who wander are lost.",
    "Travel makes one modest. You see what a tiny place you occupy in the world.",
    "Life is short and the world is wide. Better get started!",
    "To travel is to live.",
    "Take only memories, leave only footprints.",
    "Traveling – it leaves you speechless, then turns you into a storyteller."
];

let currentUser = null;
let exchangeChart = null;
let currentCoverImage = null;
let currentBgIndex = 0;

// ADDED: Variables for subtitle rotation
let subtitleInterval = null;
let currentSubtitleIndex = 0;


function cycleBackground() {
    currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
    document.body.style.background = backgroundImages[currentBgIndex];
    
    const btn = document.getElementById('bg-cycle-btn');
    btn.textContent = `Background ${currentBgIndex + 1}/${backgroundImages.length}`;

    localStorage.setItem('travelHelperBgIndex', currentBgIndex);
}

// ADDED: Subtitle rotation functions
function startSubtitleRotation() {
    // Clear any existing interval
    if (subtitleInterval) {
        clearInterval(subtitleInterval);
    }
    
    // Set initial subtitle
    updateSubtitle();
    
    // Change subtitle every 3 minutes (180,000 milliseconds)
    subtitleInterval = setInterval(() => {
        currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitleSentences.length;
        updateSubtitle();
    }, 180000); // 3 minutes = 180,000 milliseconds
}

function updateSubtitle() {
    const subtitleElement = document.getElementById('changing-subtitle');
    if (subtitleElement) {
        subtitleElement.textContent = subtitleSentences[currentSubtitleIndex];
        
        // Add a fade effect
        subtitleElement.style.opacity = '0.7';
        setTimeout(() => {
            subtitleElement.style.opacity = '1';
        }, 300);
    }
}

function toggleAuth() {
    const authForms = document.getElementById('auth-forms');
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('user-info');
    const toggleBtn = document.getElementById('toggle-auth');
    
    if (currentUser) {
        
        if (authForms.style.display === 'block') {
            closeAuthForms();
        }
        
        return;
    } else {
       
        if (authForms.style.display === 'block') {
            closeAuthForms();
        } else {
            authForms.style.display = 'block';
            loginForm.style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
            userInfo.style.display = 'none';
        }
    }
}

function closeAuthForms() {
    document.getElementById('auth-forms').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    clearAuthForms();
}

function clearAuthForms() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    if (userDatabase[username] && userDatabase[username].password === password) {
        currentUser = {
            username: username,
            email: userDatabase[username].email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        
        loadItineraries();
        
        closeAuthForms();
        
        alert(`Welcome back, ${username}!`);
    } else {
        alert('Invalid username or password. Try demo/demo123');
    }
}

function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    if (!username || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (username.length < 3) {
        alert('Username must be at least 3 characters');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (userDatabase[username]) {
        alert('Username already exists. Please choose another.');
        return;
    }
    
    userDatabase[username] = {
        password: password,
        email: email,
        itineraries: []
    };
    
    currentUser = {
        username: username,
        email: email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));


    updateAuthUI();
    
    loadItineraries();
    
    closeAuthForms();
    
    alert(`Account created successfully! Welcome, ${username}!`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    loadItineraries();
    alert('Logged out successfully!');
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const authForms = document.getElementById('auth-forms');
    const userInfo = document.getElementById('user-info');
    const toggleBtn = document.getElementById('toggle-auth');
    
    if (currentUser) {
        // User is logged in
        userInfo.style.display = 'flex';
        authForms.style.display = 'none';
        toggleBtn.style.display = 'block'; // KEEP THE BUTTON VISIBLE
        document.getElementById('logged-user').textContent = currentUser.username;
        toggleBtn.textContent = 'Account';
        toggleBtn.style.background = '#3498db';
    } else {
        // User is logged out
        userInfo.style.display = 'none';
        authForms.style.display = 'none';
        toggleBtn.style.display = 'block'; // KEEP THE BUTTON VISIBLE
        toggleBtn.textContent = 'Login / Register';
        toggleBtn.style.background = '#2ecc71';
    }
}

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const url = `https://api.exchangerate-api.com/v4/latest/${from}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        const rate = data.rates[to];
        const result = (amount * rate).toFixed(2);
        
        document.getElementById('result').innerHTML = 
            `<strong>${amount} ${from} = ${result} ${to}</strong><br>
             <small>Rate: 1 ${from} = ${rate.toFixed(4)} ${to}</small>`;
        
        if (exchangeChart) {
            updateChart();
        }
    } catch (error) {
        console.error('Conversion error:', error);
        
        const demoRates = {
            USD: { EUR: 0.85, GBP: 0.73, JPY: 110, CNY: 6.5, HKD: 7.8, MOP: 8.0, KRW: 1200, SGD: 1.35 },
            EUR: { USD: 1.18, GBP: 0.86, JPY: 130, CNY: 7.6, HKD: 9.2, MOP: 9.4, KRW: 1400, SGD: 1.59 },
            GBP: { USD: 1.37, EUR: 1.16, JPY: 150, CNY: 8.8, HKD: 10.7, MOP: 10.9, KRW: 1600, SGD: 1.82 }
        };
        
        const rate = demoRates[from]?.[to] || (from === to ? 1 : 0.85);
        const result = (amount * rate).toFixed(2);
        
        document.getElementById('result').innerHTML = 
            `<strong>${amount} ${from} = ${result} ${to}</strong><br>
             <small>Using demo rate (offline mode)</small>`;
    }
}

async function loadExchangeChart() {
    const base = document.getElementById('chart-base').value;
    const target = document.getElementById('chart-target').value;
    
    
    const days = 7;
    const labels = [];
    const data = [];
    
    
    const baseRates = {
        USD: { EUR: 0.85, GBP: 0.73, JPY: 110 },
        EUR: { USD: 1.18, GBP: 0.86, JPY: 130 },
        GBP: { USD: 1.37, EUR: 1.16, JPY: 150 }
    };
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        
        const baseRate = baseRates[base]?.[target] || 1;
        const variation = 0.95 + (Math.random() * 0.1);
        const rate = baseRate * variation;
        data.push(parseFloat(rate.toFixed(4)));
    }
    
    const ctx = document.getElementById('exchangeChart').getContext('2d');
    
    if (exchangeChart) {
        exchangeChart.destroy();
    }
    
    exchangeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${base} to ${target} Exchange Rate`,
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(3);
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    loadExchangeChart();
}

function previewCoverImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { 
        alert('Image size should be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCoverImage = e.target.result;
        const preview = document.getElementById('cover-preview');
        preview.innerHTML = `<img src="${currentCoverImage}" alt="Cover Preview">`;
    };
    reader.readAsDataURL(file);
}

function getUserItineraries() {
    if (!currentUser) return [];
    
    
    const user = userDatabase[currentUser.username];
    return user ? user.itineraries : [];
}

function saveUserItineraries(itineraries) {
    if (!currentUser) return;
    
    
    if (userDatabase[currentUser.username]) {
        userDatabase[currentUser.username].itineraries = itineraries;
    }
    
    
    localStorage.setItem(`itineraries_${currentUser.username}`, JSON.stringify(itineraries));
}

function loadItineraries() {
    const list = document.getElementById('list');
    
    if (!currentUser) {
        list.innerHTML = '<div class="info"><p>Please login to view and manage your itineraries.</p><p>Try demo/demo123 or register a new account.</p></div>';
        return;
    }
    
    const itineraries = getUserItineraries();
    
    if (itineraries.length === 0) {
        list.innerHTML = '<p class="info">No itineraries yet. Add your first trip!</p>';
        return;
    }
    
    list.innerHTML = '';
    itineraries.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'itinerary-item';
        div.innerHTML = `
            ${item.cover ? `<img src="${item.cover}" class="cover-thumb" alt="Trip Cover">` : ''}
            <h3>${item.title}</h3>
            <p><small>Created: ${item.date}</small></p>
            <p>${item.desc}</p>
            <div class="itinerary-actions">
                <button onclick="editItinerary(${index})">Edit</button>
                <button onclick="deleteItinerary(${index})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function addItinerary() {
    if (!currentUser) {
        alert('Please login to add itineraries');
        toggleAuth();
        return;
    }
    
    const title = document.getElementById('title').value.trim();
    const desc = document.getElementById('desc').value.trim();
    
    if (!title) {
        alert('Please enter a trip title');
        return;
    }
    
    const itineraries = getUserItineraries();
    
    const newItinerary = {
        id: Date.now(),
        title: title,
        desc: desc || 'No description',
        cover: currentCoverImage,
        date: new Date().toLocaleDateString()
    };
    
    itineraries.push(newItinerary);
    saveUserItineraries(itineraries);
    
    loadItineraries();
    resetItineraryForm();
    
    alert('Itinerary added successfully!');
}

function deleteItinerary(index) {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    
    const itineraries = getUserItineraries();
    itineraries.splice(index, 1);
    saveUserItineraries(itineraries);
    
    loadItineraries();
    alert('Itinerary deleted!');
}

function editItinerary(index) {
    if (!currentUser) return;
    
    const itineraries = getUserItineraries();
    const item = itineraries[index];
    
    if (!item) return;
    
    document.getElementById('title').value = item.title;
    document.getElementById('desc').value = item.desc;
    currentCoverImage = item.cover || null;
    
    
    const preview = document.getElementById('cover-preview');
    if (item.cover) {
        preview.innerHTML = `<img src="${item.cover}" alt="Cover Preview">`;
    } else {
        preview.innerHTML = '<div class="cover-placeholder">Upload a cover image for your trip</div>';
    }
    
    
    const btn = document.getElementById('itinerary-btn');
    btn.textContent = 'Update Itinerary';
    btn.onclick = function() { updateItinerary(index); };
}

function updateItinerary(index) {
    if (!currentUser) return;
    
    const title = document.getElementById('title').value.trim();
    const desc = document.getElementById('desc').value.trim();
    
    if (!title) {
        alert('Please enter a trip title');
        return;
    }
    
    const itineraries = getUserItineraries();
    const item = itineraries[index];
    
    if (item) {
        item.title = title;
        item.desc = desc || 'No description';
        item.cover = currentCoverImage || item.cover;
        item.date = new Date().toLocaleDateString();
        
        saveUserItineraries(itineraries);
        resetItineraryForm();
        loadItineraries();
        alert('Itinerary updated successfully!');
    }
}

function resetItineraryForm() {
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    currentCoverImage = null;
    document.getElementById('cover-preview').innerHTML = 
        '<div class="cover-placeholder">Upload a cover image for your trip</div>';
    document.getElementById('cover-upload').value = '';
    
    const btn = document.getElementById('itinerary-btn');
    btn.textContent = 'Add Itinerary';
    btn.onclick = addItinerary;
}

window.onload = function() {
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            console.error('Error parsing saved user:', e);
            currentUser = null;
        }
    }
    
    
    updateAuthUI();
    
    
    loadItineraries();
    
   
    loadExchangeChart();
    
    
    document.getElementById('from').value = 'USD';
    document.getElementById('to').value = 'EUR';
    convertCurrency();
    
    
    const bgCycleBtn = document.getElementById('bg-cycle-btn');
    if (bgCycleBtn) {
        bgCycleBtn.addEventListener('click', cycleBackground);
        
        
        const savedBgIndex = localStorage.getItem('travelHelperBgIndex');
        if (savedBgIndex !== null) {
            currentBgIndex = parseInt(savedBgIndex);
            document.body.style.background = backgroundImages[currentBgIndex];
        }
        
        
        bgCycleBtn.textContent = `Background ${currentBgIndex + 1}/${backgroundImages.length}`;
    }
    
    // ADDED: Start subtitle rotation
    startSubtitleRotation();
    
    
    document.addEventListener('click', function(event) {
        const authSection = document.getElementById('auth-section');
        const authForms = document.getElementById('auth-forms');
        
        if (authForms.style.display === 'block' && 
            !authSection.contains(event.target)) {
            closeAuthForms();
        }
    });
};