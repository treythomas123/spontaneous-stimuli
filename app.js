// Stimulus data
const stimuli = {
    colors: [
        { type: 'color', value: 'red', name: 'Red', bgColor: '#FF0000' },
        { type: 'color', value: 'blue', name: 'Blue', bgColor: '#0000FF' },
        { type: 'color', value: 'green', name: 'Green', bgColor: '#00FF00' },
        { type: 'color', value: 'yellow', name: 'Yellow', bgColor: '#FFFF00' },
        { type: 'color', value: 'purple', name: 'Purple', bgColor: '#800080' },
        { type: 'color', value: 'orange', name: 'Orange', bgColor: '#FFA500' },
        { type: 'color', value: 'pink', name: 'Pink', bgColor: '#FFC0CB' },
        { type: 'color', value: 'brown', name: 'Brown', bgColor: '#A52A2A' },
        { type: 'color', value: 'black', name: 'Black', bgColor: '#000000' },
        { type: 'color', value: 'white', name: 'White', bgColor: '#FFFFFF' }
    ],
    shapes: [
        { type: 'shape', value: 'circle', name: 'Circle', symbol: '⭕' },
        { type: 'shape', value: 'square', name: 'Square', symbol: '⬜' },
        { type: 'shape', value: 'triangle', name: 'Triangle', symbol: '🔺' },
        { type: 'shape', value: 'star', name: 'Star', symbol: '⭐' },
        { type: 'shape', value: 'heart', name: 'Heart', symbol: '❤️' },
        { type: 'shape', value: 'diamond', name: 'Diamond', symbol: '💎' },
        { type: 'shape', value: 'moon', name: 'Moon', symbol: '🌙' },
        { type: 'shape', value: 'sun', name: 'Sun', symbol: '☀️' },
        { type: 'shape', value: 'cloud', name: 'Cloud', symbol: '☁️' },
        { type: 'shape', value: 'flower', name: 'Flower', symbol: '🌸' }
    ],
    numbers: [
        { type: 'number', value: '1', name: 'One' },
        { type: 'number', value: '2', name: 'Two' },
        { type: 'number', value: '3', name: 'Three' },
        { type: 'number', value: '4', name: 'Four' },
        { type: 'number', value: '5', name: 'Five' },
        { type: 'number', value: '6', name: 'Six' },
        { type: 'number', value: '7', name: 'Seven' },
        { type: 'number', value: '8', name: 'Eight' },
        { type: 'number', value: '9', name: 'Nine' },
        { type: 'number', value: '10', name: 'Ten' }
    ],
    letters: [
        { type: 'letter', value: 'A', name: 'A' },
        { type: 'letter', value: 'B', name: 'B' },
        { type: 'letter', value: 'C', name: 'C' },
        { type: 'letter', value: 'D', name: 'D' },
        { type: 'letter', value: 'E', name: 'E' },
        { type: 'letter', value: 'F', name: 'F' },
        { type: 'letter', value: 'G', name: 'G' },
        { type: 'letter', value: 'H', name: 'H' },
        { type: 'letter', value: 'I', name: 'I' },
        { type: 'letter', value: 'J', name: 'J' },
        { type: 'letter', value: 'K', name: 'K' },
        { type: 'letter', value: 'L', name: 'L' },
        { type: 'letter', value: 'M', name: 'M' },
        { type: 'letter', value: 'N', name: 'N' },
        { type: 'letter', value: 'O', name: 'O' },
        { type: 'letter', value: 'P', name: 'P' },
        { type: 'letter', value: 'Q', name: 'Q' },
        { type: 'letter', value: 'R', name: 'R' },
        { type: 'letter', value: 'S', name: 'S' },
        { type: 'letter', value: 'T', name: 'T' },
        { type: 'letter', value: 'U', name: 'U' },
        { type: 'letter', value: 'V', name: 'V' },
        { type: 'letter', value: 'W', name: 'W' },
        { type: 'letter', value: 'X', name: 'X' },
        { type: 'letter', value: 'Y', name: 'Y' },
        { type: 'letter', value: 'Z', name: 'Z' }
    ]
};

