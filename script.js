/*
    Copyright (C) 2026 Jakub Březa

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://gnu.org>.
*/

/**
 * ==============================================================================
 * QuizApp v2 - Produkční logika (Referenční řešení)
 * Témata: JS Matematika, Náhodnost (Math.random, Shuffle), Asynchronní časovače
 * (setInterval, setTimeout) a Dynamická správa stavu
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. Pomocné matematické funkce pro náhodnost (Tahák sekce 1)
// ------------------------------------------------------------------------------

/**
 * Generuje náhodné celé číslo v intervalu [min, max] včetně obou mezí.
 * @param {number} min - Minimální hodnota.
 * @param {number} max - Maximální hodnota.
 * @returns {number} Náhodné celé číslo.
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Náhodně promíchá kopii pole pomocí Fisher-Yates (Knuth) shuffle algoritmu.
 * Nemodifikuje původní pole (Pure Function).
 * @template T
 * @param {T[]} array - Vstupní pole.
 * @returns {T[]} Nové promíchané pole.
 */
function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ------------------------------------------------------------------------------
// 2. Zásobník otázek (Data Pool)
// ------------------------------------------------------------------------------
const QUESTIONS_POOL = [
    {
        text: 'Která CSS vlastnost slouží k aktivaci flexibilního boxového modelu?',
        options: ['display: flex;', 'position: absolute;', 'float: left;', 'grid-template: auto;'],
        correctIndex: 0
    },
    {
        text: 'Jaká JavaScriptová metoda zaokrouhlí číslo klasicky matematicky?',
        options: ['Math.round()', 'Math.floor()', 'Math.ceil()', 'Math.random()'],
        correctIndex: 0
    },
    {
        text: 'Která funkce slouží k opakovanému spouštění kódu v časovém intervalu?',
        options: ['setInterval()', 'setTimeout()', 'requestAnimationFrame()', 'delay()'],
        correctIndex: 0
    },
    {
        text: 'Jakým příkazem zastavíme běžící časovač vytvořený přes setInterval?',
        options: ['clearInterval(timerId)', 'stopTimer()', 'timer.cancel()', 'clearTimeout()'],
        correctIndex: 0
    },
    {
        text: 'Které klíčové slovo v CSS definuje vlastní animaci klíčových snímků?',
        options: ['@keyframes', '@animation', '@transitions', '@keyframes-rule'],
        correctIndex: 0
    },
    {
        text: 'Jakou vlastností v JS bezpečně nastavíme pouze textový obsah elementu?',
        options: ['element.textContent', 'element.innerHTML', 'element.outerHTML', 'element.value'],
        correctIndex: 0
    }
];

// ------------------------------------------------------------------------------
// 3. OOP Třída Question (Rozšířená pro dynamické míchání)
// ------------------------------------------------------------------------------

/**
 * Třída reprezentující jednu kvízovou otázku.
 * Zapouzdřuje data a chování pro zobrazení a validaci odpovědí.
 */
class Question {
    /**
     * @param {string} text - Text otázky.
     * @param {string[]} options - Pole možností odpovědí.
     * @param {number} correctIndex - Index správné odpovědi.
     */
    constructor(text, options, correctIndex) {
        this.text = text;
        this.options = options;
        this.correctIndex = correctIndex;
    }

