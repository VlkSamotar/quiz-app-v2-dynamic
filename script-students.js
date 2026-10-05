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
 * QuizApp v2 - Pracovní JavaScript pro studenty (Studentská verze)
 * Úkoly: Doplnit náhodnost (Math), míchání (shuffle), odpočet (setInterval) a stav
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. Pomocné funkce pro náhodnost (Úkoly TODO 1 a TODO 2)
// ------------------------------------------------------------------------------

/**
 * Generuje náhodné celé číslo v intervalu [min, max] včetně obou mezí.
 * @param {number} min - Minimální hodnota.
 * @param {number} max - Maximální hodnota.
 * @returns {number} Náhodné celé číslo.
 */
function randint(min, max) {
    // TODO 1: Vrať náhodné celé číslo mezi min a max (včetně obou mezí).
    // NÁPOVĚDA: Použij Math.random() a zaokrouhli dolů pomocí Math.floor().
    // VZOREC: Math.floor(Math.random() * (max - min + 1)) + min;
    // PŘÍKLAD: return Math.floor(Math.random() * (max - min + 1)) + min;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 1:
    return min; // Nahraď tento výchozí návrat svým výpočtem
}

/**
 * Náhodně promíchá kopii pole pomocí Fisher-Yates shuffle algoritmu.
 * @template T
 * @param {T[]} array - Vstupní pole.
 * @returns {T[]} Nové promíchané pole.
 */
function shuffle(array) {
    // TODO 2: Vytvoř kopii pole a promíchej její prvky (Fisher-Yates shuffle).
    // NÁPOVĚDA:
    // 1. Vytvoř kopii: const copy = [...array];
    // 2. Projdi pole odzadu cyklem: for (let i = copy.length - 1; i > 0; i--) { ... }
    // 3. Zvol náhodný index j: const j = Math.floor(Math.random() * (i + 1));
    // 4. Prohoď prvky: [copy[i], copy[j]] = [copy[j], copy[i]];
    // 5. Vrať promíchanou kopii: return copy;

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 2:
    return [...array]; // Nahraď tento výchozí návrat promíchanou kopií
}

// ------------------------------------------------------------------------------
// 2. Zásobník otázek (Ponecháno plně funkční)
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
// 3. OOP Třída Question (Ponechána funkční)
// ------------------------------------------------------------------------------
class Question {
    constructor(text, options, correctIndex) {
        this.text = text;
        this.options = options;
        this.correctIndex = correctIndex;
    }

    static createShuffled(rawQuestion) {
        const originalCorrectText = rawQuestion.options[rawQuestion.correctIndex];
        const shuffledOptions = shuffle(rawQuestion.options);
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);
        return new Question(rawQuestion.text, shuffledOptions, newCorrectIndex);
    }

    displayQuestion(questionNumber = 1) {
        const badgeEl = document.querySelector('#question-badge');
        const textEl = document.querySelector('#question-text');

        if (badgeEl) badgeEl.textContent = `Otázka ${questionNumber}`;
        if (textEl) textEl.textContent = this.text;

        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button, index) => {
            const optionTextEl = button.querySelector('.option-text');
            if (optionTextEl && this.options[index] !== undefined) {
                optionTextEl.textContent = this.options[index];
            }
            button.classList.remove('correct', 'wrong', 'disabled');
        });

        const gridEl = document.querySelector('#answers-grid');
        if (gridEl) gridEl.classList.remove('disabled');
    }

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
// 5. Řízení časovače a Statistik (Úkoly TODO 3, TODO 4 a TODO 5)
// ------------------------------------------------------------------------------

/**
 * Spočte úspěšnost v procentech zaokrouhlenou na celá čísla.
 * @param {number} correct - Počet správných odpovědí.
 * @param {number} total - Celkový počet otázek.
 * @returns {number} Procento úspěšnosti (0-100).
 */
function calculateAccuracy(correct, total) {
    // TODO 3: Spočti úspěšnost v procentech a zaokrouhli výsledek pomocí Math.round().
    // Pokud je total === 0, vrať 0, aby nedošlo k dělení nulou.
    // NÁPOVĚDA: Math.round((correct / total) * 100)
    // PŘÍKLAD:
    // if (total === 0) return 0;
    // return Math.round((correct / total) * 100);

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 3:
    return 0; // Nahraď tento výchozí návrat
}

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
    // 1. Zastavíme předchozí časovač a nastavíme výchozí čas
    stopTimer();
    state.timeLeft = TIME_LIMIT_SECONDS;
    updateTimerUI();

    // TODO 4: Spusť interval, který se bude opakovat každých 1000 ms (1 sekundu).
    // V každém kroku:
    // 1. Sniž state.timeLeft o 1 (state.timeLeft--)
    // 2. Zavolej updateTimerUI()
    // 3. Pokud state.timeLeft klesne na 0 nebo méně, zavolej stopTimer() a handleTimeout()
    // Ulož ID intervalu do state.timerId.
    //
    // NÁPOVĚDA:
    // state.timerId = setInterval(() => {
    //     state.timeLeft--;
    //     updateTimerUI();
    //     if (state.timeLeft <= 0) {
    //         stopTimer();
    //         handleTimeout();
    //     }
    // }, 1000);

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 4:
}

