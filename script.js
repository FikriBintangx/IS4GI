const dialogueText = document.getElementById('dialogue-text');
const bgLayer = document.getElementById('bg-layer');
const bustContainer = document.getElementById('character-bust');
const bustImg = document.getElementById('bust-img');
const glitchOverlay = document.getElementById('glitch-overlay');

const dialogues = [
    // SCENE: Campus
    { text: "...", scene: "bg_campus.png" },
    { text: "Loh, kamu di sini? Baru masuk ya?", scene: "bg_campus.png" },
    { text: "Kemari, biar aku perkenalkan diriku.", scene: "bg_campus.png" },
    { text: "Mungkin kamu penasaran aku ini siapa...", scene: "bg_campus.png" },
    { text: "Namaku Fikri, tapi orang-orang sering manggil gue IS4GI.", scene: "bg_campus.png" },
    { text: "Gue cuma player yang lagi sibuk leveling di dunia nyata.", scene: "bg_campus.png" },
    { text: "Sekarang lagi semester 4, masih proses belajar banyak hal.", scene: "bg_campus.png" },
    { text: "aku lagi balance kuliah kerja dan mencari ilmu baru yang berkaitan dengan programming", scene: "bg_campus.png" },
    
    // SCENE: Lab
    { text: "Sini, liat tempat gue biasa ngulik sesuatu.", scene: "bg_lab.png" },
    { text: "Class: Front-End Developer.", scene: "bg_lab.png" },
    { text: "Skill pasif: Bikin UI yang bersih, rapi, dan enak diliat.", scene: "bg_lab.png" },
    { text: "Inventory saat ini: HTML, CSS, JavaScript...", scene: "bg_lab.png" },
    { text: "Lagi nambah koleksi: React, Next.js, sama Flutter juga.", scene: "bg_lab.png" },
    { text: "Quest aktif: Selesaiin aplikasi SIABSENSI biar berguna buat orang.", scene: "bg_lab.png" },
    { text: "Prinsip gue simpel: progress jauh lebih penting dari sekadar sempurna.", scene: "bg_lab.png" },
    { text: "Gimana? Siap buat explore bareng gue?", scene: "bg_lab.png" },
    { text: "Tekan [R] buat ulang. Yuk, kita bikin sesuatu yang gila!", scene: "bg_lab.png" }
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
        // Trigger Glitch Effect
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

// 3D Mouse Follow Effect for Character Bust
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    // Reverse axes for more natural feel and limit rotation
    const rotateY = -xAxis;
    const rotateX = yAxis;
    
    bustContainer.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    // Add dynamic shadow based on mouse position
    bustContainer.style.boxShadow = `${-xAxis}px ${yAxis}px 30px rgba(255, 215, 0, 0.4)`;
});

console.log("Fikri's Adventure (Insane 3D Edition) Initialized.");