    /**
     * Vytvoří novou instanci otázky s náhodně promíchaným pořadím odpovědí
     * a automaticky přepočítaným indexem správné odpovědi.
     * @param {object} rawQuestion - Surový objekt ze zásobníku.
     * @returns {Question} Nová instance se zamíchanými možnostmi.
     */
    static createShuffled(rawQuestion) {
        const originalCorrectText = rawQuestion.options[rawQuestion.correctIndex];
        const shuffledOptions = shuffle(rawQuestion.options);
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);
        return new Question(rawQuestion.text, shuffledOptions, newCorrectIndex);
    }

    /**
     * Vykreslí otázku a možnosti do HTML struktury.
     * @param {number} questionNumber - Pořadové číslo zobrazené otázky.
     */
    displayQuestion(questionNumber = 1) {
        // 1. Aktualizace textu a odznáčku otázky
        const badgeEl = document.querySelector('#question-badge');
        const textEl = document.querySelector('#question-text');

        if (badgeEl) badgeEl.textContent = `Otázka ${questionNumber}`;
        if (textEl) textEl.textContent = this.text;

        // 2. Vložení textu do tlačítek odpovědí
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button, index) => {
            const optionTextEl = button.querySelector('.option-text');
            if (optionTextEl && this.options[index] !== undefined) {
                optionTextEl.textContent = this.options[index];
            }
            // Vyčištění stavových tříd z předchozí otázky
            button.classList.remove('correct', 'wrong', 'disabled');
        });

        // 3. Odblokování klikání v mřížce
        const gridEl = document.querySelector('#answers-grid');
        if (gridEl) gridEl.classList.remove('disabled');
    }

    /**
     * Zkontroluje, zda zvolený index odpovídá správné odpovědi.
     * @param {number} selectedIndex - Index zvolené odpovědi (0-3).
     * @returns {boolean} True, pokud je volba správná.
     */
    isCorrect(selectedIndex) {
        return selectedIndex === this.correctIndex;
    }
}

// ------------------------------------------------------------------------------
// 4. Stav aplikace a Globální proměnné
// ------------------------------------------------------------------------------
const TIME_LIMIT_SECONDS = 10;
const TRANSITION_DELAY_MS = 1500;

const state = {
    totalQuestions: 0,
    correctAnswers: 0,
    questionNumber: 0,
    timeLeft: TIME_LIMIT_SECONDS,
    timerId: null,
    currentQuestion: null,
    isProcessingAnswer: false
};

// ------------------------------------------------------------------------------
// 5. Řízení časovače a Statistik (Asynchronní JS)
// ------------------------------------------------------------------------------

/**
 * Spočte úspěšnost v procentech zaokrouhlenou na celá čísla.
 * @param {number} correct - Počet správných odpovědí.
 * @param {number} total - Celkový počet zodpovězených otázek.
 * @returns {number} Procentuální úspěšnost (0-100).
 */
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

/**
 * Aktualizuje panel statistik v DOMu.
 */
function updateStatsUI() {
    const scoreEl = document.querySelector('#score');
    const accuracyEl = document.querySelector('#accuracy');

    if (scoreEl) {
        scoreEl.textContent = `${state.correctAnswers} / ${state.totalQuestions}`;
    }
    if (accuracyEl) {
        const accuracy = calculateAccuracy(state.correctAnswers, state.totalQuestions);
        accuracyEl.textContent = `${accuracy}%`;
    }
}

/**
 * Aktualizuje vizuální zobrazení zbývajícího času.
 */
function updateTimerUI() {
    const timerSecondsEl = document.querySelector('#timer-seconds');
    const timerDisplayEl = document.querySelector('#timer-display');
    const progressBarEl = document.querySelector('#timer-progress-bar');

    if (timerSecondsEl) {
        timerSecondsEl.textContent = state.timeLeft;
    }

    if (progressBarEl) {
        const percentage = (state.timeLeft / TIME_LIMIT_SECONDS) * 100;
        progressBarEl.style.width = `${percentage}%`;
    }

    // Vizuální výstraha při docházejícím čase
    if (timerDisplayEl && progressBarEl) {
        if (state.timeLeft <= 3) {
            timerDisplayEl.classList.add('danger');
            timerDisplayEl.classList.remove('warning');
            progressBarEl.classList.add('danger');
            progressBarEl.classList.remove('warning');
        } else if (state.timeLeft <= 5) {
            timerDisplayEl.classList.add('warning');
            timerDisplayEl.classList.remove('danger');
            progressBarEl.classList.add('warning');
            progressBarEl.classList.remove('danger');
        } else {
            timerDisplayEl.classList.remove('warning', 'danger');
            progressBarEl.classList.remove('warning', 'danger');
        }
    }
}

/**
 * Spustí odpočítávací časovač pro aktuální otázku.
 */