/**
 * Zastaví běžící odpočet.
 */
function stopTimer() {
    // TODO 5: Pokud state.timerId existuje, zruš běžící interval a nastav state.timerId na null.
    // NÁPOVĚDA: Použij funkci clearInterval(state.timerId)
    // PŘÍKLAD:
    // if (state.timerId !== null) {
    //     clearInterval(state.timerId);
    //     state.timerId = null;
    // }

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 5:
}

// ------------------------------------------------------------------------------
// 6. Herní logika a přechody (Úkol TODO 6)
// ------------------------------------------------------------------------------

function loadNextQuestion() {
    state.isProcessingAnswer = false;
    state.questionNumber++;

    const randomIndex = randint(0, QUESTIONS_POOL.length - 1);
    const rawQuestion = QUESTIONS_POOL[randomIndex];

    state.currentQuestion = Question.createShuffled(rawQuestion);
    state.currentQuestion.displayQuestion(state.questionNumber);

    startTimer();
}

/**
 * Vyhodnotí odpověď uživatele po kliknutí na tlačítko.
 */
function handleAnswerSelection(selectedIndex, buttonEl) {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;
    stopTimer();

    // Deaktivace tlačítek
    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    // TODO 6: Vyhodnoť odpověď a naplánuj přechod na další otázku.
    // 1. Zjisti, zda je odpověď správná: const isCorrect = state.currentQuestion.isCorrect(selectedIndex);
    // 2. Zvyš počet zodpovězených otázek: state.totalQuestions++;
    // 3. Pokud je správně: zvyš state.correctAnswers++ a přidej třídu buttonEl.classList.add('correct');
    // 4. Pokud je špatně: přidej třídu buttonEl.classList.add('wrong') a správnému tlačítku přidej .classList.add('correct');
    // 5. Aktualizuj statistiky zavoláním updateStatsUI();
    // 6. Pomocí setTimeout() zavolej loadNextQuestion po uplynutí TRANSITION_DELAY_MS.
    //
    // PŘÍKLAD:
    // const isCorrect = state.currentQuestion.isCorrect(selectedIndex);
    // state.totalQuestions++;
    // if (isCorrect) {
    //     state.correctAnswers++;
    //     buttonEl.classList.add('correct');
    // } else {
    //     buttonEl.classList.add('wrong');
    //     const answerButtons = document.querySelectorAll('.answer-btn');
    //     const correctBtn = answerButtons[state.currentQuestion.correctIndex];
    //     if (correctBtn) correctBtn.classList.add('correct');
    // }
    // updateStatsUI();
    // setTimeout(() => {
    //     loadNextQuestion();
    // }, TRANSITION_DELAY_MS);

    // ZDE NAPIŠ SVŮJ KÓD PRO TODO 6:
}

function handleTimeout() {
    if (state.isProcessingAnswer || !state.currentQuestion) return;

    state.isProcessingAnswer = true;

    const gridEl = document.querySelector('#answers-grid');
    if (gridEl) gridEl.classList.add('disabled');

    state.totalQuestions++;
    console.log(`%c⏱️ ČAS VYPRŠEL! (Otázka ${state.questionNumber})`, 'color: #eab308; font-weight: bold;');

    const answerButtons = document.querySelectorAll('.answer-btn');
    const correctBtn = answerButtons[state.currentQuestion.correctIndex];
    if (correctBtn) correctBtn.classList.add('correct');

    updateStatsUI();

    setTimeout(() => {
        loadNextQuestion();
    }, TRANSITION_DELAY_MS);
}

// ------------------------------------------------------------------------------
// 7. Inicializace aplikace (Ponecháno funkční)
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('📝 QuizApp v2 spuštěna ve studentském režimu. Doplňte TODO úkoly.');

    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const clickedIndex = parseInt(button.dataset.index, 10);
            handleAnswerSelection(clickedIndex, button);
        });
    });

    updateStatsUI();
    loadNextQuestion();
});

