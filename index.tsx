
/* 
   =========================================
   LOGIQUE OPHÉLIE - VALENTINE PREMIUM 3.0
   =========================================
*/

const CONFIG = {
    taunts: [
        "Oups ! Trop rapide... ❤️",
        "T'es sûre ? Ton doigt a glissé ? 🧐",
        "Je suis insaisissable... 🙊",
        "Le 'Oui' est juste là, promis. ✨",
        "Tu joues avec le feu, Ophélie ! 🔥",
        "Regarde comme le 'Oui' grandit... 😍",
        "Presque ! Quel talent ! 💪",
        "On dirait que le destin insiste... 💎",
        "Le système surchauffe d'amour ! ⚠️",
        "ERREUR : REFUS IMPOSSIBLE ! 💖"
    ],
    hackerLines: [
        "> Initialisation du Kernel Amoureux...",
        "> Analyse du système 'Ophélie'... OK",
        "> Blocage du bonheur détecté.",
        "> Suppression du bouton 'Non'...",
        "> Injection de souvenirs joyeux...",
        "> Synchronisation... 100%",
        "> RÉSULTAT : OUI."
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

// --- 1. Audio Romantique Autonome ---
function playSuccessSound() {
    try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25];
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1 + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + (i * 0.02));
            osc.stop(ctx.currentTime + 2);
        });
    } catch (e) {}
}

// --- 2. Background Hearts ---
function createBackgroundHearts() {
    for (let i = 0; i < 18; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = Math.random() > 0.5 ? '❤' : '🌸';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        heart.style.animationDelay = Math.random() * 15 + 's';
        bgHeartsContainer.appendChild(heart);
    }
}

// --- 3. Mouvement Intelligent pour iPhone ---
function moveNoButton() {
    if (noCount === 1) {
        btnNo.style.position = 'fixed';
    }

    const padding = 30;
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;
    
    // Obtenir la zone occupée par le bouton Oui
    const yesRect = btnYes.getBoundingClientRect();
    const exclusionBuffer = 40;

    let validX = 0;
    let validY = 0;
    let isOverlap = true;
    let attempts = 0;

    while (isOverlap && attempts < 50) {
        validX = Math.random() * (window.innerWidth - btnWidth - padding * 2) + padding;
        validY = Math.random() * (window.innerHeight - btnHeight - padding * 2) + padding;

        // Vérifier si ça touche le bouton Oui
        const overlapX = validX < yesRect.right + exclusionBuffer && validX + btnWidth > yesRect.left - exclusionBuffer;
        const overlapY = validY < yesRect.bottom + exclusionBuffer && validY + btnHeight > yesRect.top - exclusionBuffer;

        if (!(overlapX && overlapY)) {
            isOverlap = false;
        }
        attempts++;
    }

    const rotation = (Math.random() - 0.5) * 30;
    btnNo.style.transition = "left 0.4s ease, top 0.4s ease, transform 0.4s ease";
    btnNo.style.left = `${validX}px`;
    btnNo.style.top = `${validY}px`;
    btnNo.style.transform = `rotate(${rotation}deg)`;
}

// --- 4. Event Handlers ---
btnYes.onclick = () => {
    playSuccessSound();
    handleSuccess();
};

btnNo.onclick = () => {
    noCount++;
    if (noCount >= 10) {
        triggerHackerSequence();
        return;
    }

    yesScale = 1 + (noCount * 0.4); 
    btnYes.style.transform = `scale(${yesScale})`;
    
    moveNoButton();
    tauntMsg.innerText = CONFIG.taunts[noCount - 1] || "❤️";
    counterEl.innerText = `Tentative : ${noCount}/10`;
};

btnRestart.onclick = reset;

function handleSuccess() {
    stepQuestion.style.opacity = '0';
    setTimeout(() => {
        stepQuestion.classList.add('hidden');
        stepSuccess.classList.remove('hidden');
        triggerConfetti();
        btnNo.style.position = 'relative';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
        btnNo.style.transform = 'none';
    }, 400);
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
    terminalContent.innerHTML = '';
}

async function triggerHackerSequence() {
    hackerOverlay.classList.add('active');
    for (let line of CONFIG.hackerLines) {
        const p = document.createElement('div');
        p.style.marginBottom = '10px';
        p.style.fontSize = '0.85rem';
        p.innerText = line;
        terminalContent.appendChild(p);
        await new Promise(r => setTimeout(r, 600));
    }
    await new Promise(r => setTimeout(r, 1000));
    hackerOverlay.classList.remove('active');
    handleSuccess();
}

titleName.onclick = () => {
    titleClickCount++;
    if (titleClickCount === 5) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            titleClickCount = 0;
        }, 3000);
    }
};

function triggerConfetti() {
    const symbols = ['🌸', '❤', '💕', '✨'];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('div');
        c.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        c.style.position = 'fixed';
        c.style.zIndex = '10000';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-20px';
        c.style.fontSize = (Math.random() * 20 + 20) + 'px';
        document.body.appendChild(c);

        c.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${(Math.random() - 0.5) * 300}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.4, 1)'
        }).onfinish = () => c.remove();
    }
}

createBackgroundHearts();