function startTimer() {
    // 1. Zastavení případného předchozího časovače
    stopTimer();

    // 2. Reset stavu času na plný limit
    state.timeLeft = TIME_LIMIT_SECONDS;
    updateTimerUI();

    // 3. Spuštění asynchronního intervalu tikajícího každou sekundu
    state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerUI();

        // 4. Vypršení časového limitu
        if (state.timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

/**
 * Zastaví běžící odpočet.
 */
function stopTimer() {
    if (state.timerId !== null) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

// ------------------------------------------------------------------------------
// 6. Obsluha herní logiky a přechodů (Event Handlers & Transitions)
// ------------------------------------------------------------------------------

/**
 * Načte a vykreslí novou náhodnou otázku ze zásobníku a spustí časovač.
 */
function loadNextQuestion() {
    state.isProcessingAnswer = false;
    state.questionNumber++;

    // 1. Náhodný výběr otázky pomocí pomocné funkce randint
    const randomIndex = randint(0, QUESTIONS_POOL.length - 1);
    const rawQuestion = QUESTIONS_POOL[randomIndex];

    // 2. Vytvoření instance Question s promíchanými možnostmi
    state.currentQuestion = Question.createShuffled(rawQuestion);

    // 3. Vykreslení do DOM
    state.currentQuestion.displayQuestion(state.questionNumber);

    // 4. Spuštění odpočtu
    startTimer();
}

/**
 * Vyhodnotí odpověď uživatele po kliknutí na tlačítko.
 * @param {number} selectedIndex - Index kliknutého tlačítka.
 * @param {HTMLButtonElement} buttonEl - Element kliknutého tlačítka.
 */
function handleAnswerSelection(selectedIndex, buttonEl) {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;
    stopTimer();

    // 1. Deaktivace dalšího klikání během animace a zpoždění
    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    // 2. Vyhodnocení správnosti
    const isCorrect = state.currentQuestion.isCorrect(selectedIndex);
    state.totalQuestions++;

    if (isCorrect) {
        state.correctAnswers++;
        buttonEl.classList.add('correct');
        console.log(`%c✅ SPRÁVNĚ! (Otázka ${state.questionNumber})`, 'color: #22c55e; font-weight: bold;');
    } else {
        buttonEl.classList.add('wrong');
        // Zvýraznění správné odpovědi pro zpětnou vazbu
        const answerButtons = document.querySelectorAll('.answer-btn');
        const correctBtn = answerButtons[state.currentQuestion.correctIndex];
        if (correctBtn) correctBtn.classList.add('correct');
        console.log(`%c❌ CHYBA! Správná byla možnost: "${state.currentQuestion.options[state.currentQuestion.correctIndex]}"`, 'color: #ef4444; font-weight: bold;');
    }

    // 3. Aktualizace statistik
    updateStatsUI();

    // 4. Časovaný přechod na další otázku (setTimeout)
    setTimeout(() => {
        loadNextQuestion();
    }, TRANSITION_DELAY_MS);
}

/**
 * Obsluha situace, kdy vyprší časový limit bez odpovědi hráče.
 */
function handleTimeout() {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;

    // 1. Zablokování tlačítek
    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    // 2. Započítání jako neúspěšný pokus
    state.totalQuestions++;
    console.log(`%c⏱️ ČAS VYPRŠEL! (Otázka ${state.questionNumber})`, 'color: #eab308; font-weight: bold;');

    // 3. Zvýraznění správné odpovědi
    const answerButtons = document.querySelectorAll('.answer-btn');
    const correctBtn = answerButtons[state.currentQuestion.correctIndex];
    if (correctBtn) correctBtn.classList.add('correct');

    // 4. Aktualizace statistik
    updateStatsUI();

    // 5. Přechod na další otázku
    setTimeout(() => {
        loadNextQuestion();
    }, TRANSITION_DELAY_MS);
}

// ------------------------------------------------------------------------------
// 7. Inicializace aplikace (DOM Ready)
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 QuizApp v2 spuštěna v referenčním režimu (Dynamika & Časovač).');

    // 1. Registrace posluchačů událostí na tlačítka odpovědí
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const clickedIndex = parseInt(button.dataset.index, 10);
            handleAnswerSelection(clickedIndex, button);
        });
    });

    // 2. Start první dynamické otázky
    updateStatsUI();
    loadNextQuestion();
});

