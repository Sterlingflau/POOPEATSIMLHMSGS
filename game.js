// Game state
const gameState = {
    health: 100,
    energy: 100,
    poopEaten: 0,
    day: 1,
    isGameOver: false,
    achievements: [],
    currentPoopType: 'regular',
    stomachCapacity: 10,
    thoughtBubbleTimer: null,
    hasPlayerDiedOnce: false,
    hasPaid: false
};

// DOM elements
const healthEl = document.getElementById('health');
const energyEl = document.getElementById('energy');
const poopCountEl = document.getElementById('poop-count');
const dayEl = document.getElementById('day');
const gameLogEl = document.getElementById('game-log');

// Buttons
const eatPoopBtn = document.getElementById('eat-poop');
const sleepBtn = document.getElementById('sleep');
const exerciseBtn = document.getElementById('exercise');
const doctorBtn = document.getElementById('doctor');

// Add new DOM elements for character
const characterEl = document.getElementById('character');
const mouthEl = document.getElementById('mouth');
const leftEyeEl = document.getElementById('left-eye');
const rightEyeEl = document.getElementById('right-eye');
const stomachFillEl = document.getElementById('stomach-fill');
const sweat1El = document.getElementById('sweat1');
const sweat2El = document.getElementById('sweat2');
const characterStatusEl = document.getElementById('character-status');

// Add these new DOM elements
const poopAnimationContainer = document.getElementById('poop-animation-container');
const poopEmoji = document.getElementById('poop-emoji');
const poopPile = document.getElementById('poop-pile');

// Add this to your existing DOM elements
const toiletEl = document.getElementById('toilet');

// Add these new DOM elements
const achievementEl = document.getElementById('achievement');
const achievementTextEl = document.getElementById('achievement-text');
const gameOverScreenEl = document.getElementById('game-over-screen');
const gameOverTitleEl = document.getElementById('game-over-title');
const gameOverMessageEl = document.getElementById('game-over-message');
const restartButtonEl = document.getElementById('restart-button');
const thoughtBubbleEl = document.getElementById('thought-bubble');
const poopTypesEl = document.querySelectorAll('.poop-type');

// Add these new DOM elements
const paymentModalEl = document.getElementById('payment-modal');
const paymentButtonEl = document.getElementById('payment-button');

// Log message to game log
function logMessage(message) {
    const p = document.createElement('p');
    p.textContent = `Day ${gameState.day}: ${message}`;
    gameLogEl.appendChild(p);
    gameLogEl.scrollTop = gameLogEl.scrollHeight;
}

// Update UI
function updateUI() {
    healthEl.textContent = gameState.health;
    energyEl.textContent = gameState.energy;
    poopCountEl.textContent = gameState.poopEaten;
    dayEl.textContent = gameState.day;
    
    // Apply visual effects based on health
    if (gameState.health < 30) {
        healthEl.style.color = 'red';
    } else if (gameState.health < 60) {
        healthEl.style.color = 'orange';
    } else {
        healthEl.style.color = 'black';
    }
    
    // Update character appearance
    updateCharacter();
}

// Check if game is over
function checkGameOver() {
    if (gameState.health <= 0) {
        gameState.isGameOver = true;
        logMessage("GAME OVER! Your health reached zero. You couldn't handle the poop lifestyle.");
        disableButtons();
        
        // Show custom game over screen
        gameOverTitleEl.textContent = "You Died!";
        gameOverMessageEl.textContent = `Your unusual diet finally caught up with you. You managed to consume ${gameState.poopEaten} pieces of poop before your body gave up. Your doctor is both horrified and fascinated.`;
        gameOverScreenEl.style.display = 'flex';
        
        // Track that player has died
        gameState.hasPlayerDiedOnce = true;
        
    } else if (gameState.poopEaten >= 50) {
        gameState.isGameOver = true;
        logMessage("CONGRATULATIONS! You've become the ultimate poop consumer. You win...if you can call it that.");
        disableButtons();
        
        // Show custom game over screen
        gameOverTitleEl.textContent = "You've Ascended!";
        gameOverMessageEl.textContent = `After consuming ${gameState.poopEaten} pieces of poop, your body has evolved beyond normal human limitations. Scientists want to study you. Toilet paper companies fear you. You are the Poop Master now.`;
        gameOverScreenEl.style.display = 'flex';
    }
}

