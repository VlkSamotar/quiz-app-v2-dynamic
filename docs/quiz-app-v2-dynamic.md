# QuizApp v2: Dynamika, Časovač a Animace

## 1. Cíl aplikace a fáze vývoje
Tato verze staví na základu 1. fáze a transformuje statický prototyp na **2. fázi (dynamickou a interaktivní aplikaci)**. 

Cílem je odstranit stereotyp tím, že se otázky a odpovědi začnou generovat dynamicky (náhodně), přidá se odpočítávací časovač pro omezení reakčního času uživatele, zapojí se vizuální animace pro okamžitou zpětnou vazbu a bude se průběžně počítat celková úspěšnost hráče.

---

## 2. Pohled uživatele (User Experience)
1. **Zobrazení dynamické otázky:** Po načtení se zobrazení otázka s náhodně promíchanými možnostmi odpovědí.
2. **Odpočet času:** Na obrazovce běží viditelný časovač (např. 10 sekund). Pokud čas vyprší, otázka se automaticky vyhodnotí jako nezodpovězená.
3. **Vizuální zpětná vazba:** Po kliknutí na tlačítko odpovědi tlačítko okamžitě zareaguje animací a barevným odlišením (zelená pro správnou, červená pro špatnou odpověď).
4. **Průběžná statistika:** V horní nebo spodní části obrazovky uživatel vidí své aktuální skóre (počet správných odpovědí / celkový počet) a vypočítané procento úspěšnosti.
5. **Přechod na další otázku:** Po krátké pauze (1,5 sekundy) se automaticky vygeneruje nová otázka a časovač se resetuje.

---

## 3. Architektura a souborová struktura

```text
quiz-app-v2-dynamic/
├── index.html            # Rozšířený HTML5 dokument o ukazatel času a statistik
├── style.css             # CSS styly rozšířené o animace a stavební třídy
├── styles-students.css   # Pracovní verze CSS s instrukcemi pro animace
├── script.js             # JS logika s časovačem, náhodností a statistikami
├── script-students.js    # Pracovní verze JS s nápovědou k Math a setInterval
└── README.md             # Dokumentace, aktualizovaný UML diagram
```

---

## 4. Detailní specifikace komponent a technologií

### A. HTML5 (Rozšíření rozhraní)
* **Nové prvky v DOM:**
  * `<div id="timer-display">`: Ukazatel zbývajícího času (textový odpočet a/nebo vizuální ukazatel).
  * `<div id="stats-bar">`: Panel zobrazující skóre (`<span id="score">0/0</span>`) a úspěšnost v % (`<span id="accuracy">0%</span>`).

### B. CSS3 (Animace a dynamické třídy)
* **Stavové třídy:**
  * `.answer-btn.correct`: Zelené pozadí + jemná pulsní animace (`@keyframes correct-pulse`).
  * `.answer-btn.wrong`: Červené pozadí + animace zatřesení (`@keyframes shake`).
  * `.disabled`: Vypnutí interakce s tlačítky během vyhodnocování (`pointer-events: none`).
* **CSS Transitions:** Hladký přechod barev a velikostí prvků při změně stavu.

### C. JavaScript ES6+ (Logika, časovač a matematika)
* **Generování náhodnosti:**
  * Pomocná funkce `randint(min, max)` využívající `Math.floor(Math.random() * (max - min + 1)) + min`.
  * Algoritmus pro míchání pořadí odpovědí v poli (Shuffle), aby správná odpověď nebyla vždy na stejném místě.
* **Časovač (Asynchronní JS):**
  * Spuštění odpočtu pomocí `setInterval(callback, 1000)`.
  * Zastavení odpočtu pomocí `clearInterval(timerId)`.
  * Automatické vyhodnocení po vypršení limitu.
* **Správa statistik a stavu aplikace:**
  * Proměnné stavu: `totalQuestions`, `correctAnswers`, `timeLeft`.
  * Výpočet úspěšnosti: `Math.round((correctAnswers / totalQuestions) * 100)`.
* **Časované přechody:**
  * Využití `setTimeout(nextQuestion, 1500)` pro krátké pozastavení po kliknutí na odpověď, aby si uživatel stihl prohlédnout animaci zpětné vazby.

---

## 5. Akceptační kritéria pro vývojáře
- [ ] Otázky a pozice správných odpovědí se generují dynamicky a náhodně.
- [ ] Na obrazovce je funkční časovač, který reálně odpočítává sekundy.
- [ ] Po vypršení času časovače se možnost zablokuje a započítá se neúspěšný pokus.
- [ ] Kliknutí na odpověď vyvolá příslušnou CSS animaci (zelená/červená) a dočasně zablokuje další klikání.
- [ ] Po zodpovězení se přes `setTimeout` načte nová otázka a časovač se vynuluje.
- [ ] Panel statistik správně počítá a zobrazuje celkové skóre a procentuální úspěšnost.
