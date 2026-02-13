// From original document - keeping all existing JavaScript functionality
// ===== GLOBAL STATE =====
let currentPage = 1;
let gameStats = {
    moves: 0,
    matched: 0
};
let photosViewed = 0;
const totalPhotos = 3;

// ===== INITIALIZATION =====
window.onload = function() {
    createGarden();
    createFloatingParticles();
    updateProgress();
};

// ===== GARDEN ANIMATION =====
function createGarden() {
    const garden = document.getElementById('garden');
    const flowerCount = window.innerWidth < 768 ? 8 : 15;
    
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        const stemHeight = Math.floor(Math.random() * 50) + 60;
        const delay = i * 200;
        
        // Create chrysanthemum with multiple layers of petals (no center)
        let petalLayers = '';
        const colors = ['#FFC2D1', '#FFB3C6', '#FF9EC0', '#FFA8D5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Layer 1: Outer petals (16 petals)
        petalLayers += `<div class="petal-layer layer-outer">`;
        for (let j = 0; j < 16; j++) {
            const angle = (360 / 16) * j;
            petalLayers += `<div class="chrysanthemum-petal outer" style="--angle: ${angle}deg; --color: ${randomColor}"></div>`;
        }
        petalLayers += `</div>`;
        
        // Layer 2: Middle petals (12 petals)
        petalLayers += `<div class="petal-layer layer-middle">`;
        for (let j = 0; j < 12; j++) {
            const angle = (360 / 12) * j;
            petalLayers += `<div class="chrysanthemum-petal middle" style="--angle: ${angle}deg; --color: ${randomColor}"></div>`;
        }
        petalLayers += `</div>`;
        
        // Layer 3: Inner petals (8 petals)
        petalLayers += `<div class="petal-layer layer-inner">`;
        for (let j = 0; j < 8; j++) {
            const angle = (360 / 8) * j;
            petalLayers += `<div class="chrysanthemum-petal inner" style="--angle: ${angle}deg; --color: ${randomColor}"></div>`;
        }
        petalLayers += `</div>`;
        
        flower.innerHTML = `
            <div class="petal-wrap" id="wrap-${i}">
                ${petalLayers}
            </div>
            <div class="stem" id="stem-${i}" style="height:0px"></div>
        `;
        
        garden.appendChild(flower);
        
        // Animate stem growth
        setTimeout(() => {
            const stem = document.getElementById(`stem-${i}`);
            stem.style.height = stemHeight + 'px';
            
            // Bloom petals after stem grows
            setTimeout(() => {
                const wrap = document.getElementById(`wrap-${i}`);
                wrap.style.display = 'flex';
                
                // Animate each layer with delay
                const layers = wrap.querySelectorAll('.petal-layer');
                layers.forEach((layer, layerIndex) => {
                    setTimeout(() => {
                        const petals = layer.querySelectorAll('.chrysanthemum-petal');
                        petals.forEach((petal, petalIndex) => {
                            setTimeout(() => {
                                petal.style.opacity = '1';
                                petal.style.transform = `rotate(var(--angle)) translateY(-5px) scale(1)`;
                            }, petalIndex * 30);
                        });
                    }, layerIndex * 200);
                });
            }, 800);
        }, delay);
    }
}