// Disable all buttons
function disableButtons() {
    eatPoopBtn.disabled = true;
    sleepBtn.disabled = true;
    exerciseBtn.disabled = true;
    doctorBtn.disabled = true;
}

// Random events
function randomEvent() {
    const events = [
        { message: "You found some premium poop behind the local pet store! The owner gives you a concerned look.", health: 5, energy: 5 },
        { message: "The poop you ate yesterday was contaminated. Your bathroom experience defies the laws of physics.", health: -15, energy: -10 },
        { message: "Your roommate walked in on you mid-snack. They're moving out tomorrow.", health: -5, energy: -5 },
        { message: "Your digestive system is evolving. You can now identify the animal source by taste alone.", health: 10, energy: 0 },
        { message: "You had vivid dreams about swimming in a sea of poop. You woke up hungry. That's concerning.", health: 0, energy: 5 },
        { message: "A fellow poop enthusiast shared their techniques with you. There's a whole underground community!", health: 8, energy: 8 },
        { message: "You tried to explain your diet to someone at a party. They called an exorcist.", health: -8, energy: -5 },
        { message: "Your body odor has changed. Dogs follow you everywhere now.", health: -5, energy: 0 },
        { message: "You've developed the ability to identify different types of fiber in your meals. What a skill!", health: 5, energy: 5 },
        { message: "A scientist wants to study you. You declined when you saw the collection jars.", health: 0, energy: -5 }
    ];
    
    // 40% chance of random event (increased for more fun)
    if (Math.random() < 0.4) {
        const event = events[Math.floor(Math.random() * events.length)];
        gameState.health = Math.min(100, Math.max(0, gameState.health + event.health));
        gameState.energy = Math.min(100, Math.max(0, gameState.energy + event.energy));
        logMessage(event.message);
    }
}

// End day
function endDay() {
    gameState.day++;
    gameState.energy = Math.max(0, gameState.energy - 10); // Natural energy loss
    
    if (gameState.energy < 20) {
        gameState.health = Math.max(0, gameState.health - 5);
        logMessage("You're exhausted. Your health is suffering from lack of energy.");
    }
    
    randomEvent();
    updateUI();
    checkGameOver();
}

// Add this function to animate eating
function animateEating() {
    return new Promise((resolve) => {
        // Show animation container
        poopAnimationContainer.style.display = 'block';
        
        // Get positions for animation
        const pileRect = poopPile.getBoundingClientRect();
        const mouthRect = mouthEl.getBoundingClientRect();
        
        // Position the poop emoji at the pile
        poopEmoji.style.left = `${pileRect.left}px`;
        poopEmoji.style.top = `${pileRect.top}px`;
        
        // Start animation sequence
        setTimeout(() => {
            // Open mouth - bigger for humor
            mouthEl.classList.add('big-bite');
            
            // Move poop to mouth
            poopEmoji.style.left = `${mouthRect.left + mouthRect.width/2 - 15}px`;
            poopEmoji.style.top = `${mouthRect.top + mouthRect.height/2 - 15}px`;
            poopEmoji.style.transform = 'scale(0.8) rotate(180deg)';
            
            // Add head shake if health is low
            if (gameState.health < 40) {
                characterEl.classList.add('shake-head');
                setTimeout(() => {
                    characterEl.classList.remove('shake-head');
                }, 500);
            }
            
            setTimeout(() => {
                // Close mouth and hide poop
                mouthEl.classList.remove('big-bite');
                poopEmoji.style.opacity = '0';
                
                // Add stomach fill animation class for smoother transition
                stomachFillEl.classList.add('stomach-fill-animation');
                
                // Make stomach gurgle
                const stomachEl = document.querySelector('.stomach');
                stomachEl.classList.add('stomach-gurgle');
                
                // Update stomach fill immediately for visual feedback
                const currentFill = parseFloat(stomachFillEl.style.height) || 0;
                const newFill = Math.min(100, currentFill + (100/50)); // 50 is max poop
                stomachFillEl.style.height = `${newFill}%`;
                
                // Expand stomach as it fills
                if (gameState.poopEaten > gameState.stomachCapacity) {
                    stomachEl.classList.add('stomach-expanded');
                    gameState.stomachCapacity += 5;
                    
                    // Sometimes make the stomach burst for comedy
                    if (Math.random() < 0.3) {
                        stomachEl.classList.add('stomach-burst');
                        createPoopParticles(stomachEl);
                        
                        setTimeout(() => {
                            stomachEl.classList.remove('stomach-burst');
                        }, 500);
                    }
                }
                
                // Apply effects based on poop type
                applyPoopTypeEffects();
                
                setTimeout(() => {
                    // Reset animation elements
                    poopAnimationContainer.style.display = 'none';
                    poopEmoji.style.opacity = '1';
                    poopEmoji.style.transform = 'scale(1)';
                    stomachFillEl.classList.remove('stomach-fill-animation');
                    stomachEl.classList.remove('stomach-gurgle');
                    
                    // Animation complete
                    resolve();
                }, 800);
            }, 1000);
        }, 300);
    });
}

