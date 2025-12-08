```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhraseCraft - Full Training</title>
    <style>
        :root {
            --bg-color: #121212;
            --card-bg: #1e1e1e;
            --text-color: #e0e0e0;
            --accent-color: #bb86fc;
            --success-color: #03dac6;
            --error-color: #cf6679;
            --button-bg: #2d2d2d;
            --button-hover: #3d3d3d;
            --selected-color: #3700b3;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background-color: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            width: 100%;
            max-width: 600px;
            text-align: center;
        }

        h2 { color: var(--accent-color); margin-bottom: 10px; }

        .progress-bar {
            width: 100%; height: 6px; background-color: #333;
            border-radius: 3px; margin-bottom: 20px; overflow: hidden;
        }
        .progress-fill {
            height: 100%; background-color: var(--accent-color);
            width: 0%; transition: width 0.3s ease;
        }

        .stats {
            font-size: 0.9em; color: #888; margin-bottom: 20px;
            display: flex; justify-content: space-between;
        }

        .question-box { margin-bottom: 30px; }
        .prompt-text { font-size: 1.2em; margin-bottom: 10px; color: #bbb; }
        .main-sentence {
            font-size: 1.3em; font-weight: bold; margin-bottom: 20px;
            min-height: 60px; display: flex; align-items: center; justify-content: center;
            padding: 0 10px; line-height: 1.4;
        }

        /* --- TAREFA 1: MATCHING (LIGAR COLUNAS) --- */
        .match-container {
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }
        .match-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .match-item {
            background-color: var(--button-bg);
            border: 1px solid #444;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            user-select: none;
            font-size: 0.95em;
        }
        .match-item:hover { border-color: var(--accent-color); }
        
        .match-item.selected {
            background-color: var(--selected-color);
            border-color: var(--accent-color);
            color: white;
        }
        .match-item.matched {
            background-color: transparent;
            border-color: var(--success-color);
            color: var(--success-color);
            opacity: 0.5;
            cursor: default;
            pointer-events: none;
        }
        .match-item.error {
            background-color: var(--error-color);
            border-color: var(--error-color);
            color: white;
            animation: shake 0.4s;
        }

        /* --- TAREFA: MULTIPLA ESCOLHA --- */
        .options-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .option-btn {
            background-color: var(--button-bg); color: var(--text-color);
            border: 1px solid #444; padding: 15px; border-radius: 8px;
            cursor: pointer; font-size: 1.0em; transition: all 0.2s;
        }
        .option-btn:hover { background-color: var(--button-hover); border-color: var(--accent-color); }

        /* --- TAREFA: JUMBLE --- */
        .jumble-area {
            display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
            margin-bottom: 20px; min-height: 50px; padding: 10px;
            border: 1px dashed #444; border-radius: 8px;
        }
        .word-bank { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .word-tag {
            background-color: var(--button-bg); padding: 8px 15px;
            border-radius: 20px; cursor: pointer; border: 1px solid var(--accent-color);
            user-select: none;
        }
        .word-tag:hover { background-color: var(--accent-color); color: #000; }

        /* --- TAREFA: SPEECH --- */
        .mic-btn {
            background-color: var(--button-bg); border: 2px solid var(--accent-color);
            color: var(--accent-color); width: 80px; height: 80px;
            border-radius: 50%; font-size: 2em; cursor: pointer;
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px auto;
        }
        .mic-btn.listening {
            background-color: var(--error-color); color: white; border-color: var(--error-color);
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(207, 102, 121, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(207, 102, 121, 0); }
            100% { box-shadow: 0 0 0 0 rgba(207, 102, 121, 0); }
        }
        .speech-feedback { min-height: 30px; margin-top: 15px; font-style: italic; color: #888; }

        /* --- UTILITARIOS --- */
        .check-btn {
            background-color: var(--accent-color); color: #000; border: none;
            padding: 10px 30px; border-radius: 5px; font-weight: bold;
            cursor: pointer; margin-top: 15px; font-size: 1.1em;
        }
        .correct { background-color: var(--success-color) !important; color: #000 !important; border-color: var(--success-color) !important; }
        .wrong { background-color: var(--error-color) !important; color: white !important; border-color: var(--error-color) !important; animation: shake 0.5s; }
        @keyframes shake {
            0% { transform: translateX(0); } 25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); }
        }
        .hidden { display: none; }
        #final-screen h1 { color: var(--success-color); }
    </style>
</head>
<body>

<main class="container">
    <section id="quiz-screen">
        <h2>PhraseCraft Training</h2>
        
        <div class="stats">
            <span id="progress-text">Carregando...</span>
            <span>Score: <span id="score">0</span></span>
        </div>
        
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>

        <div class="question-box">
            <div class="prompt-text" id="prompt-text">...</div>
            <div class="main-sentence" id="question-display">...</div>
        </div>

        <div id="match-area-wrapper" class="hidden">
            <div class="match-container">
                <div class="match-column" id="col-left"></div> <div class="match-column" id="col-right"></div> </div>
            <p style="font-size:0.8em; color:#666; margin-top:15px;">Selecione os pares correspondentes</p>
        </div>

        <div id="multiple-choice-area" class="options-grid hidden"></div>

        <div id="speech-area-wrapper" class="hidden">
            <button id="mic-btn" class="mic-btn" onclick="toggleSpeech()">🎤</button>
            <p style="font-size: 0.9em; margin-bottom: 5px;">Toque para falar</p>
            <div id="speech-result" class="speech-feedback">...</div>
        </div>

        <div id="jumble-area-wrapper" class="hidden">
            <div class="jumble-area" id="answer-zone"></div>
            <div class="word-bank" id="word-bank"></div>
            <button class="check-btn" onclick="checkJumble()">Verificar</button>
            <button class="check-btn" onclick="resetJumble()" style="background-color: #444; color: white; margin-left: 10px;">Limpar</button>
        </div>
    </section>

    <section id="final-screen" class="hidden">
        <h1>Training Completed!</h1>
        <p>Você dominou estas frases.</p>
        <p style="font-size: 1.5em; margin: 20px 0;">Acertos: <span id="final-score"></span>/25</p>
        <button class="check-btn" onclick="location.reload()">Reiniciar</button>
    </section>
</main>

<script>
    // --- 1. DADOS (Sentences + Vocabulário) ---
    // Adicionei o objeto 'vocab' para simular o retorno da API de tradução
    const sentencesData = [
        { 
            id: 1, 
            en: "The sun was setting behind the mountains.", 
            pt: "O sol estava se pondo atrás das montanhas.",
            vocab: [
                {en: "Sun", pt: "Sol"}, {en: "Setting", pt: "Se pondo"}, 
                {en: "Behind", pt: "Atrás"}, {en: "Mountains", pt: "Montanhas"}
            ]
        },
        { 
            id: 2, 
            en: "The sky turned a beautiful shade of orange.", 
            pt: "O céu ficou com um lindo tom de laranja.",
            vocab: [
                {en: "Sky", pt: "Céu"}, {en: "Turned", pt: "Ficou/Tornou"},
                {en: "Beautiful", pt: "Lindo"}, {en: "Orange", pt: "Laranja"}
            ]
        },
        { 
            id: 3, 
            en: "Birds were flying back to their nests.", 
            pt: "Os pássaros estavam voando de volta para seus ninhos.",
            vocab: [
                {en: "Birds", pt: "Pássaros"}, {en: "Flying", pt: "Voando"},
                {en: "Back", pt: "De volta"}, {en: "Nests", pt: "Ninhos"}
            ]
        },
        { 
            id: 4, 
            en: "A cool breeze started to blow gently.", 
            pt: "Uma brisa fresca começou a soprar suavemente.",
            vocab: [
                {en: "Cool", pt: "Fresca"}, {en: "Breeze", pt: "Brisa"},
                {en: "Blow", pt: "Soprar"}, {en: "Gently", pt: "Suavemente"}
            ]
        },
        { 
            id: 5, 
            en: "It was the perfect end to a long day.", 
            pt: "Foi o final perfeito para um longo dia.",
            vocab: [
                {en: "Perfect", pt: "Perfeito"}, {en: "End", pt: "Final"},
                {en: "Long", pt: "Longo"}, {en: "Day", pt: "Dia"}
            ]
        }
    ];

    // --- 2. VARIAVEIS GLOBAIS ---
    let quizQueue = [];
    let currentIndex = 0;
    let score = 0;
    let currentTask = null;
    let recognition = null;
    let isListening = false;
    let matchState = { selectedId: null, selectedSide: null, selectedElement: null, matchesFound: 0 };

    // --- 3. ELEMENTOS DOM ---
    const ui = {
        screenQuiz: document.getElementById('quiz-screen'),
        screenFinal: document.getElementById('final-screen'),
        progressText: document.getElementById('progress-text'),
        progressFill: document.getElementById('progress-fill'),
        score: document.getElementById('score'),
        prompt: document.getElementById('prompt-text'),
        display: document.getElementById('question-display'),
        
        // Areas
        matchWrapper: document.getElementById('match-area-wrapper'),
        mcArea: document.getElementById('multiple-choice-area'),
        speechWrapper: document.getElementById('speech-area-wrapper'),
        jumbleWrapper: document.getElementById('jumble-area-wrapper'),
        
        // Match Elements
        colLeft: document.getElementById('col-left'),
        colRight: document.getElementById('col-right'),

        // Speech Elements
        speechResult: document.getElementById('speech-result'),
        micBtn: document.getElementById('mic-btn'),

        // Jumble Elements
        answerZone: document.getElementById('answer-zone'),
        wordBank: document.getElementById('word-bank')
    };

    // --- 4. CONFIGURAÇÃO SPEECH API ---
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true; ui.micBtn.classList.add('listening');
            ui.speechResult.innerText = "Ouvindo..."; ui.speechResult.style.color = "#888";
        };
        recognition.onend = () => { isListening = false; ui.micBtn.classList.remove('listening'); };
        recognition.onresult = (e) => processSpeechResult(e.results[0][0].transcript);
        recognition.onerror = (e) => { 
            isListening = false; ui.micBtn.classList.remove('listening'); 
            if(e.error !== 'no-speech') ui.speechResult.innerText = "Erro: " + e.error; 
        };
    } else {
        ui.micBtn.style.display = 'none';
        ui.speechResult.innerText = "Navegador sem suporte a voz.";
    }

    // --- 5. LOGICA PRINCIPAL ---
    function init() {
        generateTasks();
        loadTask();
    }

    function generateTasks() {
        sentencesData.forEach(sentence => {
            // TAREFA 1: MATCHING (Vocabulário)
            quizQueue.push({ type: 'match', vocab: sentence.vocab, sentence: sentence });

            // TAREFA 2: PT -> EN
            quizQueue.push({ type: 'pt_to_en', question: sentence.pt, correct: sentence.en, distractor: getRandomDistractor(sentence.id, 'en') });

            // TAREFA 3: EN -> PT
            quizQueue.push({ type: 'en_to_pt', question: sentence.en, correct: sentence.pt, distractor: getRandomDistractor(sentence.id, 'pt') });

            // TAREFA 4: SPEAKING
            quizQueue.push({ type: 'speaking', question: sentence.en, correct: sentence.en });

            // TAREFA 5: JUMBLE
            quizQueue.push({ type: 'jumble', pt: sentence.pt, correct: sentence.en });
        });
    }

    function getRandomDistractor(currentId, lang) {
        const others = sentencesData.filter(s => s.id !== currentId);
        return others[Math.floor(Math.random() * others.length)][lang];
    }

    // --- 6. RENDERIZAÇÃO DE TAREFAS ---
    function loadTask() {
        if (currentIndex >= quizQueue.length) { finishQuiz(); return; }

        currentTask = quizQueue[currentIndex];
        
        // Atualiza UI
        ui.progressText.innerText = `Tarefa ${currentIndex + 1}/${quizQueue.length}`;
        ui.progressFill.style.width = `${((currentIndex) / quizQueue.length) * 100}%`;
        
        // Reset Views
        hideAllAreas();

        // Router
        if (currentTask.type === 'match') setupMatch();
        else if (currentTask.type === 'speaking') setupSpeaking();
        else if (currentTask.type === 'jumble') setupJumble();
        else setupMultipleChoice();
    }

    function hideAllAreas() {
        ui.matchWrapper.classList.add('hidden');
        ui.mcArea.classList.add('hidden');
        ui.speechWrapper.classList.add('hidden');
        ui.jumbleWrapper.classList.add('hidden');
        
        ui.mcArea.innerHTML = '';
        ui.answerZone.innerHTML = '';
        ui.wordBank.innerHTML = '';
        ui.speechResult.innerText = '...';
        ui.speechResult.style.color = '#888';
    }

    // --- 7. TAREFA: MATCHING (NOVO) ---
    function setupMatch() {
        ui.matchWrapper.classList.remove('hidden');
        ui.prompt.innerText = "Vocabulário";
        ui.display.innerText = "Ligue as palavras:";
        
        ui.colLeft.innerHTML = '';
        ui.colRight.innerHTML = '';
        matchState = { selectedId: null, selectedSide: null, selectedElement: null, matchesFound: 0 };

        // Prepara pares e embaralha
        let pairs = currentTask.vocab; 
        let leftItems = pairs.map((p, i) => ({ id: i, text: p.en, side: 'left' }));
        let rightItems = pairs.map((p, i) => ({ id: i, text: p.pt, side: 'right' }));

        leftItems.sort(() => Math.random() - 0.5);
        rightItems.sort(() => Math.random() - 0.5);

        // Renderiza
        leftItems.forEach(item => createMatchItem(item, ui.colLeft));
        rightItems.forEach(item => createMatchItem(item, ui.colRight));
    }

    function createMatchItem(item, parent) {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.innerText = item.text;
        div.dataset.id = item.id;
        div.dataset.side = item.side;
        div.onclick = () => handleMatchClick(div, item.id, item.side);
        parent.appendChild(div);
    }

    function handleMatchClick(el, id, side) {
        if (el.classList.contains('matched') || el.classList.contains('error')) return;

        // Se clicou no mesmo que já estava selecionado, desmarca
        if (matchState.selectedElement === el) {
            el.classList.remove('selected');
            resetMatchState();
            return;
        }

        // Primeiro clique
        if (!matchState.selectedElement) {
            matchState.selectedElement = el;
            matchState.selectedId = id;
            matchState.selectedSide = side;
            el.classList.add('selected');
            return;
        }

        // Segundo clique (verificar par)
        const prevEl = matchState.selectedElement;
        
        // Verifica se clicou no mesmo lado (não permitido)
        if (matchState.selectedSide === side) {
            prevEl.classList.remove('selected');
            matchState.selectedElement = el;
            matchState.selectedId = id;
            el.classList.add('selected');
            return;
        }

        // Verifica Match
        if (matchState.selectedId === id) {
            // ACERTOU
            el.classList.add('matched');
            prevEl.classList.remove('selected');
            prevEl.classList.add('matched');
            resetMatchState();
            
            matchState.matchesFound++;
            if (matchState.matchesFound === currentTask.vocab.length) {
                score++;
                ui.score.innerText = score;
                setTimeout(nextTask, 1000);
            }
        } else {
            // ERROU
            el.classList.add('error');
            prevEl.classList.add('error');
            prevEl.classList.remove('selected');
            
            setTimeout(() => {
                el.classList.remove('error');
                prevEl.classList.remove('error');
            }, 500);
            resetMatchState();
        }
    }

    function resetMatchState() {
        matchState = { selectedId: null, selectedSide: null, selectedElement: null, matchesFound: matchState.matchesFound };
    }


    // --- 8. OUTRAS TAREFAS (Lógica Mantida) ---
    function setupMultipleChoice() {
        ui.mcArea.classList.remove('hidden');
        ui.display.innerText = currentTask.question;
        ui.prompt.innerText = currentTask.type === 'pt_to_en' ? "Traduza para Inglês:" : "Traduza para Português:";

        const options = [
            { text: currentTask.correct, isCorrect: true },
            { text: currentTask.distractor, isCorrect: false }
        ];
        options.sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.text;
            btn.onclick = () => handleMCClick(btn, opt.isCorrect);
            ui.mcArea.appendChild(btn);
        });
    }

    function handleMCClick(btn, isCorrect) {
        const allBtns = ui.mcArea.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);
        if (isCorrect) {
            btn.classList.add('correct'); score++; ui.score.innerText = score;
        } else {
            btn.classList.add('wrong');
            allBtns.forEach(b => { if (b.innerText === currentTask.correct) b.classList.add('correct'); });
        }
        setTimeout(nextTask, 1500);
    }

    // --- SPEECH ---
    function setupSpeaking() {
        ui.speechWrapper.classList.remove('hidden');
        ui.prompt.innerText = "Leia em voz alta:";
        ui.display.innerText = currentTask.question;
    }

    function toggleSpeech() {
        if (!recognition) return;
        if (isListening) { recognition.stop(); return; }
        try { recognition.start(); } catch (e) { console.warn(e); }
    }

    function processSpeechResult(spokenText) {
        const similarity = avaliarPronuncia(currentTask.correct, spokenText);
        if (similarity >= 70) {
            ui.speechResult.style.color = "var(--success-color)";
            ui.speechResult.innerHTML = `Correto! <br>Você disse: "<b>${spokenText}</b>"`;
            ui.micBtn.disabled = true; score++; ui.score.innerText = score;
            setTimeout(() => { ui.micBtn.disabled = false; nextTask(); }, 2000);
        } else {
            ui.speechResult.style.color = "var(--error-color)";
            ui.speechResult.innerHTML = `Tente de novo. <br>Ouvi: "<b>${spokenText}</b>"`;
        }
    }

    // --- JUMBLE ---
    function setupJumble() {
        ui.jumbleWrapper.classList.remove('hidden');
        ui.display.innerText = "Monte a frase:";
        ui.prompt.innerText = `Ref: "${currentTask.pt}"`; 
        let words = currentTask.correct.split(' ');
        words.sort(() => Math.random() - 0.5);
        words.forEach(word => createWordTag(word, ui.wordBank));
    }

    function createWordTag(text, parent) {
        const span = document.createElement('span');
        span.className = 'word-tag'; span.innerText = text;
        span.onclick = function() {
            (this.parentElement === ui.wordBank ? ui.answerZone : ui.wordBank).appendChild(this);
        };
        parent.appendChild(span);
    }

    function checkJumble() {
        const userWords = Array.from(ui.answerZone.children).map(t => t.innerText).join(' ');
        if (userWords === currentTask.correct) {
            ui.answerZone.style.border = "2px solid var(--success-color)";
            score++; ui.score.innerText = score;
            setTimeout(() => { ui.answerZone.style.border = "1px dashed #444"; nextTask(); }, 1500);
        } else {
            ui.answerZone.style.border = "2px solid var(--error-color)";
        }
    }
    
    function resetJumble() { Array.from(ui.answerZone.children).forEach(tag => ui.wordBank.appendChild(tag)); }

    // --- UTIL ---
    function nextTask() { currentIndex++; loadTask(); }
    function finishQuiz() {
        ui.screenQuiz.classList.add('hidden');
        ui.screenFinal.classList.remove('hidden');
        document.getElementById('final-score').innerText = score;
    }

    // Levenshtein Simples
    function avaliarPronuncia(esperado, capturado) {
        const cleanExp = esperado.toLowerCase().replace(/[.,!?;:]/g, "").split(" ");
        const cleanCap = capturado.toLowerCase().replace(/[.,!?;:]/g, "").split(" ");
        let total = 0;
        for(let i=0; i<cleanExp.length; i++) {
            if(cleanCap[i] && cleanExp[i] === cleanCap[i]) total += 100; // Simplificado para igualdade exata ou mudar para Levenshtein completo se preferir
            else if (cleanCap[i]) total += 50; // Parcial
        }
        return total / cleanExp.length;
    }

    init();
</script>
</body>
</html>

```
