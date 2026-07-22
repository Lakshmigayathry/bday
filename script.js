// ==========================================================================
// STATE MANAGEMENT & CONFIG
// ==========================================================================
const state = {
  activePage: 1,
  musicPlaying: false,
  musicMode: 'synth', // 'mp3' or 'synth'
  audioCtx: null,
  masterGain: null,
  synthLoopId: null,
  synthBeatCount: 0,
  isLoaded: false,
  candlesBlown: false,
  letterStarted: false,
  letterCompleted: false,
  waxSealStamped: false,
  microphoneAllowed: false,
  micAnalyser: null,
  micStream: null,
  lightboxImages: [
    // Beautiful handwritten memories/descriptions matching the 10 polaroids
    "Our first conversation. A tiny message that changed our worlds forever.",
    "That little smile. The highlight of my day, every single day.",
    "Making sweet wishes for a beautiful, golden future together.",
    "Lost in thought, but my heart is always thinking of you.",
    "Every beat of my heart belongs to you, in this universe and all others.",
    "The quiet moments, just talking and feeling completely at home.",
    "Wishing on stars, knowing that my wish came true the day I texted you.",
    "India to Doha, counting down the days and miles to see you again.",
    "Love that bridges oceans and lands, growing deeper with every sunset.",
    "Our favorite coffee conversations, where hours felt like seconds."
  ]
};

// SVG templates for the 10 polaroid photos (reused in lightbox)
const polaroidSVGs = [
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M15 75 L35 45 L50 65 L70 30 L90 80 Z" fill="#D8A7B1" opacity="0.7"/><circle cx="30" cy="30" r="8" fill="#C8A96A"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><circle cx="50" cy="45" r="22" fill="#D8A7B1" opacity="0.6"/><path d="M50 15 L50 75 M20 45 L80 45" stroke="#8B6B61" stroke-width="1.5" stroke-dasharray="4 4"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M20 70 Q50 30, 80 70" fill="none" stroke="#6E2C3A" stroke-width="3"/><path d="M50 35 L40 50 L60 50 Z" fill="#C8A96A"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><ellipse cx="50" cy="50" rx="30" ry="15" fill="#8B6B61" opacity="0.4"/><ellipse cx="50" cy="50" rx="20" ry="8" fill="#FFF9F2"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M30 30 Q50 10, 70 30 Q90 50, 50 85 Q10 50, 30 30 Z" fill="#D8A7B1" opacity="0.8"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M10 80 Q30 50, 50 80 T90 80" fill="none" stroke="#6E2C3A" stroke-width="2"/><path d="M30 40 L40 30 L50 40 Z" fill="#C8A96A"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M50 20 L60 40 L82 43 L65 58 L70 80 L50 68 L30 80 L35 58 L18 43 L40 40 Z" fill="#C8A96A" opacity="0.7"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><circle cx="50" cy="50" r="30" fill="none" stroke="#8B6B61" stroke-width="2"/><path d="M30 50 A20 20 0 0 0 70 50" fill="none" stroke="#D8A7B1" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><path d="M20 50 Q50 80, 80 50 T50 20 Z" fill="#6E2C3A" opacity="0.6"/></svg>`,
  `<svg viewBox="0 0 100 100" class="placeholder-svg"><rect width="100" height="100" fill="#EAE0D5"/><circle cx="50" cy="50" r="25" fill="#D8A7B1" opacity="0.4"/><rect x="45" y="30" width="10" height="40" rx="3" fill="#8B6B61"/></svg>`
];

