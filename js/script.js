// Globais do Jogo alinhadas estritamente com o HTML
let p1Score = 0; 
let p2Score = 0; 
let perguntasSorteadas = [];
let currentCell = null;
let currentQuestion = null;
let discoveredShipSquares = 0;
let turnoAtual = 'p1'; // 'p1' para o BEM, 'p2' para o MAL

const columnsLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const totalShipSquares = 14; // Soma total de blocos (4 + 3 + 2 + 2 + 2 + 1)
const pointsTable = { water: 10, rock: 20, carrier: 50, battleship: 40, destroyer: 30, whatis: 25, submarine: 20, patrol: 15 };

// Configuração dos barcos gerados dinamicamente no mapa
const CONFIG_BARCOS = [
    { type: 'carrier', tamanho: 4 },    // O Livro dos Espíritos
    { type: 'battleship', tamanho: 3 }, // O Evangelho Segundo o Espiritismo
    { type: 'destroyer', tamanho: 2 },  // O Livro dos Médiuns
    { type: 'whatis', tamanho: 2 },     // O Que é o Espiritismo
    { type: 'patrol', tamanho: 2 },     // A Gênese
    { type: 'submarine', tamanho: 1 }   // O Céu e o Inferno
];
const QUANTIDADE_PEDRAS = 2; 

// Inicializa a matriz 7x7 vazia
let shipMap = Array(7).fill(0).map(() => Array(7).fill(0));

