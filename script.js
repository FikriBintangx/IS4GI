// UI Elements
const dialogueText = document.getElementById('dialogue-text');
const bgLayer = document.getElementById('bg-layer');
const bustContainer = document.getElementById('character-bust');
const glitchOverlay = document.getElementById('glitch-overlay');
const inventoryOverlay = document.getElementById('inventory-overlay');
const choiceContainer = document.getElementById('choice-container');
const bgmToggle = document.getElementById('bgm-toggle');
const timeFilter = document.body;

// Game State
let currentDialogueIndex = 0;
let isTyping = false;
let typeTimeout;
let isBgmOn = false;

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

// Dialogues Data with Choices
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
            { label: "Lanjut Ngobrol", action: () => nextDialogue() }
        ]
    },
    { text: "Sini, liat tempat gue biasa ngulik sesuatu.", scene: "bg_lab.png" },
    { text: "Gue fokus di Front-End, tapi lagi suka explore mobile juga.", scene: "bg_lab.png" },
    { text: "Pencet [I] buat buka Inventory kapan aja ya!", scene: "bg_lab.png" },
    { text: "Gimana? Siap buat explore bareng gue?", scene: "bg_lab.png" }
];

function typeWriter(text, i) {
    if (i < text.length) {
        dialogueText.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
        isTyping = true;
        
        // Play synthesized typewriter sound
        playBlip();
        
        const delay = Math.random() * 20 + 20;
        typeTimeout = setTimeout(() => typeWriter(text, i + 1), delay);
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
                choiceContainer.classList.add('hidden');
                choice.action();
            };
            choiceContainer.appendChild(btn);
        });
    }
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

function startDialogue(index) {
    clearTimeout(typeTimeout);
    isTyping = false;
    currentDialogueIndex = index;
    choiceContainer.classList.add('hidden');
    
    const dialogue = dialogues[index];
    updateScene(dialogue.scene);
    typeWriter(dialogue.text, 0);
}

function nextDialogue() {
    if (isTyping) {
        clearTimeout(typeTimeout);
        dialogueText.innerHTML = dialogues[currentDialogueIndex].text;
        isTyping = false;
        showChoices();
    } else if (currentDialogueIndex < dialogues.length - 1 && !dialogues[currentDialogueIndex].choices) {
        startDialogue(currentDialogueIndex + 1);
    }
}

// Inventory Toggle
function toggleInventory(show) {
    if (show) inventoryOverlay.classList.remove('hidden');
    else inventoryOverlay.classList.add('hidden');
}

// Day/Night Logic
function checkTime() {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) {
        timeFilter.classList.add('night-mode');
    } else {
        timeFilter.classList.remove('night-mode');
    }
}

// BGM Toggle (Placeholder logic)
bgmToggle.onclick = () => {
    isBgmOn = !isBgmOn;
    bgmToggle.querySelector('.status').innerText = isBgmOn ? "ON" : "OFF";
    // Here you would normally play/pause an Audio element
};

// Event Listeners
document.getElementById('close-inv').onclick = () => toggleInventory(false);

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'e' || key === ' ' || key === 'enter') nextDialogue();
    if (key === 'i') toggleInventory(inventoryOverlay.classList.contains('hidden'));
    if (key === 'r') startDialogue(0);
});

// 3D Mouse Follow
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
    bustContainer.style.transform = `rotateY(${-xAxis}deg) rotateX(${yAxis}deg)`;
});

// Initialize
checkTime();
startDialogue(0);
console.log("Fikri's Adventure (Premium UI/UX) Initialized.");
