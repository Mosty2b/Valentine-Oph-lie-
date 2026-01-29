
/* 
   =========================================
   LOGIQUE OPHÉLIE - VALENTINE PREMIUM 2.0
   =========================================
*/

const CONFIG = {
    targetName: "Ophélie",
    taunts: [
        "Oups ! Un peu trop à gauche... ❤️",
        "C'est de l'entraînement pour tes réflexes ? 🧐",
        "Tu es rapide, mais je suis plus rapide ! 🙊",
        "Le bouton 'Oui' se sent seul, il t'attend... ✨",
        "Dis-moi la vérité, tu le fais exprès là ? 🔥",
        "Ophélie vs La Technologie : 1 - 0 😍",
        "Même pas mal ! Je suis toujours là ! 💪",
        "On dirait que tu as vraiment envie de jouer... 💎",
        "Attention, le système commence à s'impatienter ! ⚠️",
        "ALERTE : Tentative de refus illégale détectée ! 💖"
    ],
    hackerLines: [
        "> Initialisation du Kernel Amoureux...",
        "> Analyse du système 'Ophélie'... OK",
        "> Détection d'un blocage du bonheur persistant.",
        "> Suppression du bouton 'Non' en cours...",
        "> Injection massive de souvenirs joyeux...",
        "> Synchronisation des cœurs... 100%",
        "> RÉUSSITE : Le 'OUI' est inévitable."
    ]
};

// Elements
const btnYes = document.getElementById('btn-yes') as HTMLButtonElement;
const btnNo = document.getElementById('btn-no') as HTMLButtonElement;
const btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;
const stepQuestion = document.getElementById('step-question') as HTMLDivElement;
const stepSuccess = document.getElementById('step-success') as HTMLDivElement;
const tauntMsg = document.getElementById('taunt-msg') as HTMLDivElement;
const counterEl = document.getElementById('counter') as HTMLDivElement;
const hackerOverlay = document.getElementById('hacker-overlay') as HTMLDivElement;
const terminalContent = document.getElementById('terminal-content') as HTMLDivElement;
const titleName = document.getElementById('title-name') as HTMLHeadingElement;
const toast = document.getElementById('easter-egg-toast') as HTMLDivElement;
const bgHeartsContainer = document.getElementById('bg-hearts') as HTMLDivElement;

let noCount = 0;
let titleClickCount = 0;
let yesScale = 1;

// --- 1. Audio Romantique (Web Audio API) ---
function playSuccessSound() {
    try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25]; // Accord Do Majeur 7 (C E G C E)
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1 + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime + (i * 0.02));
            osc.stop(ctx.currentTime + 2.5);
        });
    } catch (e) {
        console.warn("Audio Context non supporté", e);
    }
}

// --- 2. Background Anim ---
function createBackgroundHearts() {
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = Math.random() > 0.5 ? '❤' : '🌸';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDelay = Math.random() * 20 + 's';
        heart.style.animationDuration = (Math.random() * 10 + 15) + 's';
        bgHeartsContainer.appendChild(heart);
    }
}

// --- 3. Logique Anti-Collision ---
function moveNoButton() {
    if (noCount === 1) {
        btnNo.style.position = 'fixed';
    }

    const padding = 25;
    const btnNoWidth = btnNo.offsetWidth;
    const btnNoHeight = btnNo.offsetHeight;
    
    // Zone du bouton Oui (Scaled)
    const yesRect = btnYes.getBoundingClientRect();
    const yesBuffer = 40; // Zone d'exclusion

    let validPos = false;
    let finalX = 0;
    let finalY = 0;

    let attempts = 0;
    while (!validPos && attempts < 100) {
        finalX = Math.random() * (window.innerWidth - btnNoWidth - padding * 2) + padding;
        finalY = Math.random() * (window.innerHeight - btnNoHeight - padding * 2) + padding;

        const overlapX = finalX < yesRect.right + yesBuffer && finalX + btnNoWidth > yesRect.left - yesBuffer;
        const overlapY = finalY < yesRect.bottom + yesBuffer && finalY + btnNoHeight > yesRect.top - yesBuffer;

        if (!(overlapX && overlapY)) {
            validPos = true;
        }
        attempts++;
    }

    const rotation = (Math.random() - 0.5) * 45;
    
    btnNo.style.transition = "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
    btnNo.style.left = `${finalX}px`;
    btnNo.style.top = `${finalY}px`;
    btnNo.style.transform = `rotate(${rotation}deg)`;
}

// --- 4. Events ---
btnYes.addEventListener('click', () => {
    playSuccessSound();
    handleSuccess();
});

btnNo.addEventListener('click', () => {
    noCount++;
    
    if (noCount >= 10) {
        triggerHackerSequence();
        return;
    }

    // Le bouton Oui grandit de manière élégante (+0.4 par clic)
    yesScale = 1 + (noCount * 0.4); 
    btnYes.style.transform = `scale(${yesScale})`;

    moveNoButton();

    // Textes
    tauntMsg.innerText = CONFIG.taunts[noCount - 1] || "Presque ! ❤️";
    counterEl.innerText = `Tentative : ${noCount}/10`;
});

btnRestart.addEventListener('click', reset);

// --- 5. États ---
function handleSuccess() {
    stepQuestion.style.opacity = '0';
    stepQuestion.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        stepQuestion.classList.add('hidden');
        stepSuccess.classList.remove('hidden');
        triggerConfetti();
        // Reset bouton No
        btnNo.style.position = 'relative';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
        btnNo.style.transform = 'none';
    }, 600);
}

function reset() {
    noCount = 0;
    yesScale = 1;
    btnYes.style.transform = 'scale(1)';
    btnNo.style.position = 'relative';
    btnNo.style.left = 'auto';
    btnNo.style.top = 'auto';
    btnNo.style.transform = 'none';
    tauntMsg.innerText = '';
    counterEl.innerText = '';
    stepSuccess.classList.add('hidden');
    stepQuestion.classList.remove('hidden');
    stepQuestion.style.opacity = '1';
    stepQuestion.style.transform = 'none';
    terminalContent.innerHTML = '';
}

async function triggerHackerSequence() {
    hackerOverlay.classList.add('active');
    
    for (let line of CONFIG.hackerLines) {
        const p = document.createElement('div');
        p.style.marginBottom = '12px';
        p.style.fontSize = '0.9rem';
        p.innerText = line;
        terminalContent.appendChild(p);
        await new Promise(r => setTimeout(r, 700));
    }

    await new Promise(r => setTimeout(r, 1200));
    hackerOverlay.classList.remove('active');
    handleSuccess();
}

// --- 6. Easter Egg ---
titleName.addEventListener('click', () => {
    titleClickCount++;
    if (titleClickCount === 5) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            titleClickCount = 0;
        }, 3500);
    }
});

function triggerConfetti() {
    const colors = ['#ff4d6d', '#ff758f', '#c9184a', '#ffd1dc'];
    for (let i = 0; i < 110; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = Math.random() > 0.4 ? '🌸' : '❤';
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '10001';
        confetti.style.pointerEvents = 'none';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = (Math.random() * 25 + 15) + 'px';
        
        document.body.appendChild(confetti);

        confetti.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate3d(${(Math.random() - 0.5) * 500}px, 100vh, 0) rotate(${Math.random() * 1500}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 3500,
            easing: 'cubic-bezier(0.1, 0.9, 0.3, 1)'
        }).onfinish = () => confetti.remove();
    }
}

createBackgroundHearts();