const perguntasEspiritismo = [
    { q: "Qual é o nome da mediunidade, no qual o médium sente a presença de espíritos?", options: ["Mediunidade psicofônica", "Mediunidade sensitiva", "Mediunidade psicográfica", "Mediunidade de vidência."], answer: 1 },
    { q: "Qual é o nome da mediunidade, no qual o espírito atua sobre a mão do médium para escrever?", options: ["Mediunidade Sonambúlica.", "Mediunidade de tiptografia.", "Mediunidade de psicografia.","Mediunidade de vidência."], answer: 2 },
    { q: "Qual o nome da mediunidade, no qual espírito atua sobre as cordas vocais do médium para falar?", options: ["Mediunidade de psicofonia.", "Mediunidade de Paleontologia", "Mediunidade sensitiva", "Mediunidade de vidência."], answer: 0 },
    { q: "Qual é o nome da mediunidade, no qual o médium vê os espíritos?", options: ["Mediunidade de audiência.", "Mediunidade de tato.", "Mediunidade onírica.","Mediunidade de vidência."], answer: 3 },   
    { q: "Qual obra aborda a mediunidade e a comunicação com o mundo invisível?", options: ["O Evangelho segundo o Espiritismo", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },   
    { q: "Qual livro aborda a justiça divina, as penas e os gozos futuros?", options: ["O Livro dos Espíritos", "A Gênese", "O Céu e o Inferno", "O Livro dos Médiuns"], answer: 2 },    
    { q: "Qual o nome dado à mediunidade em que o Espírito escreve diretamente em um papel, sem utilizar a mão do médium?", options: ["Psicografia mecânica", , "Criptografia espiritual", "Tiptologia","Pneumatografia ou Escrita Direta"], answer: 3 },
    { q: "Segundo a Doutrina Espírita, qual é a principal defesa de um médium contra a aproximação de Espíritos imperfeitos ou obsessores?", options: ["O isolamento social completo", "A reforma íntima e a vigilância dos próprios pensamentos", "O uso de amuletos e objetos de proteção física", "A leitura mecânica de preces sem reflexão"], answer: 1 },
    { q: "Como Kardec define o médium que escreve sob a influência do Espírito, mas tem plena consciência do que está escrevendo enquanto o faz?", options: ["Médium mecânico", "Médium semimecânico", "Médium intuitivo ou consciente", "Médium sonambúlico"], answer: 2 },
    { q: "O que é o 'perispírito' no contexto do intercâmbio mediúnico?", options: [ "A colônia espiritual onde vivem os protetores", "O envoltório fluídico e semimaterial que une o Espírito ao corpo físico", "O nome do fluido que gera as pancadas nas mesas","O corpo físico do médium após o transe"], answer: 3 },
    { q: "Qual o termo utilizado em 'O Livro dos Médiuns' para designar a inteligência que se manifesta, independentemente do médium?", options: ["Espírito comunicante", "Alma penada", "Duplo etérico", "Ego transcendental"], answer: 0 },
     { q: "Segundo 'O Livro dos Médiuns', qual é o nome dado aos médiuns que ouvem a voz dos Espíritos?", options: ["Médiuns videntes",  "Médiuns psicofônicos", "Médiuns pneumatógrafos","Médiuns audientes"], answer: 3 },
    { q: "Qual o nome do fluido animalizado, próprio do corpo físico, que o médium de efeitos físicos doa para a ocorrência de fenômenos materiais?", options: ["Fluido Cósmico Universal", "Ectoplasma", "Perispírito", "Fluido Vital Puro"], answer: 1 },
    { q: "Como Kardec classifica o grau mais grave de obsessão, onde há o constrangimento físico e a paralisia da vontade do médium?", options: ["Obsessão simples", "Fascinação",  "Possessão material","Subjugação"], answer: 3 },
    { q: "O que caracteriza o fenômeno da 'psicofonia' na prática mediúnica?", options: ["A transmissão do pensamento do Espírito através da fala do médium", "A escrita direta dos Espíritos sem o uso da mão do médium", "A aparição visual de um Espírito materializado", "O som de pancadas e ruídos nas paredes"], answer: 0 }
    
];


perguntasEspiritismo.push(
    { q: "De acordo com a Doutrina Espírita, qual é o principal objetivo do desenvolvimento da mediunidade no ser humano?", options: ["Obter vantagens financeiras e materiais", "Prever o futuro e adivinhar a sorte das pessoas","Alcançar a fama e o reconhecimento social", "Servir de instrumento para o progresso moral e auxílio ao próximo" ], answer: 3 },
    { q: "Qual o nome da mediunidade, no qual os espíritos movimentam objetos através dos fluídos do médium e do fluido universal?", options: ["Mediunidade de efeitos paranormais.", "Mediunidade de efeitos intelectuais.", "Mediunidade de efeitos morais.", "Mediunidade de efeitos físicos."], answer: 3 },
    { q: "Qual é o nome da mediunidade, no qual o médium transmite energias espirituais coradoras por influência de um espírito?", options: ["Mediunidade de transmissão", "Mediunidade de cura.", "Mediunidade de luz.", "Mediunidade de paz."], answer: 1 },
    { q: "Qual é o nome da mediunidade, no qual o médium possui uma vaga intuição de coisas futuras que vão ocorrer?", options: ["Mediunidade de pressentimento.", "Mediunidade de cognição.", "Mediunidade de invenção.", "Mediunidade de previsão."], answer: 0 },
    { q: "Variedade rara de médiuns, no qual o médium escreve ou fala em línguas que lhe são estranhas?", options: ["Médiuns poliglotas.", "Médiuns inteligentes", "Médiuns extrovertidos", "Médiuns altruistas"], answer: 0 },
    { q: "Qual é o nome da mediunidade, no qual o médium pode transmitir seu próprio pensamento na emancipação da sua alma?", options: ["Mediunidade sonhadora.", "Mediunidade incompleta.", "Mediunidade terciãria.", "Mediunidade sonambúlica."], answer: 3 },   
    { q: "Onde começaram as manifestações que deram origem às investigações de Kardec?", options: ["Nas mesas girantes em Paris", "Em reuniões mediúnicas no Brasil", "Em monastérios no Tibete", "Em templos religiosos na Inglaterra"], answer: 0 },   
    { q: "Qual médium brasileiro psicografou mais de 450 livros e doou todos os direitos autorais?", options: ["Divaldo Franco", "Chico Xavier", "Zíbia Gasparetto", "Yvonne do Amaral Pereira"], answer: 1 },   
    { q: "Qual livro da Codificação Espírita é considerado o guia teórico e prático da mediunidade?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Como o Espiritismo define a mediunidade?", options: ["Um dom sobrenatural e milagroso", "Uma faculdade orgânica e natural do ser humano", "Um privilégio concedido apenas a santos", "Uma doença psicológica grave"], answer: 1 },
    { q: "Qual o nome dado ao médium que serve de canal para que os Espíritos escrevam?", options: ["Médium de efeitos físicos", "Médium psicógrafo", "Médium audiente", "Médium vidente"], answer: 1 },   
    { q: "Segundo o Espiritismo, qual é a natureza do fenômeno do sonho?", options: ["Uma ilusão cerebral sem qualquer significado", "A emancipação da alma durante o repouso do corpo", "Um aviso físico sobre doenças futuras", "A perda temporária da memória espiritual"], answer: 1 },
    { q: "Com que frequência os Espíritos influenciam os nossos pensamentos e ações no dia a dia?", options: ["Apenas em momentos de grande perigo", "Nunca influenciam, pois o livre-arbítrio é absoluto", "Muito mais do que imaginais, pois frequentemente são eles que vos dirigem", "Apenas quando estamos dormindo"], answer: 2 },
    { q: "Qual o nome das duas jovens irmãs cujos fenômenos mediúnicos deram origem aos episódios de Hydesville em 1848?", options: ["Irmãs Fox", "Irmãs Boudet", "Irmãs Brontë", "Irmãs Baudin"], answer: 0 },   
    { q: "Como a Doutrina Espírita orienta que deve ser encarada a prática da mediunidade?", options: ["Como uma profissão lucrativa", "Como um compromisso moral e gratuito de auxílio ao próximo", "Como um entretenimento para salões sociais", "Como um segredo que nunca deve ser revelado"], answer: 1 },
    { q: "Qual é o principal critério ensinado por Kardec para julgar a qualidade das comunicações espíritas?", options: ["A assinatura de um nome famoso no final", "A beleza poética da linguagem utilizada", "A lógica, o bom senso e o rigor moral do conteúdo", "A rapidez com que a mensagem foi escrita"], answer: 2 },   
    { q: "Qual o nome dado à obsessão em seu grau mais grave, onde o Espírito obsessor assume o controle temporário dos movimentos do corpo físico do indivíduo?", options: ["Obsessão simples", "Fascinação", "Subjugação", "Passe"], answer: 2 },

);



function generateDynamicQuestion() {
    if (perguntasSorteadas.length === perguntasEspiritismo.length) {
        perguntasSorteadas = [];
    }
    const disponiveis = perguntasEspiritismo.filter((_, idx) => !perguntasSorteadas.includes(idx));
    const perguntaEscolhida = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    
    const indiceOriginal = perguntasEspiritismo.indexOf(perguntaEscolhida);
    perguntasSorteadas.push(indiceOriginal);

    const opcoesComIndice = perguntaEscolhida.options.map((opt, idx) => ({
        texto: opt,
        correta: idx === perguntaEscolhida.answer
    }));

    const opcoesEmbaralhadas = opcoesComIndice.sort(() => Math.random() - 0.5);
    const novoIndiceCorreto = opcoesEmbaralhadas.findIndex(opt => opt.correta);
    const apenasTextos = opcoesEmbaralhadas.map(opt => opt.texto);

    return { q: perguntaEscolhida.q, options: apenasTextos, answer: novoIndiceCorreto };
}
function gerarMapaAleatorio() {
    shipMap = Array(7).fill(0).map(() => Array(7).fill(0));

    CONFIG_BARCOS.forEach(barco => {
        let posicionado = false;
        let tentativas = 0;

        while (!posicionado && tentativas < 100) {
            tentativas++;
            const horizontal = Math.random() < 0.5;
            const r = Math.floor(Math.random() * 7);
            const c = Math.floor(Math.random() * 7);

            if (horizontal && c + barco.tamanho > 7) continue;
            if (!horizontal && r + barco.tamanho > 7) continue;

            let espacoLivre = true;
            for (let i = 0; i < barco.tamanho; i++) {
                const checkRow = horizontal ? r : r + i;
                const checkCol = horizontal ? c + i : c;
                if (shipMap[checkRow][checkCol] !== 0) {
                    espacoLivre = false;
                    break;
                }
            }

            if (espacoLivre) {
                for (let i = 0; i < barco.tamanho; i++) {
                    const placeRow = horizontal ? r : r + i;
                    const placeCol = horizontal ? c + i : c;
                    shipMap[placeRow][placeCol] = barco.type;
                }
                posicionado = true;
            }
        }
    });

    let pedrasColocadas = 0;
    while (pedrasColocadas < QUANTIDADE_PEDRAS) {
        const pr = Math.floor(Math.random() * 7);
        const pc = Math.floor(Math.random() * 7);
        if (shipMap[pr][pc] === 0) {
            shipMap[pr][pc] = 'rock';
            pedrasColocadas++;
        }
    }
}

function createGameBoard() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    const emptyCorner = document.createElement('div');
    emptyCorner.classList.add('coord-label');
    grid.appendChild(emptyCorner);

    columnsLetters.forEach(letter => {
        const label = document.createElement('div');
        label.classList.add('coord-label');
        label.textContent = letter;
        grid.appendChild(label);
    });

    for (let r = 0; r < 7; r++) {
        const rowLabel = document.createElement('div');
        rowLabel.classList.add('coord-label');
        rowLabel.textContent = r + 1;
        grid.appendChild(rowLabel);

        for (let c = 0; c < 7; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            const coordLabel = columnsLetters[c] + (r + 1);
            cell.textContent = coordLabel;
            
            cell.addEventListener('click', () => {
                if (cell.classList.contains('disabled')) return;
                
                const targetType = shipMap[r][c];
                if (targetType === 'rock') {
                    cell.classList.add('disabled', 'claimed-p2', 'ship-rock'); 
                    p2Score += pointsTable.rock;
                    
                    const scoreP2El = document.getElementById('p2-score');
                    if (scoreP2El) scoreP2El.textContent = p2Score;
                    
                    alert(`🪨 Coordenada [${coordLabel}]: Você atingiu uma Alma Petrificada! Ponto automático gratuito para o MAL (+${pointsTable.rock} pts)!`);
                    checkGameEnd(); 
                    return; 
                }

                currentCell = cell;
                openQuiz(coordLabel);
            });
            
            grid.appendChild(cell);
        }
    }
}
function openQuiz(coordinate) {
    const modal = document.getElementById('quiz-modal');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    if (!modal || !questionText || !optionsContainer) return;

    currentQuestion = generateDynamicQuestion();
    
    const announcerInsideModal = document.getElementById('turn-announcer');
    if (announcerInsideModal) {
        if (turnoAtual === 'p1') {
            announcerInsideModal.textContent = `Vez do BEM 👥`;
            announcerInsideModal.style.color = '#00d2ff';
        } else {
            announcerInsideModal.textContent = `Vez do MAL 👁️`;
            announcerInsideModal.style.color = '#ff3366';
        }
    }

    questionText.innerHTML = `<span style="color: #94a3b8;">Disparo na Coordenada [${coordinate}]</span><br><br>${currentQuestion.q}`;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((opt, idx) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = opt;
        button.addEventListener('click', () => checkAnswer(idx, currentQuestion.answer));
        optionsContainer.appendChild(button);
    });

    modal.classList.remove('hidden');
}

