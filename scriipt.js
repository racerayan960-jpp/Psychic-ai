// ========== ISLAMIC DATABASE ==========
const islamicDB = {
    quran: {
        anxiety: [
            { surah: "Surah Ar-Ra'd (13:28)", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "In remembrance of Allah do hearts find rest" },
            { surah: "Surah Al-Fath (48:4)", arabic: "هُوَ الَّذِي أَنزَلَ السَّكِينَةَ", translation: "It is He who sent down tranquility" }
        ],
        sadness: [
            { surah: "Surah Yusuf (12:86)", arabic: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ", translation: "I only complain of my grief to Allah" },
            { surah: "Surah Al-Inshirah (94:5)", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "With hardship comes ease" }
        ],
        hopelessness: [
            { surah: "Surah Az-Zumar (39:53)", arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Do not despair of Allah's mercy" },
            { surah: "Surah Ad-Duha (93:3)", arabic: "مَا وَدَّعَكَ رَبُّكَ", translation: "Your Lord has not abandoned you" }
        ],
        guilt: [
            { surah: "Surah Ali Imran (3:135)", arabic: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً", translation: "Those who when they sin, seek forgiveness" },
            { surah: "Surah Ash-Shura (42:25)", arabic: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ", translation: "He accepts repentance" }
        ],
        anger: [
            { surah: "Surah Ali Imran (3:134)", arabic: "وَالْكَاظِمِينَ الْغَيْظَ", translation: "Those who restrain anger" }
        ],
        loneliness: [
            { surah: "Surah Al-Baqarah (2:186)", arabic: "فَإِنِّي قَرِيبٌ", translation: "I am near" }
        ]
    },
    hadith: [
        { text: "How wonderful is the affair of the believer. All of it is good.", narrator: "Sahih Muslim" },
        { text: "The strong believer is better and more beloved to Allah.", narrator: "Sahih Bukhari" },
        { text: "No one swallows anything better than swallowing anger.", narrator: "Abu Dawud" },
        { text: "The heart needs humbling just as the body needs food.", narrator: "Tirmidhi" }
    ]
};

// ========== APP STATE ==========
let currentScreen = 'splash';
let messages = [];
let timerInterval;
let timeLeft = 1800;
let answers = [];

// ========== INITIALIZATION ==========
setTimeout(() => showScreen('home'), 2000);
loadHistory();
updateStorageInfo();

// ========== SCREEN CONTROL ==========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

// ========== SESSION FUNCTIONS ==========
function startSession() {
    messages = [{ 
        speaker: 'ai', 
        text: 'Assalamu Alaikum. I\'m here to listen. What\'s on your mind?', 
        time: new Date() 
    }];
    answers = [];
    
    let sessionLength = document.getElementById('sessionLength')?.value || 30;
    timeLeft = parseInt(sessionLength) * 60;
    
    showScreen('session');
    updateChat();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            endSession();
            return;
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function sendMessage() {
    let input = document.getElementById('userInput');
    let text = input.value.trim();
    if (!text) return;

    // Add user message
    messages.push({ speaker: 'user', text, time: new Date() });
    answers.push(text);
    updateChat();
    input.value = '';

    // AI response
    setTimeout(() => {
        let response = getAIResponse(text);
        messages.push({ speaker: 'ai', text: response, time: new Date() });
        updateChat();
    }, 1000);
}

function getAIResponse(userMessage) {
    let msg = userMessage.toLowerCase();
    
    if (msg.includes('anxi') || msg.includes('worr') || msg.includes('stress')) {
        return "I hear your anxiety. Allah says: 'In remembrance of Allah do hearts find rest.' What specifically is causing this anxiety?";
    }
    if (msg.includes('sad') || msg.includes('depress')) {
        return "Sadness is real. Prophet Yaqub said: 'I only complain of my grief to Allah.' Tell me more about what's making you sad.";
    }
    if (msg.includes('guilt') || msg.includes('sin') || msg.includes('wrong')) {
        return "Allah's mercy is greater than your mistakes. He says: 'Do not despair of My mercy.' What's on your heart?";
    }
    if (msg.includes('angry') || msg.includes('mad')) {
        return "The Prophet ﷺ said the strong person controls their anger. What triggered this?";
    }
    if (msg.includes('alone') || msg.includes('lonely')) {
        return "When you feel alone, remember Allah says: 'I am near.' Tell me about this loneliness.";
    }
    if (msg.includes('hope') || msg.includes('hopeless')) {
        return "Allah says: 'Do not despair of My mercy.' Even when things seem dark, His mercy is greater.";
    }
    
    return "JazakAllah khair for sharing. Tell me more about how this connects to your daily life and faith.";
}

function updateChat() {
    let chat = document.getElementById('chat');
    chat.innerHTML = messages.map(m => `
        <div class="message ${m.speaker}">
            <div class="avatar">${m.speaker === 'ai' ? '🕌' : '👤'}</div>
            <div class="bubble">
                ${m.text}
                <span class="time">${new Date(m.time).toLocaleTimeString()}</span>
            </div>
        </div>
    `).join('');
    chat.scrollTop = chat.scrollHeight;
}

function endSession() {
    clearInterval(timerInterval);
    showScreen('analysis');
    setTimeout(generateReport, 2000);
}

function endSessionEarly() {
    if (confirm('End session early?')) {
        endSession();
    }
}

// ========== REPORT GENERATION ==========
function generateReport() {
    let emotion = detectEmotion();
    let verses = islamicDB.quran[emotion] || islamicDB.quran.anxiety;
    let hadith = islamicDB.hadith[Math.floor(Math.random() * islamicDB.hadith.length)];
    let verse = verses[0];

    let html = `
        <div class="report-section">
            <h3>📊 Summary</h3>
            <p>You shared about ${answers.length} topics today. The main theme was ${emotion}.</p>
        </div>

        <div class="report-section">
            <h3>📖 Quran for You</h3>
            <div class="arabic-verse">${verse.arabic}</div>
            <p class="verse-ref"><strong>${verse.surah}</strong></p>
            <p>${verse.translation}</p>
        </div>

        <div class="report-section">
            <h3>🕌 Hadith</h3>
            <p class="hadith-text">${hadith.text}</p>
            <p style="color: #666;">- ${hadith.narrator}</p>
        </div>

        <div class="report-section">
            <h3>💊 Prescription</h3>
            <div class="prescription-item">1. Pray 2 rakats and make dua about what we discussed</div>
            <div class="prescription-item">2. Read ${verse.surah} with translation</div>
            <div class="prescription-item">3. Make dhikr for 5 minutes when feeling ${emotion}</div>
        </div>
    `;

    document.getElementById('reportContent').innerHTML = html;
    showScreen('report');
    saveSession();
}

function detectEmotion() {
    let text = answers.join(' ').toLowerCase();
    if (text.includes('anxi') || text.includes('worr')) return 'anxiety';
    if (text.includes('sad') || text.includes('depress')) return 'sadness';
    if (text.includes('guilt') || text.includes('sin')) return 'guilt';
    if (text.includes('angry')) return 'anger';
    if (text.includes('alone')) return 'loneliness';
    if (text.includes('hope') || text.includes('hopeless')) return 'hopelessness';
    return 'anxiety';
}

// ========== HISTORY FUNCTIONS ==========
function saveSession() {
    let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.unshift({
        date: new Date().toISOString(),
        messageCount: answers.length,
        emotion: detectEmotion()
    });
    localStorage.setItem('sessions', JSON.stringify(sessions.slice(0, 10)));
    loadHistory();
    updateStorageInfo();
}

function loadHistory() {
    let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    let html = '';
    
    if (sessions.length === 0) {
        html = '<p style="color: #999; text-align: center;">No sessions yet</p>';
    } else {
        html = sessions.map(s => `
            <div class="history-item">
                <div class="history-date">${new Date(s.date).toLocaleDateString()}</div>
                <div>${s.messageCount} messages • ${s.emotion}</div>
            </div>
        `).join('');
    }
    
    let historyDiv = document.getElementById('historyList');
    if (historyDiv) historyDiv.innerHTML = html;
}

function clearHistory() {
    if (confirm('Delete all session history?')) {
        localStorage.removeItem('sessions');
        loadHistory();
        updateStorageInfo();
    }
}

// ========== WHATSAPP SHARING ==========
function shareReport() {
    let phone = document.getElementById('phoneInput')?.value || 
                document.getElementById('settingsPhone')?.value || '';
    
    let report = document.getElementById('reportContent')?.innerText || '';
    let summary = report.substring(0, 300);
    
    let message = encodeURIComponent(
        `🕌 Islamic AI Therapist Report\n\n${summary}\n\nSent from Islamic AI Therapist`
    );
    
    if (phone) {
        let cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    } else {
        window.open(`https://wa.me/?text=${message}`, '_blank');
    }
}

// ========== SETTINGS FUNCTIONS ==========
function toggleDarkMode() {
    let isDark = document.getElementById('darkMode').checked;
    if (isDark) {
        document.body.style.background = '#1a1a1a';
        document.querySelector('.app').style.background = '#2d2d2d';
        document.querySelector('.app').style.color = 'white';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #1E4A5F, #0F2A36)';
        document.querySelector('.app').style.background = 'white';
        document.querySelector('.app').style.color = 'black';
    }
}

function updateStorageInfo() {
    let sessions = localStorage.getItem('sessions') || '';
    let size = new Blob([sessions]).size;
    let info = document.getElementById('storageInfo');
    if (info) {
        info.textContent = `Storage used: ${(size / 1024).toFixed(2)} KB • All data on device`;
    }
}

// ========== AUTO-SAVE PHONE NUMBER ==========
document.addEventListener('DOMContentLoaded', function() {
    let savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
        let phoneInput = document.getElementById('phoneInput');
        let settingsPhone = document.getElementById('settingsPhone');
        if (phoneInput) phoneInput.value = savedPhone;
        if (settingsPhone) settingsPhone.value = savedPhone;
    }
    
    let phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('change', function(e) {
            localStorage.setItem('userPhone', e.target.value);
        });
    }
    
    let settingsPhone = document.getElementById('settingsPhone');
    if (settingsPhone) {
        settingsPhone.addEventListener('change', function(e) {
            localStorage.setItem('userPhone', e.target.value);
            let phoneInput = document.getElementById('phoneInput');
            if (phoneInput) phoneInput.value = e.target.value;
        });
    }
});