// Create poop particles for burst effect
function createPoopParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'poop-particle';
        particle.textContent = '💩';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        
        // Position at center of stomach
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        document.body.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 2000);
    }
}

// Apply effects based on poop type
function applyPoopTypeEffects() {
    switch(gameState.currentPoopType) {
        case 'premium':
            // Premium poop is healthier
            gameState.health = Math.min(100, gameState.health + 5);
            gameState.energy = Math.min(100, gameState.energy + 5);
            showThoughtBubble("Mmm, premium quality!");
            break;
            
        case 'spicy':
            // Spicy poop hurts more but gives energy
            gameState.health = Math.max(0, gameState.health - 5);
            gameState.energy = Math.min(100, gameState.energy + 15);
            showThoughtBubble("AAAAH! IT BURNS!");
            
            // Visual effect for spicy
            characterEl.style.backgroundColor = '#ff6b6b';
            setTimeout(() => {
                if (gameState.health >= 60) {
                    characterEl.style.backgroundColor = '#f9d9c9';
                }
            }, 1500);
            break;
            
        default:
            // Regular poop, normal effects
            break;
    }
}

// Check for and unlock achievements
function checkAchievements() {
    const achievements = [
        { id: 'first-bite', condition: () => gameState.poopEaten >= 1, text: "First Bite" },
        { id: 'iron-stomach', condition: () => gameState.poopEaten >= 10, text: "Iron Stomach" },
        { id: 'poop-gourmet', condition: () => gameState.poopEaten >= 25, text: "Poop Gourmet" },
        { id: 'toilet-emergency', condition: () => gameState.health <= 20 && gameState.health > 0, text: "Toilet Emergency" },
        { id: 'variety-eater', condition: () => gameState.achievements.includes('tried-regular') && 
                                               gameState.achievements.includes('tried-premium') && 
                                               gameState.achievements.includes('tried-spicy'), 
                                               text: "Variety Eater" }
    ];
    
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition()) {
            gameState.achievements.push(achievement.id);
            showAchievement(achievement.text);
        }
    });
    
    // Track poop types tried
    if (gameState.currentPoopType && !gameState.achievements.includes(`tried-${gameState.currentPoopType}`)) {
        gameState.achievements.push(`tried-${gameState.currentPoopType}`);
    }
}

// Show achievement notification
function showAchievement(text) {
    achievementTextEl.textContent = text;
    achievementEl.style.display = 'block';
    
    // Add some animation
    achievementEl.style.animation = 'none';
    setTimeout(() => {
        achievementEl.style.animation = 'pulse 0.5s ease-in-out 2';
    }, 10);
    
    // Hide after a few seconds
    setTimeout(() => {
        achievementEl.style.display = 'none';
    }, 3000);
}

// Add poop variety selection
poopTypesEl.forEach(poopType => {
    poopType.addEventListener('click', () => {
        gameState.currentPoopType = poopType.dataset.type;
        poopEmoji.textContent = poopType.dataset.emoji;
        
        // Show a thought bubble
        showThoughtBubble(getPoopThought(gameState.currentPoopType));
    });
});

