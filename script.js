// UI Elements
const dialogueText = document.getElementById('dialogue-text');
const bgLayer = document.getElementById('bg-layer');
const bustContainer = document.getElementById('character-bust');
const glitchOverlay = document.getElementById('glitch-overlay');
const inventoryOverlay = document.getElementById('inventory-overlay');
const choiceContainer = document.getElementById('choice-container');
const bgmToggle = document.getElementById('bgm-toggle');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.querySelector('.game-container');
const achievementContainer = document.getElementById('achievement-container');
const interactiveTerminal = document.getElementById('interactive-terminal');

// Game State
let currentDialogueIndex = 0;
let isTyping = false;
let typeTimeout;
let isBgmOn = false;
let gameStarted = false;
const unlockedAchievements = new Set();

// Audio Context (Synthesized SFX)
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playBlip() {
    if (!audioCtx) audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// Dialogues
const dialogues = [
    { text: "...", scene: "bg_campus.png" },
    { text: "Loh, kamu di sini? Baru masuk ya?", scene: "bg_campus.png" },
    { text: "Kemari, biar aku perkenalkan diriku.", scene: "bg_campus.png" },
    { text: "Namaku Fikri, tapi orang-orang sering manggil gue IS4GI.", scene: "bg_campus.png" },
    { 
        text: "Gue lagi balance kuliah, kerja, dan grinding ilmu baru. Mau tau lebih lanjut?", 
        scene: "bg_campus.png",
        choices: [
            { label: "Cek Inventory Skill", action: () => toggleInventory(true) },
            { label: "Lanjut Ngobrol", action: () => nextDialogue(true) }
        ]
    },
    { text: "Sini, liat tempat gue biasa ngulik sesuatu.", scene: "bg_lab.png" },
    { text: "Gue fokus di Front-End, tapi lagi suka explore mobile juga.", scene: "bg_lab.png" },
    { text: "Kalo lu liat benda mencurigakan, klik aja siapa tau ada rahasia.", scene: "bg_lab.png" },
    { text: "Pencet [I] buat buka Inventory kapan aja ya!", scene: "bg_lab.png" }
];

// Achievement Logic
function triggerAchievement(title) {
    if (unlockedAchievements.has(title)) return;
    unlockedAchievements.add(title);
    
    const toast = document.createElement('div');
    toast.className = 'achievement';
    toast.innerHTML = `
        <span class="icon">🏆</span>
        <div>
            <div style="color: #ffd700; margin-bottom: 5px;">ACHIEVEMENT UNLOCKED!</div>
            <div>${title}</div>
        </div>
    `;
    achievementContainer.appendChild(toast);
    
    // Play success sound
    if (audioCtx) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.2); // C6
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }

    setTimeout(() => toast.style.opacity = '0', 3000);
    setTimeout(() => toast.remove(), 3500);
}

// Start Game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    checkTime();
    startDialogue(0);
}

// Typewriter
function typeWriter(text, i) {
    if (i < text.length) {
        dialogueText.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
        isTyping = true;
        playBlip();
        typeTimeout = setTimeout(() => typeWriter(text, i + 1), 40);
    } else {
        isTyping = false;
        showChoices();
    }
}

function showChoices() {
    const dialogue = dialogues[currentDialogueIndex];
    choiceContainer.innerHTML = '';
    if (dialogue.choices) {
        choiceContainer.classList.remove('hidden');
        dialogue.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = `> ${choice.label}`;
            btn.onclick = () => {
                if (choice.label.toLowerCase().includes('lanjut')) choiceContainer.classList.add('hidden');
                choice.action();
            };
            choiceContainer.appendChild(btn);
        });
    }
}

function startDialogue(index) {
    clearTimeout(typeTimeout);
    currentDialogueIndex = index;
    choiceContainer.classList.add('hidden');
    const dialogue = dialogues[index];
    
    // Show terminal only in lab
    if (dialogue.scene.includes('lab')) interactiveTerminal.classList.remove('hidden');
    else interactiveTerminal.classList.add('hidden');

    updateScene(dialogue.scene);
    typeWriter(dialogue.text, 0);
}

function updateScene(scenePath) {
    const currentBg = bgLayer.style.backgroundImage;
    const newBg = `url('${scenePath}')`;
    if (currentBg !== newBg) {
        glitchOverlay.classList.add('active-glitch');
        setTimeout(() => glitchOverlay.classList.remove('active-glitch'), 300);
        bgLayer.style.opacity = 0;
        setTimeout(() => {
            bgLayer.style.backgroundImage = newBg;
            bgLayer.style.opacity = 1;
        }, 150);
    }
}

function nextDialogue(force = false) {
    if (isTyping) {
        clearTimeout(typeTimeout);
        dialogueText.innerHTML = dialogues[currentDialogueIndex].text;
        isTyping = false;
        showChoices();
    } else if (currentDialogueIndex < dialogues.length - 1) {
        if (!force && dialogues[currentDialogueIndex].choices) return;
        startDialogue(currentDialogueIndex + 1);
    }
}

// Parallax & Mouse tracking
document.addEventListener('mousemove', (e) => {
    if (!gameStarted) return;
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    // Bust moves with mouse
    bustContainer.style.transform = `rotateY(${-xAxis}deg) rotateX(${yAxis}deg)`;
    
    // Background moves opposite (Parallax)
    const moveX = (e.pageX / window.innerWidth) * 20 - 10;
    const moveY = (e.pageY / window.innerHeight) * 20 - 10;
    bgLayer.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
});

// Inventory Tabs
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.remove('hidden');
    };
});

function toggleInventory(show) {
    if (show) inventoryOverlay.classList.remove('hidden');
    else inventoryOverlay.classList.add('hidden');
}

function checkTime() {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) document.body.classList.add('night-mode');
    else document.body.classList.remove('night-mode');
}

// Interactive Terminal click
interactiveTerminal.onclick = () => {
    triggerAchievement('Secret Hacker');
    dialogueText.innerHTML = "[SYSTEM]: Accessing encrypted data... User 'IS4GI' is authorized. Access Granted.";
};

// Controls
window.onclick = () => { if (!gameStarted) startGame(); };
window.onkeydown = () => { if (!gameStarted) startGame(); };

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;
    const key = e.key.toLowerCase();
    if (key === 'e' || key === ' ' || key === 'enter') nextDialogue();
    if (key === 'i') toggleInventory(inventoryOverlay.classList.contains('hidden'));
});

document.getElementById('close-inv').onclick = () => toggleInventory(false);
bgmToggle.onclick = () => {
    isBgmOn = !isBgmOn;
    bgmToggle.querySelector('.status').innerText = isBgmOn ? "ON" : "OFF";
};
