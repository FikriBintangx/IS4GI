const dialogueText = document.getElementById('dialogue-text');
const dialogues = [
    // 1. Opening
    "...",
    "Oh? Someone just entered this world.",
    "Welcome, traveler.",
    
    // 2. Identity Reveal
    "You're probably wondering who I am.",
    "My name is Fikri... but some call me IS4GI.",
    "Just a player trying to level up in life.",
    
    // 3. Background
    "Currently a 4th semester student.",
    "Balancing between study... and real-world grinding.",
    "Not easy, but that's part of the game.",
    
    // 4. Role / Class
    "Class: Front-End Developer.",
    "Special ability: crafting aesthetic and clean UI.",
    "I turn ideas into interactive experiences.",
    
    // 5. Tech Stack
    "Inventory loaded...",
    "HTML, CSS, JavaScript...",
    "React, Next.js, Flutter...",
    "Still upgrading every day.",
    
    // 6. Current Quest
    "Current quest:",
    "Building a stable attendance app.",
    "Exploring UI design and pixel aesthetics.",
    "Trying to create something meaningful.",
    
    // 7. Philosophy
    "I believe progress > perfection.",
    "Every bug is just another challenge.",
    "And every project... is a new adventure.",
    
    // 8. Closing
    "So...",
    "Are you ready to explore my world?",
    "Press [R] to restart or just enjoy the view. Let's build something great!"
];

let currentDialogueIndex = 0;
let isTyping = false;
let typeTimeout;

function typeWriter(text, i) {
    if (i < text.length) {
        dialogueText.innerHTML = text.substring(0, i + 1) + '<span class="cursor" aria-hidden="true"></span>';
        isTyping = true;
        
        const delay = Math.random() * 30 + 20; // Faster typing for better feel
        
        typeTimeout = setTimeout(() => {
            typeWriter(text, i + 1)
        }, delay);
    } else {
        isTyping = false;
    }
}

function startDialogue(index) {
    clearTimeout(typeTimeout);
    isTyping = false;
    currentDialogueIndex = index;
    typeWriter(dialogues[index], 0);
}

function nextDialogue() {
    if (isTyping) {
        // Skip typing animation
        clearTimeout(typeTimeout);
        dialogueText.innerHTML = dialogues[currentDialogueIndex];
        isTyping = false;
    } else {
        currentDialogueIndex++;
        if (currentDialogueIndex < dialogues.length) {
            startDialogue(currentDialogueIndex);
        }
    }
}

function skipAll() {
    clearTimeout(typeTimeout);
    currentDialogueIndex = dialogues.length - 1;
    startDialogue(currentDialogueIndex);
}

function restartGame() {
    currentDialogueIndex = 0;
    startDialogue(0);
}

// Initial dialogue
startDialogue(0);

// Interaction
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'e' || key === ' ' || key === 'enter') {
        nextDialogue();
    } else if (key === 'q') {
        skipAll();
    } else if (key === 'r') {
        restartGame();
    }
});

// Simple player movement (Visual only)
const player = document.getElementById('player');
let posX = 50;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        posX = Math.max(10, posX - 2);
        player.style.left = posX + '%';
        player.style.transform = 'translateX(-50%) scaleX(-1)';
    } else if (e.key === 'ArrowRight') {
        posX = Math.min(90, posX + 2);
        player.style.left = posX + '%';
        player.style.transform = 'translateX(-50%) scaleX(1)';
    }
});

console.log("Fikri's Adventure Initialized. [E] Next, [Q] Skip, [R] Restart.");