// Function to show thought bubble
function showThoughtBubble(text) {
    // Clear any existing timer
    if (gameState.thoughtBubbleTimer) {
        clearTimeout(gameState.thoughtBubbleTimer);
    }
    
    thoughtBubbleEl.textContent = text;
    thoughtBubbleEl.style.opacity = '1';
    
    // Position the bubble near the character's head
    const headRect = characterEl.getBoundingClientRect();
    thoughtBubbleEl.style.left = `${headRect.left}px`;
    thoughtBubbleEl.style.top = `${headRect.top - 70}px`;
    
    // Hide after a few seconds
    gameState.thoughtBubbleTimer = setTimeout(() => {
        thoughtBubbleEl.style.opacity = '0';
    }, 3000);
}

// Get a thought based on poop type
function getPoopThought(poopType) {
    const thoughts = {
        regular: [
            "Hmm, the classic variety...",
            "Nothing special, but it'll do",
            "The standard option"
        ],
        premium: [
            "Ooh, fancy poop!",
            "This looks high quality!",
            "The gourmet selection"
        ],
        spicy: [
            "This might burn later...",
            "Spicy going in AND out!",
            "My stomach's already burning"
        ]
    };
    
    return thoughts[poopType][Math.floor(Math.random() * thoughts[poopType].length)];
}

// Update character appearance based on game state
function updateCharacter() {
    // Update stomach fill based on poop eaten
    const fillPercentage = Math.min(100, (gameState.poopEaten / 50) * 100);
    stomachFillEl.style.height = `${fillPercentage}%`;
    
    // Update face based on health
    if (gameState.health < 20) {
        // Critically ill - purple/red face
        mouthEl.classList.add('sick-mouth');
        leftEyeEl.style.height = '2px';
        rightEyeEl.style.height = '2px';
        characterEl.style.backgroundColor = '#9a2f5c'; // Purple-red
        characterEl.style.animation = 'wobble 0.8s infinite';
        sweat1El.style.opacity = '1';
        sweat2El.style.opacity = '1';
        characterStatusEl.textContent = 'One bite away from the toilet... or the grave';
    } else if (gameState.health < 30) {
        // Very sick - reddish face
        mouthEl.classList.add('sick-mouth');
        leftEyeEl.style.height = '2px';
        rightEyeEl.style.height = '2px';
        characterEl.style.backgroundColor = '#e07070'; // Reddish
        characterEl.style.animation = 'wobble 1.5s infinite';
        sweat1El.style.opacity = '1';
        sweat2El.style.opacity = '1';
        characterStatusEl.textContent = 'Regretting every life decision that led to this moment';
    } else if (gameState.health < 60) {
        // Somewhat sick
        mouthEl.classList.add('sick-mouth');
        leftEyeEl.style.height = '8px';
        rightEyeEl.style.height = '8px';
        characterEl.style.backgroundColor = '#f0d0c0';
        characterEl.style.animation = '';
        sweat1El.style.opacity = '0.7';
        sweat2El.style.opacity = '0.7';
        characterStatusEl.textContent = 'Stomach making sounds never heard before';
    } else {
        // Healthy
        mouthEl.classList.remove('sick-mouth');
        leftEyeEl.style.height = '15px';
        rightEyeEl.style.height = '15px';
        characterEl.style.backgroundColor = '#f9d9c9';
        characterEl.style.animation = '';
        sweat1El.style.opacity = '0';
        sweat2El.style.opacity = '0';
        
        if (gameState.poopEaten > 30) {
            characterStatusEl.textContent = 'Has evolved beyond normal human digestion';
        } else if (gameState.poopEaten > 10) {
            characterStatusEl.textContent = 'Starting to critique poop like fine wine';
        } else {
            characterStatusEl.textContent = 'Feeling normal (for now)';
        }
    }
    
    // Update based on energy
    if (gameState.energy < 20) {
        // Low energy
        leftEyeEl.style.height = '2px';
        rightEyeEl.style.height = '2px';
        characterStatusEl.textContent += ' (too pooped to pop)';
    }
    
    // Game over state
    if (gameState.isGameOver) {
        if (gameState.health <= 0) {
            characterEl.style.transform = 'rotate(90deg)';
            characterEl.style.backgroundColor = '#c0c0c0';
            characterEl.style.animation = '';
            characterStatusEl.textContent = 'DECEASED - Cause of death: "Experimental Diet"';
        } else if (gameState.poopEaten >= 50) {
            stomachFillEl.style.height = '100%';
            stomachFillEl.style.backgroundColor = '#5e3a1c';
            characterEl.style.backgroundColor = '#8d6e63';
            characterEl.style.animation = 'pulse 2s infinite';
            characterStatusEl.textContent = 'ASCENDED - No longer requires normal food';
        }
    }
}

