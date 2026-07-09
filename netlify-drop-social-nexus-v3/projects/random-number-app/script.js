// Initialize Lucide icons
lucide.createIcons();

const resultDisplay = document.getElementById('result-number');
const generateBtn = document.getElementById('generate-btn');
const minInput = document.getElementById('min-val');
const maxInput = document.getElementById('max-val');
const historyBtn = document.getElementById('show-history');
const historyModal = document.getElementById('history-modal');
const closeModal = document.querySelector('.close-modal');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let history = JSON.parse(localStorage.getItem('numberHistory')) || [];

// Update history display on load
updateHistoryUI();

function generateNumber() {
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);

    if (isNaN(min) || isNaN(max)) {
        alert('Please enter valid numbers');
        return;
    }

    if (min >= max) {
        alert('Min must be less than Max');
        return;
    }

    // Animation Effect
    generateBtn.disabled = true;
    let counter = 0;
    const duration = 1000; // 1 second
    const frameRate = 50;
    const totalFrames = duration / frameRate;

    const interval = setInterval(() => {
        const tempNum = Math.floor(Math.random() * (max - min + 1)) + min;
        resultDisplay.textContent = tempNum;
        counter++;

        if (counter >= totalFrames) {
            clearInterval(interval);
            const finalNum = Math.floor(Math.random() * (max - min + 1)) + min;
            resultDisplay.textContent = finalNum;
            generateBtn.disabled = false;

            // Add to history
            addToHistory(finalNum);

            // Trigger feedback animation
            resultDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                resultDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }, frameRate);
}

function addToHistory(num) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    history.unshift({ number: num, time: time });

    // Keep only last 20
    if (history.length > 20) history.pop();

    localStorage.setItem('numberHistory', JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">No numbers generated yet.</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <span>${item.time}</span>
            <span>${item.number}</span>
        </div>
    `).join('');
}

// Event Listeners
generateBtn.addEventListener('click', generateNumber);

historyBtn.addEventListener('click', () => {
    historyModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.remove('active');
    }
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('numberHistory');
    updateHistoryUI();
});

// Allow enter key to generate
[minInput, maxInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateNumber();
    });
});