// App state
let currentCategory = null;
let stimulusInterval = null;
let isRunning = false;
let currentStimulusElement = null;

// DOM elements
const mainMenu = document.getElementById('main-menu');
const stimulusDisplay = document.getElementById('stimulus-display');
const stimulusContent = document.getElementById('stimulus-content');
const backBtn = document.getElementById('back-btn');
const stimulusButtons = document.querySelectorAll('.stimulus-btn');

// Initialize the app
function init() {
    // Add event listeners
    stimulusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            startStimulus(category);
        });
    });

    backBtn.addEventListener('click', stopStimulus);

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Force a reflow to ensure proper sizing
            window.scrollTo(0, 0);
        }, 100);
    });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
}

// Start stimulus display
function startStimulus(category) {
    currentCategory = category;
    isRunning = true;
    
    // Switch to stimulus display
    mainMenu.classList.remove('active');
    stimulusDisplay.classList.add('active');
    
    // Start the stimulus cycle
    showNextStimulus();
}

// Stop stimulus display
function stopStimulus() {
    isRunning = false;
    if (stimulusInterval) {
        clearTimeout(stimulusInterval);
        stimulusInterval = null;
    }
    
    // Switch back to main menu
    stimulusDisplay.classList.remove('active');
    mainMenu.classList.add('active');
    
    // Clear stimulus content
    stimulusContent.innerHTML = '';
    currentStimulusElement = null;
    currentCategory = null;
}

// Show next stimulus
function showNextStimulus() {
    if (!isRunning) return;
    
    const stimulus = getRandomStimulus();
    displayStimulus(stimulus);
    
    // Schedule next stimulus
    const delay = getRandomDelay();
    stimulusInterval = setTimeout(() => {
        if (isRunning) {
            showNextStimulus();
        }
    }, delay);
}

// Get random stimulus based on current category
function getRandomStimulus() {
    if (currentCategory === 'mixed') {
        // Randomly select from all categories
        const categories = ['colors', 'shapes', 'numbers', 'letters'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryStimuli = stimuli[randomCategory];
        return categoryStimuli[Math.floor(Math.random() * categoryStimuli.length)];
    } else {
        // Use current category
        const categoryStimuli = stimuli[currentCategory];
        return categoryStimuli[Math.floor(Math.random() * categoryStimuli.length)];
    }
}

// Get random delay between 2-5 seconds
function getRandomDelay() {
    return Math.random() * 3000 + 2000; // 2000-5000ms
}

// Display stimulus with improved animation
function displayStimulus(stimulus) {
    // Remove previous stimulus if it exists
    if (currentStimulusElement) {
        currentStimulusElement.remove();
    }
    
    // Create new stimulus element
    const element = document.createElement('div');
    element.className = 'stimulus-fade-in';
    
    switch (stimulus.type) {
        case 'color':
            element.className += ' color-stimulus';
            element.style.backgroundColor = stimulus.bgColor;
            element.textContent = stimulus.name;
            break;
            
        case 'shape':
            element.className += ' shape-stimulus';
            element.textContent = stimulus.symbol;
            break;
            
        case 'number':
        case 'letter':
            element.className += ' text-stimulus';
            element.textContent = stimulus.value;
            break;
    }
    
    // Add to DOM
    stimulusContent.appendChild(element);
    currentStimulusElement = element;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        if (element && element.parentNode) {
            element.classList.remove('stimulus-fade-in');
        }
    }, 300);
}

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isRunning) {
        // Pause the stimulus when app is not visible
        if (stimulusInterval) {
            clearTimeout(stimulusInterval);
            stimulusInterval = null;
        }
    } else if (!document.hidden && isRunning && !stimulusInterval) {
        // Resume the stimulus when app becomes visible again
        showNextStimulus();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent pull-to-refresh on mobile
let startY = 0;
document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
});

document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    const pull = y - startY;
    
    if (pull > 0 && window.scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false }); 