function checkAnswer(selected, correct) {
    const modal = document.getElementById('quiz-modal');
    if (modal) modal.classList.add('hidden');
    if (!currentCell) return;
    
    const row = parseInt(currentCell.dataset.row);
    const col = parseInt(currentCell.dataset.col);
    const shipType = shipMap[row][col];

    currentCell.classList.add('disabled');
    let pointsGained = shipType !== 0 ? pointsTable[shipType] : pointsTable.water;

    if (selected === correct) {
        if (turnoAtual === 'p1') {
            p1Score += pointsGained;
            currentCell.classList.add('claimed-p1');
        } else {
            p2Score += pointsGained;
            currentCell.classList.add('claimed-p2');
        }

        if (shipType !== 0) {
            alert(`Boa! Resposta CORRETA. O jogador do ${turnoAtual.toUpperCase()} purificou um ${translateShip(shipType)} (+${pointsGained} pts)!`);
            currentCell.classList.add(`ship-${shipType}`);
            discoveredShipSquares++;
        } else {
            alert(`Resposta CORRETA, mas o tiro deu na água (+${pointsGained} pts para o ${turnoAtual.toUpperCase()}).`);
            currentCell.classList.add('water');
        }
    } else {
        if (turnoAtual === 'p1') {
            p2Score += pointsGained;
            currentCell.classList.add('claimed-p2');
            alert(`Resposta INCORRETA! O BEM falhou e as forças do MAL capturaram os pontos (+${pointsGained} pts para o MAL)!`);
        } else {
            p1Score += pointsGained;
            currentCell.classList.add('claimed-p1');
            alert(`Resposta INCORRETA! O MAL falhou e as forças do BEM resgataram os pontos (+${pointsGained} pts para o BEM)!`);
        }

        if (shipType !== 0) {
            currentCell.classList.add(`ship-${shipType}`);
            discoveredShipSquares++;
        } else {
            currentCell.classList.add('water');
        }
    }

    const scoreP1El = document.getElementById('p1-score');
    const scoreP2El = document.getElementById('p2-score');
    if (scoreP1El) scoreP1El.textContent = p1Score;
    if (scoreP2El) scoreP2El.textContent = p2Score;

    turnoAtual = (turnoAtual === 'p1') ? 'p2' : 'p1';

    const p1Panel = document.getElementById('p1-panel');
    const p2Panel = document.getElementById('p2-panel');
    if (p1Panel && p2Panel) {
        if (turnoAtual === 'p1') {
            p1Panel.classList.add('active');
            p2Panel.classList.remove('active');
        } else {
            p2Panel.classList.add('active');
            p1Panel.classList.remove('active');
        }
    }

    checkGameEnd();
}