// ===== FLOATING PARTICLES =====
function createFloatingParticles() {
    const container = document.querySelector('.particle-container');
    const particles = ['💚', '🍵', '✨', '🌸', '💕'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.position = 'absolute';
        particle.style.fontSize = '20px';
        particle.style.opacity = '0';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `floatHeart ${10 + Math.random() * 10}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// ===== PROGRESS BAR =====
function updateProgress() {
    const fill = document.getElementById('progressFill');
    const progress = (currentPage / 8) * 100;
    fill.style.width = progress + '%';
}

// ===== PAGE NAVIGATION =====
function nextPage(pageNum) {
    // Remove active class from current page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Add active class to new page
    const nextPageElement = document.getElementById('page' + pageNum);
    nextPageElement.classList.add('active');
    
    // Update current page
    currentPage = pageNum;
    updateProgress();
    
    // Reset photo counter when entering page 2
    if (pageNum === 2) {
        photosViewed = 0;
        updatePhotoCount();
        document.getElementById('photoNextBtn').classList.add('hidden');
        document.querySelectorAll('.clickable-photo').forEach(photo => {
            photo.classList.remove('viewed');
        });
    }
    
    // Initialize specific page features
    if (pageNum === 3) {
        setTimeout(() => initMemoryGame(), 300);
    }
    
    // Reset scroll positions immediately so page always starts at top
    try {
        // Page element (for its own overflow)
        nextPageElement.scrollTop = 0;
    } catch (e) {}
    // Document scroll (cross-browser)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Then perform a smooth window scroll for a nicer transition
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

// ===== PHOTO VIEWING =====
function viewPhoto(photoElement) {
    // Check if already viewed
    if (photoElement.classList.contains('viewed')) {
        return;
    }
    
    // Mark as viewed
    photoElement.classList.add('viewed');
    photosViewed++;
    
    // Update counter
    updatePhotoCount();
    
    // Add a fun animation
    photoElement.style.animation = 'none';
    setTimeout(() => {
        photoElement.style.animation = '';
    }, 10);
    
    // Check if all photos viewed
    if (photosViewed === totalPhotos) {
        setTimeout(() => {
            document.getElementById('photoNextBtn').classList.remove('hidden');
            // Animate button entrance
            const btn = document.getElementById('photoNextBtn');
            btn.style.animation = 'successSlide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 500);
    }
}

function updatePhotoCount() {
    const counter = document.getElementById('photoCount');
    if (counter) {
        counter.textContent = photosViewed;
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
}

// ===== MEMORY GAME (8 CARDS) =====
const gameIcons = ['🪄', '🪄', '💚', '💚', '🍀', '🍀', '🕊️', '🕊️'];

function initMemoryGame() {
    const grid = document.getElementById('memory-game');
    grid.innerHTML = '';
    
    // Reset stats
    gameStats.moves = 0;
    gameStats.matched = 0;
    updateGameStats();
    
    let flippedCards = [];
    let lockBoard = false;
    
    // Shuffle icons
    const shuffled = [...gameIcons].sort(() => Math.random() - 0.5);
    
    // Create cards
    shuffled.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'card-slot';
        card.dataset.icon = icon;
        card.dataset.index = index;
        
        card.onclick = function() {
            if (lockBoard) return;
            if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;
            
            // Flip card
            this.classList.add('flipped');
            this.textContent = icon;
            flippedCards.push(this);
            
            // Check for match
            if (flippedCards.length === 2) {
                lockBoard = true;
                gameStats.moves++;
                updateGameStats();
                
                const [card1, card2] = flippedCards;
                
                if (card1.dataset.icon === card2.dataset.icon) {
                    // Match found!
                    setTimeout(() => {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        
                        gameStats.matched += 2;
                        updateGameStats();
                        
                        flippedCards = [];
                        lockBoard = false;
                        
                        // Check if game is complete
                        if (gameStats.matched === gameIcons.length) {
                            setTimeout(() => {
                                showGameSuccess();
                            }, 500);
                        }
                    }, 600);
                } else {
                    // No match
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        card1.textContent = '';
                        card2.textContent = '';
                        flippedCards = [];
                        lockBoard = false;
                    }, 1000);
                }
            }
        };
        
        // Add card with animation delay
        setTimeout(() => {
            grid.appendChild(card);
            card.style.animation = 'cardEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        }, index * 100);
    });
}

function updateGameStats() {
    document.getElementById('moveCount').textContent = gameStats.moves;
    document.getElementById('matchCount').textContent = `${gameStats.matched / 2}/4`;
}

function showGameSuccess() {
    const successDiv = document.getElementById('gameSuccess');
    successDiv.classList.remove('hidden');
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
        nextPage(4);
    }, 2000);
}

// ===== ENVELOPE / LETTER =====
function openLetter(envelope) {
    if (envelope.classList.contains('open')) return;
    
    envelope.classList.add('open');
    
    // Show next button after letter opens
    setTimeout(() => {
        document.getElementById('letterNext').classList.remove('hidden');
    }, 1000);
}

// ===== VALENTINE PROPOSAL =====
let noButtonMoves = 0;

function moveNo() {
    const btn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    
    noButtonMoves++;
    
    // Make "No" button move around but stay in bounds
    const buttonWidth = 100;
    const buttonHeight = 50;
    const padding = 20;
    
    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;
    const minX = padding;
    const minY = padding;
    
    btn.style.position = 'fixed';
    btn.style.left = (Math.random() * (maxX - minX) + minX) + 'px';
    btn.style.top = (Math.random() * (maxY - minY) + minY) + 'px';
    btn.style.zIndex = '9999';
    
    // Make "Yes" button bigger each time
    const currentSize = 1 + (noButtonMoves * 0.1);
    yesBtn.style.transform = `scale(${currentSize})`;
}

function celebrate() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const success = document.getElementById('success');
    
    // Hide buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';

    // Hide the question text and proposal image
    const question = document.querySelector('.proposal-question-new');
    if (question) question.style.display = 'none';
    const proposalImg = document.querySelector('.proposal-content img');
    if (proposalImg) proposalImg.style.display = 'none';

    // Show success message
    success.classList.remove('hidden');
    
    // Change background to match theme
    const finalPage = document.querySelector('.final-page-new');
    if (finalPage) {
        finalPage.style.background = 'linear-gradient(135deg, #C5E063 0%, #A4C639 50%, #8AAF2A 100%)';
        finalPage.style.transition = 'background 1.5s ease';
    }
    
    // Create confetti
    createConfetti();
    
    // Create fireworks effect
    createFireworks();
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#A4C639', '#FFB6C1', '#FFC2D1', '#87CEEB', '#FFD700', '#FF69B4', '#C5E063', '#B0E0E6'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.zIndex = '9999';
        
        container.appendChild(confetti);
        
        // Animate confetti falling
        const duration = 2000 + Math.random() * 2000;
        const tx = (Math.random() - 0.5) * 300;
        
        confetti.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight}px) translateX(${tx}px) rotate(${360 + Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }
}

// ===== FIREWORKS EFFECT =====
function createFireworks() {
    const colors = ['#A4C639', '#FFB6C1', '#FFC2D1', '#FFD700', '#FF69B4', '#87CEEB', '#C5E063'];
    
    function createFirework() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.5);
        
        for (let i = 0; i < 40; i++) {
            const spark = document.createElement('div');
            spark.style.position = 'fixed';
            spark.style.width = '6px';
            spark.style.height = '6px';
            spark.style.borderRadius = '50%';
            spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            spark.style.pointerEvents = 'none';
            spark.style.zIndex = '10000';
            spark.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
            
            document.body.appendChild(spark);
            
            const angle = (Math.PI * 2 * i) / 40;
            const velocity = 120 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            spark.animate([
                { 
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                { 
                    transform: `translate(${tx}px, ${ty}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1200 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
            
            setTimeout(() => spark.remove(), 1800);
        }
    }
    
    // Create multiple fireworks
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createFirework(), i * 400);
    }
    
    // Continue creating fireworks every 2 seconds
    const fireworkInterval = setInterval(() => {
        createFirework();
    }, 2000);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(fireworkInterval);
    }, 10000);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' && currentPage < 8) {
        nextPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        nextPage(currentPage - 1);
    }
});