// Add toilet emergency function
toiletEl.addEventListener('click', () => {
    if (gameState.isGameOver || eatPoopBtn.disabled) return;
    
    if (gameState.health < 30) {
        // Emergency toilet use
        gameState.health = Math.min(100, gameState.health + 15);
        gameState.energy = Math.max(0, gameState.energy - 10);
        
        // Animate character
        characterEl.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            characterEl.style.transform = '';
        }, 500);
        
        const messages = [
            "Emergency bathroom break! You feel somewhat better after expelling some of what you consumed.",
            "You sprint to the toilet just in time. The sounds coming from the bathroom would frighten wildlife.",
            "Your stomach makes a noise like a dying whale. The toilet saves you from disaster."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
        
        updateUI();
        endDay();
    } else {
        logMessage("You don't need the toilet right now. Your iron stomach is holding up.");
    }
});

// Add hover effect for toilet
toiletEl.addEventListener('mouseover', () => {
    toiletEl.style.transform = 'scale(1.1)';
});

toiletEl.addEventListener('mouseout', () => {
    toiletEl.style.transform = 'scale(1)';
});

// Add restart functionality
restartButtonEl.addEventListener('click', () => {
    // Check if player has died once and hasn't paid
    if (gameState.hasPlayerDiedOnce && !gameState.hasPaid) {
        // Show payment modal
        gameOverScreenEl.style.display = 'none';
        paymentModalEl.style.display = 'flex';
    } else {
        // Reset game as normal
        resetGame();
    }
});

// Extract reset game logic to a separate function
function resetGame() {
    // Reset game state
    gameState.health = 100;
    gameState.energy = 100;
    gameState.poopEaten = 0;
    gameState.day = 1;
    gameState.isGameOver = false;
    
    // Keep achievements, hasPlayerDiedOnce, and hasPaid status
    
    // Reset UI
    gameOverScreenEl.style.display = 'none';
    
    // Reset character
    characterEl.style.transform = '';
    characterEl.style.backgroundColor = '#f9d9c9';
    characterEl.style.animation = '';
    mouthEl.classList.remove('sick-mouth');
    leftEyeEl.style.height = '15px';
    rightEyeEl.style.height = '15px';
    sweat1El.style.opacity = '0';
    sweat2El.style.opacity = '0';
    stomachFillEl.style.height = '0%';
    stomachFillEl.style.backgroundColor = '#8B4513';
    
    // Enable buttons
    eatPoopBtn.disabled = false;
    sleepBtn.disabled = false;
    exerciseBtn.disabled = false;
    doctorBtn.disabled = false;
    
    // Reset game log
    gameLogEl.innerHTML = '';
    logMessage("You stare at the unusual meal before you. Everyone says it's impossible, dangerous even, but you're determined to prove them wrong. Your journey into the world of coprophagy begins now...");
    
    // Update UI
    updateUI();
}

