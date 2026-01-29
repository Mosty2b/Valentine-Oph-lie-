
/* 
   =========================================
   LOGIQUE OPHÉLIE - VALENTINE PREMIUM 4.0
   =========================================
*/

const CONFIG = {
    maxAttempts: 10,
    yesScaleStep: 0.2, // Grossissement maîtrisé
    hackerCommands: [
        "SYSTEM_BOOT: OK",
        "ACCESSING_HEART_CORE...",
        "DECRYPTING_ROMANCE_PROTOCOL...",
        "OVERRIDE_REFUSAL_0102...",
        "INJECTING_VALENTINE_DLL...",
        "FORCE_VALIDATION_YES...",
        "REDIRECTING_TO_LOVE_STAGE..."
    ]
};

// --- DOM ELEMENTS ---
const introStage = document.getElementById('stage-intro')!;
const letterStage = document.getElementById('stage-letter')!;
const successStage = document.getElementById('stage-success')!;
const envelope = document.getElementById('envelope')!;
const flap = document.getElementById('flap')!;
const btnYes = document.getElementById('btn-yes') as HTMLButtonElement;
const btnNo = document.getElementById('btn-no') as HTMLButtonElement;
const btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;
const counter = document.getElementById('counter')!;
const glitchOverlay = document.getElementById('glitch-overlay')!;
const terminal = document.getElementById('terminal')!;

let noCount = 0;
let yesScale = 1;

// --- UTILS ---
/**
 * Gestionnaire de tap robuste pour iOS/Android
 */
function onTap(el: HTMLElement, callback: () => void) {
    el.addEventListener('pointerdown', (e) => {
        // e.preventDefault(); // Peut bloquer le click event standard si mal géré
        // On laisse le comportement par défaut mais on assure pointerdown pour la rapidité
    });
    el.addEventListener('click', (e) => {
        e.preventDefault();
        callback();
    });
}

// --- 1. OUVERTURE ENVELOPPE ---
onTap(envelope, () => {
    // Animation d'ouverture
    flap.style.transform = "rotateX(180deg)";
    flap.style.zIndex = "0";
    
    setTimeout(() => {
        introStage.style.opacity = "0";
        introStage.style.transform = "scale(0.8) translateY(-100px)";
        
        setTimeout(() => {
            introStage.classList.add('hidden');
            letterStage.style.opacity = "1";
            letterStage.style.transform = "translateY(0) scale(1)";
            letterStage.style.pointerEvents = "all";
        }, 600);
    }, 400);
});

// --- 2. LOGIQUE BOUTONS ---
onTap(btnYes, () => {
    goToSuccess();
});

onTap(btnNo, () => {
    noCount++;
    
    if (noCount >= CONFIG.maxAttempts) {
        triggerHackerSequence();
        return;
    }

    // Progression du OUI
    yesScale += CONFIG.yesScaleStep;
    btnYes.style.transform = `scale(${yesScale})`;

    // Déplacement subtil du NON pour rester cliquable mais taquin
    moveNoButton();
    
    counter.innerText = `Tentative ${noCount}/${CONFIG.maxAttempts}`;
});

function moveNoButton() {
    const rect = btnNo.getBoundingClientRect();
    const padding = 20;
    
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    // On reste près du centre pour ne pas perdre l'utilisateur sur mobile
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    btnNo.style.position = "fixed";
    btnNo.style.transition = "all 0.4s ease";
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

// --- 3. SEQUENCE HACK ---
async function triggerHackerSequence() {
    glitchOverlay.style.display = "block";
    
    // Animation Terminal
    for (const cmd of CONFIG.hackerCommands) {
        const line = document.createElement('div');
        line.className = 'glitch-text';
        line.innerText = `> ${cmd}`;
        terminal.appendChild(line);
        await new Promise(r => setTimeout(r, 400));
    }

    // Flash Final
    glitchOverlay.style.background = "#fff";
    await new Promise(r => setTimeout(r, 100));
    glitchOverlay.style.background = "#000";
    await new Promise(r => setTimeout(r, 400));

    glitchOverlay.style.display = "none";
    goToSuccess();
}

// --- 4. ETAT FINAL ---
function goToSuccess() {
    letterStage.style.opacity = "0";
    letterStage.style.pointerEvents = "none";
    
    setTimeout(() => {
        letterStage.classList.add('hidden');
        successStage.style.opacity = "1";
        successStage.style.pointerEvents = "all";
        triggerConfetti();
        playSimpleSound();
    }, 600);
}

function reset() {
    location.reload(); // Solution la plus propre pour réinitialiser tous les états complexes
}

onTap(btnRestart, reset);

// --- EFFECTS ---
function triggerConfetti() {
    const symbols = ['🌸', '❤', '💕', '✨'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        c.style.position = 'fixed';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-20px';
        c.style.fontSize = (Math.random() * 20 + 20) + 'px';
        c.style.pointerEvents = 'none';
        c.style.zIndex = '1000';
        document.body.appendChild(c);

        c.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(110vh) translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.4, 1)'
        }).onfinish = () => c.remove();
    }
}

function playSimpleSound() {
    try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
}