// ===== CSS KEYFRAME INJECTION FOR BLOOM =====
const style = document.createElement('style');
style.textContent = `
    @keyframes bloom {
        from {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(var(--rotation, 0deg));
            opacity: 1;
        }
    }
    
    @keyframes cardEntry {
        from {
            opacity: 0;
            transform: rotateY(90deg) scale(0.8);
        }
        to {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
        }
    }
    
    @keyframes celebrationSpin {
        0%, 100% {
            transform: rotate(0deg) scale(1);
        }
        50% {
            transform: rotate(180deg) scale(1.3);
        }
    }
`;
document.head.appendChild(style);

// ===== EASTER EGG: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-8);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Secret surprise!
        alert('🍵 Secret unlocked: You found our hidden matcha moment! 💚');
        createSpecialEffect();
    }
});

function createSpecialEffect() {
    const matcha = document.createElement('div');
    matcha.textContent = '🍵';
    matcha.style.position = 'fixed';
    matcha.style.fontSize = '100px';
    matcha.style.left = '50%';
    matcha.style.top = '50%';
    matcha.style.transform = 'translate(-50%, -50%) scale(0)';
    matcha.style.zIndex = '99999';
    matcha.style.pointerEvents = 'none';
    document.body.appendChild(matcha);
    
    matcha.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1) rotate(360deg)', opacity: 1, offset: 0.5 },
        { transform: 'translate(-50%, -50%) scale(0) rotate(720deg)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    setTimeout(() => matcha.remove(), 2000);
}

