/* Weather Dashboard Enhancements */

/* Additional CSS for 3D Loader, Particles, and Waves */
const enhancedStyles = `
/* 3D Loader Animations */
@keyframes rotate3d {
    0% { transform: rotateZ(0deg) rotateY(0deg); }
    50% { transform: rotateZ(180deg) rotateY(180deg); }
    100% { transform: rotateZ(360deg) rotateY(360deg); }
}

@keyframes pulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 
            0 0 40px rgba(255, 107, 53, 0.6),
            0 0 80px rgba(255, 107, 53, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.3);
    }
    50% {
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 
            0 0 60px rgba(255, 107, 53, 0.8),
            0 0 100px rgba(255, 107, 53, 0.6),
            inset 0 0 30px rgba(255, 255, 255, 0.5);
    }
}
@keyframes fadeInOut {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

@keyframes float {
    0% {
        transform: translateY(100vh) translateX(0) scale(0);
        opacity: 0;
    }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% {
        transform: translateY(-100vh) translateX(var(--float-x)) scale(1);
        opacity: 0;
    }
}

@keyframes waveMove {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(30px, -50px) rotate(120deg);
    }
    66% {
        transform: translate(-20px, 20px) rotate(240deg);
    }
}
`;

// Inject the enhanced styles
const styleSheet = document.createElement("style");
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Create and inject 3D Page Loader
const pageLoader = `
<div class="page-loader" id="pageLoader">
    <div class="loader-3d">
        <div class="sun-core"></div>
        <div class="sun-rays">
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
        </div>
    </div>
    <div class="loader-text">LOADING WEATHER PULSE</div>
</div>
`;

// Create and inject Wave Background
const waveBackground = `
<div class="wave-background">
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
</div>
`;

// Create and inject Particles Container
const particlesContainer = `<div class="particles-container" id="particlesContainer"></div>`;

// Add all elements to the body
document.body.insertAdjacentHTML('afterbegin', pageLoader + waveBackground + particlesContainer);

// Create floating particles
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `-${Math.random() * 20}px`;

        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--float-x', `${drift}px`);

        // Random animation duration between 15s and 30s
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;

        // Random delay
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}

// Hide page loader after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 2000); // Show loader for 2 seconds
});

// Initialize particles
createParticles();

console.log('✨ Weather Dashboard enhancements loaded!');