// Modify the eat-poop button click handler to include achievements
eatPoopBtn.addEventListener('click', async () => {
    if (gameState.isGameOver) return;
    
    // Disable buttons during animation
    eatPoopBtn.disabled = true;
    sleepBtn.disabled = true;
    exerciseBtn.disabled = true;
    doctorBtn.disabled = true;
    
    // Play eating animation
    await animateEating();
    
    gameState.poopEaten++;
    gameState.energy = Math.max(0, gameState.energy - 5);
    
    // Health effects vary based on how much poop already eaten
    if (gameState.poopEaten < 10) {
        gameState.health = Math.max(0, gameState.health - 10);
        const messages = [
            "You hold your nose and force down a bite. Your stomach immediately protests with loud gurgling.",
            "The texture is worse than the taste. You gag several times but manage to keep it down.",
            "Your eyes water as you swallowed. This is definitely not what humans are meant to eat."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else if (gameState.poopEaten < 20) {
        gameState.health = Math.max(0, gameState.health - 5);
        const messages = [
            "You're getting better at this. You only dry heave twice this time.",
            "Your taste buds seem to be giving up the fight. It's not as revolting as before.",
            "You've developed a technique: small bites, lots of mental preparation."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else if (gameState.poopEaten < 30) {
        gameState.health = Math.max(0, gameState.health - 2);
        const messages = [
            "You can identify subtle flavor differences now. This one has notes of corn.",
            "Your stomach barely complains anymore. Your body is adapting to this bizarre diet.",
            "You find yourself critiquing the consistency. You've become a poop gourmet."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
        gameState.health = Math.min(100, gameState.health + 2);
        const messages = [
            "Your body has completely adapted. You actually feel energized after your meal.",
            "You savor the flavor and texture. Your transformation is complete.",
            "You catch yourself looking forward to mealtime. What have you become?"
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    
    // Check for achievements
    checkAchievements();
    
    updateUI();
    endDay();
    
    // Re-enable buttons if game isn't over
    if (!gameState.isGameOver) {
        eatPoopBtn.disabled = false;
        sleepBtn.disabled = false;
        exerciseBtn.disabled = false;
        doctorBtn.disabled = false;
    }
});

// Make the poop pile clickable too
poopPile.addEventListener('click', () => {
    if (!eatPoopBtn.disabled) {
        eatPoopBtn.click();
    }
});

// Add some visual feedback for the poop pile
poopPile.addEventListener('mouseover', () => {
    poopPile.style.transform = 'scale(1.1)';
});

poopPile.addEventListener('mouseout', () => {
    poopPile.style.transform = 'scale(1)';
});

sleepBtn.addEventListener('click', () => {
    if (gameState.isGameOver) return;
    
    gameState.energy = Math.min(100, gameState.energy + 30);
    const messages = [
        "You curl up in bed, your unusual diet giving you strange but not unpleasant dreams.",
        "Sleep comes easily after a day of... unique nutrition. Your body needs the rest to process.",
        "You wake up feeling surprisingly refreshed. Your body must be working overtime to handle your diet."
    ];
    logMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    updateUI();
    endDay();
});

exerciseBtn.addEventListener('click', () => {
    if (gameState.isGameOver) return;
    
    if (gameState.energy < 20) {
        const messages = [
            "You try to jog but end up walking home, exhausted and queasy.",
            "Your unusual diet and low energy make exercise nearly impossible today.",
            "You barely make it through ten minutes of exercise before your body gives up."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
        gameState.energy = Math.max(0, gameState.energy - 10);
    } else {
        gameState.health = Math.min(100, gameState.health + 10);
        gameState.energy = Math.max(0, gameState.energy - 20);
        const messages = [
            "Exercise helps your body process the strange substances you've been consuming.",
            "Your workout is surprisingly effective. Sweat has never smelled so... interesting.",
            "Physical activity seems to help your body adapt to your unusual dietary choices."
        ];
        logMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    
    updateUI();
    endDay();
});

doctorBtn.addEventListener('click', () => {
    if (gameState.isGameOver) return;
    
    gameState.health = Math.min(100, gameState.health + 20);
    
    if (gameState.poopEaten > 30) {
        logMessage("The doctor is baffled by your test results. 'Your gut bacteria is unlike anything I've ever seen,' she says. 'Whatever you're doing... I can't believe I'm saying this, but your body seems to be adapting.'");
    } else if (gameState.poopEaten > 10) {
        logMessage("The doctor looks at your test results with horror. 'There are dangerous bacteria in your system! What have you been eating?' You avoid eye contact as she prescribes antibiotics.");
    } else {
        logMessage("The doctor gives you a routine checkup. 'Your digestive system shows some unusual strain,' she notes. 'I recommend a bland diet for a few days.'");
    }
    
    updateUI();
    endDay();
});

// Add payment button event listener
paymentButtonEl.addEventListener('click', () => {
    // Open the Stripe payment link in a new window
    window.open('https://buy.stripe.com/test_aEU5m66YeaTDgNi4gh', '_blank');
    
    // For demo purposes, we'll just assume payment was successful
    // In a real implementation, you'd need to verify the payment with a server
    setTimeout(() => {
        gameState.hasPaid = true;
        paymentModalEl.style.display = 'none';
        resetGame();
    }, 3000);
});

// Initialize the game
updateUI();
logMessage("You stare at the unusual meal before you. Everyone says it's impossible, dangerous even, but you're determined to prove them wrong. Your journey into the world of coprophagy begins now..."); 