const letterText = `<strong>Happy Birthday Chippu ❤️</strong>

You came into my life when I wasn’t looking for anyone, and somehow you became the person I can no longer imagine my life without.

I never imagined that a small crush would turn into a love this deep. Back then, I never thought we would end up together, and when I think about it today, I still wonder how everything happened. Sometimes I think about the day I sent you that first message. If I hadn't texted you, I don't know whether we would have ever gotten the chance to know each other the way we do now. One small message changed everything.

I love you in every universe, in every version of life, no matter who you are or where we are.

We've had our share of small fights—the silly arguments that I often started because of my overthinking. Yet you always handled them with so much patience. Thank you for that, and thank you for putting up with my endless drama.

And then there's your teasing, which I always pretend to dislike. But honestly, it has become one of those little things that makes our conversations feel like home.

There's one thing I've never really understood about myself. No matter how angry I am with you or how much I tell myself that I'll stay mad this time, I never can. It actually annoys me sometimes because I think I'll finally keep my anger, but then one simple message from you is enough to melt it all away. Somehow, all the anger disappears, and all I want is to talk to you again.

Even though we've met only five or six times, every single meeting has become a memory I hold close to my heart—the nervous excitement, the laughter, the quiet moments, and every little conversation that made me fall in love with you a little more. Those moments may have been few, but they mean more to me than I can ever put into words.

Distance hasn't been easy. There are days when I wish I could simply see you, talk to you face to face, or spend even the most ordinary moments with you. But no matter how many miles separate us, my heart always finds its way back to you. Distance may have changed where we are, but it has never changed how much I love you.

Thank you for being my comfort, my happiness, my safe place, and my favorite person. 
Happy Birthday once again, my love.

I love you today, tomorrow, and forever.

Forever yours❤️`;


// ==========================================================================
// BACKGROUND CANVAS ENGINE (DUST, SPARKLES, FIREFLIES, PETALS, FIREWORKS)
// ==========================================================================
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let fireworks = [];
let screenW = window.innerWidth;
let screenH = window.innerHeight;

function resizeCanvas() {
  screenW = window.innerWidth;
  screenH = window.innerHeight;
  canvas.width = screenW;
  canvas.height = screenH;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ambient Particle Types
class DustParticle {
  constructor() {
    this.reset();
    this.y = Math.random() * screenH;
  }
  reset() {
    this.x = Math.random() * screenW;
    this.y = screenH + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -10 || this.x < -10 || this.x > screenW + 10) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 249, 242, ${this.opacity})`;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#FFF9F2';
    ctx.fill();
    ctx.restore();
  }
}

class Sparkle {
  constructor() {
    this.x = Math.random() * screenW;
    this.y = Math.random() * screenH;
    this.size = Math.random() * 3 + 1;
    this.opacity = Math.random();
    this.fadeSpeed = Math.random() * 0.02 + 0.005;
    this.grow = true;
  }
  update() {
    if (this.grow) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 0.8) this.grow = false;
    } else {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0.05) {
        this.x = Math.random() * screenW;
        this.y = Math.random() * screenH;
        this.opacity = 0;
        this.grow = true;
      }
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(200, 169, 106, ${this.opacity})`; // Golden Gold Sparkle
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#C8A96A';
    
    // Draw star sparkle shape
    const r = this.size;
    ctx.moveTo(this.x, this.y - r);
    ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
    ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + r);
    ctx.quadraticCurveTo(this.x, this.y, this.x - r, this.y);
    ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - r);
    ctx.fill();
    ctx.restore();
  }
}