function openLetter(envelope) {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    setTimeout(() => {
        // Change from 7 to 6.5
        document.getElementById('letterNext').setAttribute('onclick', 'nextPage("6-5")');
        document.getElementById('letterNext').classList.remove('hidden');
    }, 1000);
}

// ===== MATCHA CATCHER GAME LOGIC =====
let catcherScore = 0;
let catcherActive = false;
let spawnInterval;

function initCatcherGame() {
    catcherScore = 0;
    catcherActive = true;
    document.getElementById('catcher-score').textContent = `Caught Cats: 0/10`;
    document.getElementById('catcherSuccess').classList.add('hidden');
    
    const area = document.getElementById('catcher-area');
    const basket = document.getElementById('player-basket');

    // Mouse/Touch movement
    const moveHandler = (e) => {
        if (!catcherActive) return;
        let x;
        if (e.type === 'mousemove') {
            x = e.clientX - area.getBoundingClientRect().left;
        } else {
            x = e.touches[0].clientX - area.getBoundingClientRect().left;
        }
        
        // Keep basket in bounds
        if (x < 25) x = 25;
        if (x > area.offsetWidth - 25) x = area.offsetWidth - 25;
        basket.style.left = x + 'px';
    };

    area.addEventListener('mousemove', moveHandler);
    area.addEventListener('touchmove', moveHandler);

    // Spawn falling matcha cups
    spawnInterval = setInterval(() => {
        if (!catcherActive) return;
        createFallingItem();
    }, 800);
}

function createFallingItem() {
    const area = document.getElementById('catcher-area');
    const item = document.createElement('div');
    item.className = 'falling-item';
    const rand = Math.random();
    
    let fruitImage;
    if (rand > 0.67) {
        fruitImage = 'pic/cats1.gif';
    } else if (rand > 0.33) {
        fruitImage = 'pic/cats2.gif';
    } else {
        fruitImage = 'pic/cats3.gif';
    }
    
    const img = document.createElement('img');
    img.src = fruitImage;
    img.style.width = '70px';
    img.style.height = '70px';
    img.style.objectFit = 'contain';
    item.appendChild(img);
    
    let xPos = Math.random() * (area.offsetWidth - 40);
    item.style.left = xPos + 'px';
    item.style.top = '-50px';
    area.appendChild(item);

    let yPos = -50;
    const fallSpeed = 1 + Math.random() * 1;

    const fall = setInterval(() => {
        if (!catcherActive) {
            clearInterval(fall);
            item.remove();
            return;
        }

        yPos += fallSpeed;
        item.style.top = yPos + 'px';

        // Check Collision
        const basket = document.getElementById('player-basket');
        const basketRect = basket.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (
            itemRect.bottom >= basketRect.top &&
            itemRect.right >= basketRect.left &&
            itemRect.left <= basketRect.right &&
            itemRect.top <= basketRect.bottom
        ) {
            catcherScore++;
            document.getElementById('catcher-score').textContent = `Caught Cats: ${catcherScore}/10`;            item.remove();
            clearInterval(fall);
            
            if (catcherScore >= 10) {
                endCatcherGame();
            }
        }

        if (yPos > area.offsetHeight) {
            clearInterval(fall);
            item.remove();
        }
    }, 20);
}

function endCatcherGame() {
    catcherActive = false;
    clearInterval(spawnInterval);
    document.getElementById('catcherSuccess').classList.remove('hidden');
    
    setTimeout(() => {
        nextPage(7);
    }, 2000);
}

// Update your existing nextPage function logic to handle the string ID
const originalNextPage = nextPage;
nextPage = function(pageNum) {
    if (pageNum === "6-5") {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page6-5').classList.add('active');
        currentPage = 6.5; // Visual progress bar might need tweak or keep as is
        updateProgress();
        setTimeout(() => initCatcherGame(), 500);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Stop the catcher game if moving away
        catcherActive = false;
        clearInterval(spawnInterval);
        originalNextPage(pageNum);
    }

};
