const dialogueText = document.getElementById('dialogue-text');
const bgLayer = document.getElementById('bg-layer');
const bustImg = document.getElementById('bust-img');

const dialogues = [
    // SCENE: Campus
    { text: "...", scene: "bg_campus.png" },
    { text: "Oh? Someone just entered this world.", scene: "bg_campus.png" },
    { text: "Welcome, traveler.", scene: "bg_campus.png" },
    { text: "You're probably wondering who I am.", scene: "bg_campus.png" },
    { text: "My name is Fikri... but some call me IS4GI.", scene: "bg_campus.png" },
    { text: "Just a player trying to level up in life.", scene: "bg_campus.png" },
    { text: "Currently a 4th semester student.", scene: "bg_campus.png" },
    { text: "Balancing between study... and real-world grinding.", scene: "bg_campus.png" },
    
    // SCENE: Lab
    { text: "Let me show you where the magic happens.", scene: "bg_lab.png" },
    { text: "Class: Front-End Developer.", scene: "bg_lab.png" },
    { text: "Special ability: crafting aesthetic and clean UI.", scene: "bg_lab.png" },
    { text: "Inventory loaded: HTML, CSS, JavaScript...", scene: "bg_lab.png" },
    { text: "And of course: React, Next.js, Flutter.", scene: "bg_lab.png" },
    { text: "Current quest: Building a stable attendance app.", scene: "bg_lab.png" },
    { text: "I believe progress > perfection.", scene: "bg_lab.png" },
    { text: "So... are you ready to explore my world?", scene: "bg_lab.png" },
    { text: "Press [R] to restart. Let's build something great!", scene: "bg_lab.png" }
];

let currentDialogueIndex = 0;
let isTyping = false;
let typeTimeout;

function typeWriter(text, i) {
    if (i < text.length) {
        dialogueText.innerHTML = text.substring(0, i + 1) + '<span class="cursor" aria-hidden="true"></span>';
        isTyping = true;
        
        const delay = Math.random() * 20 + 15;
        
        typeTimeout = setTimeout(() => {
            typeWriter(text, i + 1)
        }, delay);
    } else {
        isTyping = false;
    }
}

function updateScene(scenePath) {
    const currentBg = bgLayer.style.backgroundImage;
    const newBg = `url('${scenePath}')`;
    
    if (currentBg !== newBg) {
        bgLayer.style.opacity = 0;
        setTimeout(() => {
            bgLayer.style.backgroundImage = newBg;
            bgLayer.style.opacity = 1;
        }, 300);
    }
}

function startDialogue(index) {
    clearTimeout(typeTimeout);
    isTyping = false;
    currentDialogueIndex = index;
    
    const dialogue = dialogues[index];
    updateScene(dialogue.scene);
    typeWriter(dialogue.text, 0);
}

function nextDialogue() {
    if (isTyping) {
        clearTimeout(typeTimeout);
        dialogueText.innerHTML = dialogues[currentDialogueIndex].text;
        isTyping = false;
    } else {
        if (currentDialogueIndex < dialogues.length - 1) {
            startDialogue(currentDialogueIndex + 1);
        }
    }
}

function skipAll() {
    startDialogue(dialogues.length - 1);
}

function restartGame() {
    startDialogue(0);
}

// Initial
startDialogue(0);

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'e' || key === ' ' || key === 'enter') nextDialogue();
    else if (key === 'q') skipAll();
    else if (key === 'r') restartGame();
});

console.log("Fikri's Adventure (Visual Novel Edition) Initialized.");