class Firefly {
  constructor() {
    this.x = Math.random() * screenW;
    this.y = Math.random() * screenH;
    this.size = Math.random() * 2.5 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.8 + 0.3;
    this.turnSpeed = Math.random() * 0.04 - 0.02;
    this.pulseAngle = Math.random() * Math.PI;
    this.opacity = 0.5;
  }
  update() {
    this.angle += this.turnSpeed;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.pulseAngle += 0.03;
    this.opacity = Math.sin(this.pulseAngle) * 0.4 + 0.4;
    
    if (this.x < -20) this.x = screenW + 20;
    if (this.x > screenW + 20) this.x = -20;
    if (this.y < -20) this.y = screenH + 20;
    if (this.y > screenH + 20) this.y = -20;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 169, 106, ${this.opacity})`; // warm yellow-gold glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD700';
    ctx.fill();
    ctx.restore();
  }
}

class RosePetal {
  constructor() {
    this.reset();
    this.y = Math.random() * screenH;
  }
  reset() {
    this.x = Math.random() * screenW;
    this.y = -20;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.02 - 0.01;
    this.opacity = Math.random() * 0.4 + 0.3;
    this.swing = Math.random() * 0.05 + 0.01;
    this.swingCount = Math.random() * 100;
  }
  update() {
    this.swingCount += this.swing;
    this.x += this.speedX + Math.sin(this.swingCount) * 0.4;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    
    if (this.y > screenH + 20 || this.x < -20 || this.x > screenW + 20) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    // Rose petal tear-drop shape
    ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
    
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    grad.addColorStop(0, `rgba(216, 167, 177, ${this.opacity})`); // Dusty Rose
    grad.addColorStop(1, `rgba(110, 44, 58, ${this.opacity})`);   // Burgundy border
    
    ctx.fillStyle = grad;
    ctx.shadowBlur = 2;
    ctx.shadowColor = '#6E2C3A';
    ctx.fill();
    ctx.restore();
  }
}

// Celebration Confetti
class Confetti {
  constructor() {
    this.x = Math.random() * screenW;
    this.y = Math.random() * -100 - 10;
    this.sizeWidth = Math.random() * 8 + 4;
    this.sizeHeight = Math.random() * 12 + 6;
    this.color = ['#D8A7B1', '#6E2C3A', '#C8A96A', '#FFF9F2', '#8B6B61'][Math.floor(Math.random() * 5)];
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * Math.PI;
    this.rotationSpeed = Math.random() * 0.05 - 0.025;
    this.opacity = 1;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    if (this.y > screenH) {
      this.opacity = 0; // mark for deletion
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.rect(-this.sizeWidth/2, -this.sizeHeight/2, this.sizeWidth, this.sizeHeight);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();
  }
}

// Celebration Fireworks
class Firework {
  constructor(x, y) {
    this.x = x || Math.random() * screenW;
    this.y = y || Math.random() * (screenH * 0.5);
    this.sparks = [];
    this.sparkCount = Math.random() * 40 + 30;
    this.color = ['#D8A7B1', '#C8A96A', '#FFF9F2', '#FFD700'][Math.floor(Math.random() * 4)];
    
    for (let i = 0; i < this.sparkCount; i++) {
      const angle = (Math.PI * 2 / this.sparkCount) * i + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 5 + 2;
      this.sparks.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
  }
  update() {
    let alive = false;
    this.sparks.forEach(spark => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.05; // gravity
      spark.opacity -= spark.decay;
      if (spark.opacity > 0) alive = true;
    });
    return alive;
  }
  draw() {
    this.sparks.forEach(spark => {
      if (spark.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = spark.opacity;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    });
  }
}

// Initialize particles list
function initParticles() {
  for (let i = 0; i < 40; i++) particles.push(new DustParticle());
  for (let i = 0; i < 15; i++) particles.push(new Sparkle());
  for (let i = 0; i < 15; i++) particles.push(new Firefly());
  for (let i = 0; i < 15; i++) particles.push(new RosePetal());
}

// Trigger explosions during wish celebration
function launchCelebrationParticles() {
  // Add confetti particles
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      particles.push(new Confetti());
    }, Math.random() * 1500);
  }
  
  // Launch several fireworks
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      fireworks.push(new Firework(
        Math.random() * (screenW * 0.6) + (screenW * 0.2), 
        Math.random() * (screenH * 0.4) + (screenH * 0.1)
      ));
    }, i * 400);
  }
}

// Global Animation Frame Loop
function animate() {
  ctx.clearRect(0, 0, screenW, screenH);
  
  // Update & Draw Ambient/Confetti Particles
  particles.forEach((p, idx) => {
    p.update();
    p.draw();
    // delete faded confetti
    if (p instanceof Confetti && p.opacity <= 0) {
      particles.splice(idx, 1);
    }
  });
  
  // Update & Draw Fireworks
  fireworks.forEach((fw, idx) => {
    const alive = fw.update();
    if (alive) {
      fw.draw();
    } else {
      fireworks.splice(idx, 1);
    }
  });
  
  requestAnimationFrame(animate);
}

// ==========================================================================
// AUDIO SYSTEM (MP3 + SYNTHESIZER FALLBACK)
// ==========================================================================
const bgAudio = document.getElementById('bg-music');

// Volume controls binding
const volumeSlider = document.getElementById('volume-slider');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');
const playerStatusText = document.getElementById('player-status-text');

// Primary attempt: Load MP3.
bgAudio.volume = volumeSlider.value;

// If MP3 fails or is not found, fallback to Synthesizer mode.
bgAudio.addEventListener('error', () => {
  console.warn("Local MP3 file missing or failed to load. Falling back to real-time Web Audio Synthesizer.");
  state.musicMode = 'synth';
  playerStatusText.textContent = "Ambient Synthesizer Fallback";
});

bgAudio.addEventListener('canplaythrough', () => {
  state.musicMode = 'mp3';
  playerStatusText.textContent = "Playing: Custom MP3 Track";
});

// Retro Synthesizer Engine
function initSynthesizer() {
  if (state.audioCtx) return;
  
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  state.audioCtx = new AudioCtxClass();
  
  // Master gain node linked to the Volume slider
  state.masterGain = state.audioCtx.createGain();
  state.masterGain.gain.setValueAtTime(volumeSlider.value * 0.6, state.audioCtx.currentTime); // scale down slightly for safety
  state.masterGain.connect(state.audioCtx.destination);
}

// Schedule notes for a warm piano arpeggio chord progression
function playPianoNote(freq, duration) {
  if (!state.audioCtx || state.audioCtx.state === 'suspended') return;
  
  const now = state.audioCtx.currentTime;
  
  const osc1 = state.audioCtx.createOscillator();
  const osc2 = state.audioCtx.createOscillator();
  const noteGain = state.audioCtx.createGain();
  
  // Low-pass filter to give notes a cozy, warm, and dark acoustic felt piano flavor
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + duration);
  
  osc1.type = 'sine';
  osc2.type = 'triangle';
  
  osc1.frequency.setValueAtTime(freq, now);
  osc2.frequency.setValueAtTime(freq * 2, now); // soft octave overtone
  
  // Envelope shape: fast attack, warm sustain, long decay
  noteGain.gain.setValueAtTime(0, now);
  noteGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
  noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  // Blend overtone softly
  const overtoneGain = state.audioCtx.createGain();
  overtoneGain.gain.setValueAtTime(0.02, now);
  osc2.connect(overtoneGain);
  
  osc1.connect(noteGain);
  overtoneGain.connect(noteGain);
  
  noteGain.connect(filter);
  filter.connect(state.masterGain);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.1);
  osc2.stop(now + duration + 0.1);
}

// Scheduler arpeggiator engine (Gmaj7 - Cmaj7 - Em7 - D6)
function playSequencerStep() {
  // 60 BPM -> 1 beat every 1.0 second. Loop arpeggios.
  const chordIndex = Math.floor(state.synthBeatCount / 4) % 4;
  const beatOfChord = state.synthBeatCount % 4;
  
  // Define MIDI note frequencies
  const chords = [
    // Gmaj7 (G2: 98, D3: 146.83, F#3: 185, B3: 246.94)
    [98.00, 146.83, 185.00, 246.94],
    // Cmaj7 (C3: 130.81, G3: 196, B3: 246.94, E4: 329.63)
    [130.81, 196.00, 246.94, 329.63],
    // Em7 (E2: 82.41, B3: 246.94, D4: 293.66, G4: 392)
    [82.41, 246.94, 293.66, 392.00],
    // D6 (D3: 146.83, A3: 220, B3: 246.94, F#4: 369.99)
    [146.83, 220.00, 246.94, 369.99]
  ];
  
  const activeChord = chords[chordIndex];
  const noteToPlay = activeChord[beatOfChord];
  
  // Accent the base root on beat 0
  const duration = beatOfChord === 0 ? 3.8 : 1.8;
  playPianoNote(noteToPlay, duration);
  
  state.synthBeatCount++;
}

function startSynthLoop() {
  if (state.synthLoopId) clearInterval(state.synthLoopId);
  // Schedule first beat immediately
  playSequencerStep();
  state.synthLoopId = setInterval(playSequencerStep, 1000); // 1 beat per second
}

function stopSynthLoop() {
  if (state.synthLoopId) {
    clearInterval(state.synthLoopId);
    state.synthLoopId = null;
  }
}

// Sound effects generators
function playSFXBlow() {
  if (!state.audioCtx) return;
  const now = state.audioCtx.currentTime;
  const bufferSize = state.audioCtx.sampleRate * 0.5;
  const buffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000, now);
  filter.frequency.exponentialRampToValueAtTime(150, now + 0.5);
  
  const noiseGain = state.audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.4, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(state.masterGain);
  noise.start(now);
}

function playSFXCelebration() {
  if (!state.audioCtx) return;
  // High pitches wind chime melody
  const frequencies = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
  frequencies.forEach((freq, idx) => {
    const time = state.audioCtx.currentTime + idx * 0.06;
    const osc = state.audioCtx.createOscillator();
    const chimeGain = state.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    chimeGain.gain.setValueAtTime(0, time);
    chimeGain.gain.linearRampToValueAtTime(0.12, time + 0.01);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
    
    osc.connect(chimeGain);
    chimeGain.connect(state.masterGain);
    
    osc.start(time);
    osc.stop(time + 1.6);
  });
}

function playSFXScratch() {
  if (!state.audioCtx || Math.random() > 0.3) return; // play sometimes, not every letter to avoid annoyance
  const now = state.audioCtx.currentTime;
  const bufferSize = state.audioCtx.sampleRate * 0.03;
  const buffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(6000, now);
  
  const noiseGain = state.audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.01, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(state.masterGain);
  noise.start(now);
}

function playSFXStamp() {
  if (!state.audioCtx) return;
  const now = state.audioCtx.currentTime;
  
  const osc = state.audioCtx.createOscillator();
  const stampGain = state.audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(20, now + 0.25);
  
  stampGain.gain.setValueAtTime(0, now);
  stampGain.gain.linearRampToValueAtTime(0.6, now + 0.01);
  stampGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
  osc.connect(stampGain);
  stampGain.connect(state.masterGain);
  osc.start(now);
  osc.stop(now + 0.3);
}

// Master music playback toggles
function playMusic() {
  state.musicPlaying = true;
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  
  if (state.musicMode === 'mp3') {
    bgAudio.play().catch(e => {
      console.warn("Audio autoplay blocked or failed, using SynthFallback:", e);
      fallbackToSynthPlayback();
    });
  } else {
    initSynthesizer();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    startSynthLoop();
  }
}

function pauseMusic() {
  state.musicPlaying = false;
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  
  if (state.musicMode === 'mp3') {
    bgAudio.pause();
  } else {
    stopSynthLoop();
  }
}

function fallbackToSynthPlayback() {
  state.musicMode = 'synth';
  playerStatusText.textContent = "Ambient Synthesizer Fallback";
  initSynthesizer();
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  startSynthLoop();
}

// Music Player Events
playPauseBtn.addEventListener('click', () => {
  if (state.musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

volumeSlider.addEventListener('input', (e) => {
  const vol = parseFloat(e.target.value);
  bgAudio.volume = vol;
  if (state.masterGain) {
    state.masterGain.gain.setValueAtTime(vol * 0.6, state.audioCtx.currentTime);
  }
});


// ==========================================================================
// SCROLL/PAGE TURN TRANSITIONS & SPA ROUTER
// ==========================================================================
const scrapbook = document.getElementById('scrapbook');

function flipToPage(pageNum) {
  const currentPage = document.getElementById(`p${state.activePage}`);
  
  if (pageNum > state.activePage) {
    // Turn page forward
    currentPage.classList.add('flipped');
    currentPage.classList.remove('active');
    
    state.activePage = pageNum;
    const nextPage = document.getElementById(`p${state.activePage}`);
    nextPage.classList.add('active');
    
    // Page load action hooks
    onPageLoadHook(pageNum);
  }
}

function onPageLoadHook(pageId) {
  if (pageId === 5) {
    // Start handwriting letter
    setTimeout(startLetterWriting, 1500);
  }
  if (pageId === 6) {
    // Scrapbook back page flips. Wait for animation to finish then close and open outro
    setTimeout(() => {
      // Slow fade of scrapbook book container
      const bookContainer = document.querySelector('.book-container');
      const musicPlayer = document.getElementById('music-player');
      
      bookContainer.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
      bookContainer.style.opacity = '0';
      bookContainer.style.transform = 'scale(0.95)';
      
      // Reveal final full-screen romantic outro stage
      const outroStage = document.getElementById('outro-stage');
      outroStage.classList.remove('hidden');
      outroStage.style.opacity = '0';
      setTimeout(() => {
        outroStage.style.opacity = '1';
      }, 50);
      
    }, 2000);
  }
}

// Navigation Actions
document.getElementById('to-p3').addEventListener('click', () => flipToPage(3));
document.getElementById('to-p4').addEventListener('click', () => flipToPage(4));
document.getElementById('to-p5').addEventListener('click', () => flipToPage(5));
document.getElementById('to-p6').addEventListener('click', () => flipToPage(6));

// Cover Page Gift Box Opening
document.getElementById('gift-trigger').addEventListener('click', () => {
  // Start music
  initSynthesizer();
  playMusic();
  
  // Open album cover
  flipToPage(2);
});


// ==========================================================================
// PAGE 3: BIRTHDAY CAKE CANDLES BLOW INTERACTION
// ==========================================================================
const candles = document.querySelectorAll('.candle');
const manualBlowBtn = document.getElementById('manual-blow-btn');
const celebrationMsg = document.getElementById('celebration-msg');
const wishInstructions = document.querySelector('.wish-instructions');
const wishControls = document.querySelector('.wish-controls');
const micStatusMsg = document.getElementById('mic-status-msg');

// Blow candles helper
function extinguishCandles() {
  if (state.candlesBlown) return;
  state.candlesBlown = true;
  
  // Play blowing sound
  playSFXBlow();
  
  // Blow candles out with staggered timing
  candles.forEach((c, idx) => {
    setTimeout(() => {
      c.classList.add('blown-out');
      c.classList.remove('active');
    }, idx * 250);
  });
  
  setTimeout(() => {
    // Show sparkles, fireworks, celebration sound
    playSFXCelebration();
    launchCelebrationParticles();
    
    // Animate Cake glowing
    document.querySelector('.cake').style.animation = 'glow-soft 1.5s infinite alternate';
    
    // Hide instructions and show happy birthday layout
    wishInstructions.style.display = 'none';
    wishControls.style.display = 'none';
    celebrationMsg.classList.remove('hidden');
    
    // Release mic if loaded
    stopMicrophoneListening();
  }, 900);
}

// Manual Blow Button Click
manualBlowBtn.addEventListener('click', extinguishCandles);

// Microphone Blow Detection Setup
function setupMicrophoneListening() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    micStatusMsg.innerHTML = "<span>Microphone not supported on this browser</span>";
    return;
  }
  
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      state.microphoneAllowed = true;
      state.micStream = stream;
      
      initSynthesizer(); // Ensure AudioCtx exists
      
      const source = state.audioCtx.createMediaStreamSource(stream);
      state.micAnalyser = state.audioCtx.createAnalyser();
      state.micAnalyser.fftSize = 512;
      
      source.connect(state.micAnalyser);
      
      // Monitor frequency amplitudes
      const bufferLength = state.micAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      function checkBlowing() {
        if (state.candlesBlown) return;
        state.micAnalyser.getByteFrequencyData(dataArray);
        
        // Blow noise has high amplitude energy across middle-high bands (1kHz - 4kHz, index 10 to 40 roughly)
        let energySum = 0;
        for (let i = 10; i < 40; i++) {
          energySum += dataArray[i];
        }
        const avgEnergy = energySum / 30;
        
        // Threshold for blowing
        if (avgEnergy > 85) {
          extinguishCandles();
        } else {
          requestAnimationFrame(checkBlowing);
        }
      }
      checkBlowing();
    })
    .catch(err => {
      console.warn("Microphone access denied: Using manual blow fallback.", err);
      micStatusMsg.innerHTML = "<span>Using manual blowing (Mic denied)</span>";
    });
}

function stopMicrophoneListening() {
  if (state.micStream) {
    state.micStream.getTracks().forEach(track => track.stop());
    state.micStream = null;
  }
}

// Start micro listening once page 3 becomes active
const observer = new MutationObserver(() => {
  const p3 = document.getElementById('p3');
  if (p3.classList.contains('active') && !state.candlesBlown && !state.micStream) {
    setupMicrophoneListening();
  }
});
observer.observe(document.getElementById('p3'), { attributes: true });


// ==========================================================================
// PAGE 4: PORTFOLIO MEMORIES LIGHTBOX STAGE
// ==========================================================================
const lightbox = document.getElementById('lightbox');
const lightboxPhotoContent = document.getElementById('lightbox-photo-content');
const lightboxNote = document.getElementById('lightbox-note');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

document.querySelectorAll('.polaroid-item').forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.getAttribute('data-index')) - 1;
    
    // Render the actual local image inside the lightbox
    lightboxPhotoContent.innerHTML = '<img src="photo' + (idx + 1) + '.jpg" alt="Memory ' + (idx + 1) + '" style="width:100%; height:100%; object-fit:contain;">';
    
    // Update caption note
    lightboxNote.textContent = state.lightboxImages[idx];
    
    // Open Lightbox with animation
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightboxCloseBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
}


// ==========================================================================
// PAGE 5: HANDWRITTEN LETTER TYPING ENGINE
// ==========================================================================
const letterEl = document.getElementById('letter-content');
const waxSealArea = document.getElementById('wax-seal-area');
const waxSealTrigger = document.getElementById('wax-seal-trigger');
const letterFooterBtn = document.getElementById('letter-footer-btn');

let letterCharIndex = 0;
let typingTimeoutId = null;

function startLetterWriting() {
  if (state.letterStarted) return;
  state.letterStarted = true;
  
  initSynthesizer(); // Ensure AudioCtx for scratch sounds
  typeChar();
}

function typeChar() {
  if (letterCharIndex < letterText.length) {
    const currentChar = letterText.charAt(letterCharIndex);
    
    // Type characters. Parse basic HTML tags (like <strong>, </strong>, <br>) inline
    if (currentChar === '<') {
      const closingIndex = letterText.indexOf('>', letterCharIndex);
      if (closingIndex !== -1) {
        letterEl.innerHTML += letterText.slice(letterCharIndex, closingIndex + 1);
        letterCharIndex = closingIndex + 1;
      }
    } else {
      letterEl.innerHTML += currentChar;
      letterCharIndex++;
      
      // Play a soft pencil scratch sounds intermittently
      playSFXScratch();
    }
    
    // Scroll journal downward automatically
    const letterScrollWrap = document.querySelector('.letter-scroll-wrapper');
    letterScrollWrap.scrollTop = letterScrollWrap.scrollHeight;
    
    // Stagger character timings dynamically (longer pauses for punctuation)
    let delay = 22;
    if (['.', '!', '?'].includes(currentChar)) {
      delay = 350;
    } else if ([',', '—', '❤️'].includes(currentChar)) {
      delay = 180;
    }
    
    typingTimeoutId = setTimeout(typeChar, delay);
  } else {
    // Complete letter writing
    state.letterCompleted = true;
    
    // Reveal Wax Seal Container
    waxSealArea.classList.remove('hidden');
    const letterScrollWrap = document.querySelector('.letter-scroll-wrapper');
    letterScrollWrap.scrollTop = letterScrollWrap.scrollHeight;
  }
}

// Click Wax Seal
waxSealTrigger.addEventListener('click', () => {
  if (state.waxSealStamped) return;
  state.waxSealStamped = true;
  
  // Animate stamp effect
  waxSealTrigger.classList.add('stamped');
  
  // Play stamp thud sound
  playSFXStamp();
  
  // Reveal footer next button
  setTimeout(() => {
    document.querySelector('.wax-seal-instruction').textContent = "Sealed with Love ❤️";
    letterFooterBtn.classList.remove('hidden');
    
    const letterScrollWrap = document.querySelector('.letter-scroll-wrapper');
    letterScrollWrap.scrollTop = letterScrollWrap.scrollHeight;
  }, 600);
});


// ==========================================================================
// INITIAL LOADING STAGE
// ==========================================================================
window.addEventListener('load', () => {
  initParticles();
  animate();
  
  // Simulate memory album loading
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('app');
    
    loadingScreen.classList.add('fade-out');
    mainApp.classList.remove('hidden');
    state.isLoaded = true;
    
    setTimeout(() => {
      loadingScreen.remove();
    }, 1000);
    
  }, 3500);
});
