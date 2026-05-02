const dialogueText = document.getElementById('dialogue-text');
const dialogues = [
    "Selamat datang di dunia pixel! Apakah kamu siap untuk petualangan baru hari ini?",
    "Gunakan keahlianmu untuk menjelajahi pulau terapung yang penuh misteri ini.",
    "Banyak rahasia yang tersembunyi di balik reruntuhan kuno itu...",
    "Hati-hati, malam akan segera tiba. Monster pixel biasanya muncul saat itu!"
];

let currentDialogueIndex = 0;
let isTyping = false;

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        dialogueText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
        isTyping = true;
        
        // Random slight delay for more natural feel
        const delay = Math.random() * 50 + 30;
        
        setTimeout(() => {
            typeWriter(text, i + 1, fnCallback)
        }, delay);
    } else if (typeof fnCallback == 'function') {
        isTyping = false;
        setTimeout(fnCallback, 700);
    }
}

function startDialogue(index) {
    if (isTyping) return;
    
    const text = dialogues[index];
    typeWriter(text, 0, () => {
        // Dialogue finished typing
    });
}

// Initial dialogue
startDialogue(0);

// Interaction
document.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
        if (!isTyping) {
            currentDialogueIndex = (currentDialogueIndex + 1) % dialogues.length;
            startDialogue(currentDialogueIndex);
        }
    }
});

// Simple player movement (Visual only)
const player = document.getElementById('player');
let posX = 50;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        posX = Math.max(10, posX - 2);
        player.style.left = posX + '%';
        player.style.transform = 'translateX(-50%) scaleX(-1)'; // Flip
    } else if (e.key === 'ArrowRight') {
        posX = Math.min(90, posX + 2);
        player.style.left = posX + '%';
        player.style.transform = 'translateX(-50%) scaleX(1)'; // Normal
    }
});

console.log("Pixel World Initialized. Press [E] or Arrow Keys to interact.");
