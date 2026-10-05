
# 🚀 Tahák: JS Matematika, Časovače & CSS Animace

---

## 1. JavaScript – Matematika & Náhodnost

### Generování čísel a zaokrouhlování
* `Math.random()` – Vrací náhodné desetinné číslo v rozmezí `[0, 1)` (včetně 0, ale bez 1).
* `Math.floor(x)` – Zaokrouhlí číslo `x` **dolů** na nejbližší celé číslo.
* `Math.round(x)` – Zaokrouhlí číslo `x` klasicky podle matematických pravidel (od 0.5 nahoru).
* `Math.ceil(x)` – Zaokrouhlí číslo `x` **nahoru** na nejbližší celé číslo.

### Vlastní funkce pro náhodné celé číslo v rozsahu
Generuje náhodné celé číslo **včetně** `min` i `max`:

```javascript
function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

```

### Práce s poli

```javascript
// Vytvoření pole
const barvy = ['červená', 'zelená', 'modrá', 'žlutá'];

// Přístup k prvkům (indexuje se od 0)
console.log(barvy[0]); // 'červená'
console.log(barvy[barvy.length - 1]); // Poslední prvek: 'žlutá'

// Náhodný výběr prvku z pole
const nahodnaBarva = barvy[Math.floor(Math.random() * barvy.length)];

// Náhodné promíchání pole (Fisher-Yates Shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Prohození prvků
  }
  return array;
}

```

---

## 2. JavaScript – Časovače a Stav

### Časovače

* **Interval (`setInterval`):** Opakovaně spouští funkci v daném časovém kroku (v milisekundách).
* **Zpoždění (`setTimeout`):** Spustí funkci pouze jednou po uplynutí zadaného času.

```javascript
// --- SETINTERVAL ---
// Spustí se každou 1 sekundu (1000 ms)
const timerId = setInterval(() => {
  console.log('Tiká to...');
}, 1000);

// Zastavení intervalu podle jeho ID
clearInterval(timerId);


// --- SETTIMEOUT ---
// Spustí se jednou po 3 sekundách (3000 ms)
const delayId = setTimeout(() => {
  console.log('Vypršel čas!');
}, 3000);

// Zrušení odpočtu před jeho spuštěním
clearTimeout(delayId);

```

### Správa stavu a výpočet úspěšnosti

```javascript
let correct = 0;
let wrong = 0;

// Přičtení bodů
correct++;
wrong++;

// Výpočet celkového počtu a úspěšnosti v procentech
const total = correct + wrong;
const successRate = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

console.log(`Úspěšnost: ${successRate}%`);

```

---

## 3. CSS3 – Dynamické třídy & Animace

### Manipulace s třídami v JS (`classList`)

```javascript
const element = document.querySelector('.karta');

element.classList.add('active');      // Přidá třídu
element.classList.remove('active');   // Odebere třídu
element.classList.toggle('active');   // Přepne třídu (přidá/odebere podle existence)
element.classList.contains('active'); // Vrací true/false

```

### CSS Přechody (`transition`) & Animace (`@keyframes`)

```css
/* Plynulá změna vlastností při změně stavu/třídy */
.karta {
  background-color: #f0f0f0;
  transition: all 0.3s ease;
}

/* Klíčové snímky pro vlastní animaci */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

```

### Vizuální zpětná vazba (Stavy)

```css
/* Základní tlačítko/prvek */
.btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

/* Třídy pro odlišení stavů */
.btn.correct {
  background-color: #2ecc71;
  color: white;
  animation: popIn 0.3s ease;
}

.btn.wrong {
  background-color: #e74c3c;
  color: white;
  animation: shake 0.3s ease;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

```