function translateShip(type) {
    const names = { 
        carrier: "O Livro dos Espíritos", 
        battleship: "O Evangelho Segundo o Espiritismo", 
        destroyer: "O Livro dos Médiuns", 
        whatis: "O Que é o Espiritismo", 
        submarine: "O Céu e o Inferno", 
        patrol: "A Gênese" 
    };
    return names[type] || "Navio";
}

function checkGameEnd() {
    if (discoveredShipSquares === totalShipSquares) {
        let winnerText = "";
        if (p1Score > p2Score) {
            winnerText = "🏆 Vitória Gloriosa!\n\nAs forças do BEM triunfaram sobre o MAL!";
        } else if (p2Score > p1Score) {
            winnerText = "🔥 O MAL Venceu...\n\nAs forças da escuridão somaram mais pontos!";
        } else {
            winnerText = "🤝 Um equilíbrio perfeito! Houve um empate técnico!";
        }

        setTimeout(() => {
            alert(`${winnerText}\n\nPlacar Final:\nO BEM: ${p1Score} pontos\nO MAL: ${p2Score} pontos`);
            resetGame(); 
        }, 500);
    }
}

function resetGame() {
    discoveredShipSquares = 0;
    p1Score = 0;
    p2Score = 0;
    perguntasSorteadas = []; 
    currentCell = null;
    currentQuestion = null;
    turnoAtual = 'p1'; 

    const scoreP1El = document.getElementById('p1-score');
    const scoreP2El = document.getElementById('p2-score');
    if (scoreP1El) scoreP1El.textContent = "0";
    if (scoreP2El) scoreP2El.textContent = "0";
    
    const p1Panel = document.getElementById('p1-panel');
    const p2Panel = document.getElementById('p2-panel');
    if (p1Panel && p2Panel) {
        p1Panel.classList.add('active');
        p2Panel.classList.remove('active');
    }

    const modal = document.getElementById('quiz-modal');
    if (modal) modal.classList.add('hidden');
    
    alert("Nova Reencarnação definida! Uma localização totalmente nova foi gerada.");    
    gerarMapaAleatorio();
    createGameBoard();
}

// Inicialização automática do Jogo ao carregar a página
gerarMapaAleatorio();
createGameBoard();
