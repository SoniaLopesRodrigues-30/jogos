// --- PARTE 1: ESCOPO GLOBAL, CONFIGURAÇÕES E BANCO DE PERGUNTAS (1/2) ---
const columnsLetters = ["A", "B", "C", "D", "E", "F"];
const totalShipSquares = 12;

// Tabela de pontos por tipo de alvo (Adicionado as Pedras)
const pointsTable = {
    carrier: 50,     // Porta-Aviões
    battleship: 40,  // Encouraçado
    destroyer: 30,   // Contratorpedeiro
    submarine: 30,   // Submarino
    patrol: 20,      // Navio de Patrulha
    rock: 20,        // NOVO: Almas Pedras (Pontos grátis para o MAL)
    water: 10        // Água
};

// Controle de estado do jogo (O BEM contra o placar do MAL)
let discoveredShipSquares = 0; 
let p1Score = 0; // Pontos do BEM
let p2Score = 0; // Pontos do MAL
let currentCell = null;
let currentQuestion = null;
let perguntasSorteadas = [];

// Mapa 6x6 totalmente preenchido (Adicionado 4 Almas Pedras estratégicas)
const shipMap = [
    ['carrier', 'carrier', 'carrier', 'carrier', 0, 0],
    [0, 'battleship', 'battleship', 'battleship', 0, 'rock'], // Pedra em F2
    [0, 0, 'destroyer', 'destroyer', 0, 0],
    ['rock', 0, 0, 'submarine', 'submarine', 0],             // Pedra em A4
    [0, 0, 0, 0, 'patrol', 'rock'],                           // Pedra em F5
    [0, 'rock', 0, 0, 0, 0]                                    // Pedra em B6
];

// Elementos do DOM
const gridElement = document.getElementById('grid');
const modal = document.getElementById('quiz-modal');
const turnAnnouncer = document.getElementById('turn-announcer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// Banco de dados de perguntas sobre o Espiritismo
const perguntasEspiritismo = [
    { q: "Quem foi o codificador da Doutrina Espírita?", options: ["Chico Xavier", "Allan Kardec", "Léon Denis", "Emmanuel"], answer: 1 },
    { q: "Qual foi a primeira obra da Codificação Espírita, lançada em 1857?", options: ["O Livro dos Médiuns", "O Evangelho segundo o Espiritismo", "O Livro dos Espíritos", "A Gênese"], answer: 2 },
    { q: "Qual era o nome real de Allan Kardec?", options: ["Hippolyte Léon Denizard Rivail", "Léon Denis", "Gabriel Delanne", "Amélie Boudet"], answer: 0 },
    { q: "Quantas obras principais formam a Codificação Espírita?", options: ["3 obras", "4 obras", "5 obras", "6 obras"], answer: 2 },
    { q: "Qual livro da codificação explica as leis morais e a vida espiritual?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "O Céu e o Inferno", "A Gênese"], answer: 0 },
    { q: "Qual obra aborda a mediunidade e a comunicação com o mundo invisível?", options: ["O Evangelho segundo o Espiritismo", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Segundo o Espiritismo, qual é o objetivo principal da reencarnação?", options: ["Punição eterna", "Evolução moral e intelectual", "Esquecer o passado", "Apenas viver na Terra"], answer: 1 },
    { q: "Qual livro aborda a justiça divina, as penas e os gozos futuros?", options: ["O Livro dos Espíritos", "A Gênese", "O Céu e o Inferno", "O Livro dos Médiuns"], answer: 2 },
    { q: "Qual é o nome do laço fluídico que une o corpo físico ao perispírito?", options: ["Cordão de prata", "Fluido vital", "Duplo etérico", "Laço magnético"], answer: 0 },
    { q: "A quem os espíritas consideram o maior modelo e guia para a humanidade?", options: ["Allan Kardec", "Jesus", "Chico Xavier", "Anjo da Guarda"], answer: 1 },
    { q: "Em qual categoria de mundos a Terra se encontra atualmente segundo a escala evolutiva?", options: ["Mundo Primitivo", "Mundo de Provas e Expiações", "Mundo de Regeneração", "Mundo Feliz"], answer: 1 },
    { q: "Qual o nome do princípio universal do qual derivam todas as formas de matéria no universo?", options: ["Fluido Cósmico Universal", "Energia Escura", "Matéria Ectoplásmica", "Fluido Espiritual"], answer: 0 },
    { q: "Qual é o nome do envoltório semimaterial que serve de ligação entre o Espírito e o corpo?", options: ["Corpo Astral", "Perispírito", "Alma", "Duplo Vital"], answer: 1 },
    { q: "Como o Espiritismo define a situação da alma após a morte do corpo?", options: ["Adormece até o juízo final", "Mantém sua individualidade e continua sua evolução", "Funde-se imediatamente com o Absoluto", "Deixa de existir"], answer: 1 },
    { q: "De acordo com as Leis Morais, qual é o principal objetivo da Lei de Sociedade?", options: ["Permitir o progresso mútuo através da convivência", "Garantir a sobrevivência dos mais fortes", "Criar divisões de classes sociais", "Impor regras de conduta severas"], answer: 0 }
];
// --- PARTE 2: CONTINUAÇÃO DO BANCO DE PERGUNTAS E CRIAÇÃO DO TABULEIRO ---
perguntasEspiritismo.push(
    { q: "O que significa o termo 'Erraticidade' na Doutrina Espírita?", options: ["O estado de erro constante do ser humano", "O intervalo entre duas encarnações corporais", "A perda completa da memória de vidas passadas", "O ato de cometer faltas graves"], answer: 1 },
    { q: "Qual é a tríplice herança ou o tríplice aspecto em que o Espiritismo se baseia?", options: ["Religião, Dogma e Ritual", "Ciência, Filosofia e Religião", "Misticismo, Ocultismo e Ciência", "Filosofia, Política e Arte"], answer: 1 },
    { q: "O que determina a rapidez da evolução de um Espírito?", options: ["A vontade divina e o destino", "O tempo absoluto de sua criação", "Seus próprios esforços e livre-arbítrio", "O número exato de reencarnações"], answer: 2 },
    { q: "Na escala espírita, quais são as três ordens principais de Espíritos?", options: ["Anjos, Demônios e Humanos", "Imperfeitos, Bons Espíritos e Puros Espíritos", "Terrenos, Astrais e Divinos", "Evoluídos, Estagnados e Regressivos"], answer: 1 },
    { q: "Qual livro da Codificação analisa os milagres e as predições segundo as leis da natureza?", options: ["O Livro dos Espíritos", "O Evangelho segundo o Espiritismo", "A Gênese", "O Céu e o Inferno"], answer: 2 },
    { q: "Onde começaram as manifestações que deram origem às investigações de Kardec?", options: ["Nas mesas girantes em Paris", "Em reuniões mediúnicas no Brasil", "Em monastérios no Tibete", "Em templos religiosos na Inglaterra"], answer: 0 },
    { q: "Quem foi a fiel esposa e colaboradora direta di Allan Kardec?", options: ["Amélie-Gabrielle Boudet", "Marie Curie", "Hermance Dufaux", "Delphine de Girardin"], answer: 0 },
    { q: "Quem escreveu o clássico livro 'Depois da Morte', sendo considerado o consolidador do Espiritismo?", options: ["Chico Xavier", "Léon Denis", "Gabriel Delanne", "Camille Flammarion"], answer: 1 },
    { q: "Qual o nome da revista mensal fundada e editada por Allan Kardec a partir de 1858?", options: ["Revista de Estudos Psíquicos", "O Clarim Espírita", "Revista Espírita", "O Reformador"], answer: 2 },
    { q: "O que é o passe na prática espírita?", options: ["Uma transfusão de fluidos e energias espirituais", "Um ritual de purificação com água benta", "Um exame para testar a mediunidade", "Uma prece silenciosa individual"], answer: 0 },
    { q: "Como o Espiritismo enxerga a perda das pessoas amadas pela morte física?", options: ["Como uma separação eterna e dolorosa", "Como uma separação temporária, pois a alma continua viva", "Como o fim definitivo de qualquer laço de afeto", "Como um castigo pelas faltas cometidas"], answer: 1 },
    { q: "Qual médium brasileiro psicografou mais de 450 livros e doou todos os direitos autorais?", options: ["Divaldo Franco", "Chico Xavier", "Zíbia Gasparetto", "Yvonne do Amaral Pereira"], answer: 1 },
    { q: "Qual é o título do primeiro livro ditado pelo espírito André Luiz a Chico Xavier em 1944?", options: ["Nosso Lar", "Os Mensageiros", "Missionários da Luz", "Evolução em Dois Mundos"], answer: 0 },
    { q: "Qual livro da Codificação Espírita é considerado o guia teórico e prático da mediunidade?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Como o Espiritismo define a mediunidade?", options: ["Um dom sobrenatural e milagroso", "Uma faculdade orgânica e natural do ser humano", "Um privilégio concedido apenas a santos", "Uma doença psicológica grave"], answer: 1 },
    { q: "Qual o nome dado ao médium que serve de canal para que os espíritos escrevam?", options: ["Médium de efeitos físicos", "Médium psicógrafo", "Médium audiente", "Médium vidente"], answer: 1 }
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

    for (let r = 0; r < 6; r++) {
        const rowLabel = document.createElement('div');
        rowLabel.classList.add('coord-label');
        rowLabel.textContent = r + 1;
        grid.appendChild(rowLabel);

        for (let c = 0; c < 6; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            const coordLabel = columnsLetters[c] + (r + 1);
            cell.textContent = coordLabel;
            
            cell.addEventListener('click', () => {
                if (cell.classList.contains('disabled')) return;
                
                // MUDANÇA AQUI: Detecta se bateu em uma Alma Pedra antes de abrir o quiz
                const targetType = shipMap[r][c];
                if (targetType === 'rock') {
                    cell.classList.add('disabled', 'claimed-p2'); // Borda do MAL
                    p2Score += pointsTable.rock; // Pontos automáticos pro MAL
                    document.getElementById('p2-score').textContent = p2Score;
                    alert(`🪨 Coordenada [${coordLabel}]: Você atingiu uma Alma Petrificada! Ponto automático gratuito para o MAL (+${pointsTable.rock} pts)!`);
                    return; // Encerra a jogada sem abrir o quiz
                }

                currentCell = cell;
                openQuiz(coordLabel);
            });
            
            grid.appendChild(cell);
        }
    }
}
// --- PARTE 3: LÓGICA DO QUIZ E ATRIBUÇÃO DIRETA DE PONTOS ---
function openQuiz(coordinate) {
    currentQuestion = generateDynamicQuestion();
    
    const announcerInsideModal = document.getElementById('turn-announcer');
    if (announcerInsideModal) {
        announcerInsideModal.textContent = `Desafio do Oceano`;
        announcerInsideModal.style.color = '#3498db';
    }

    questionText.innerHTML = `<span style="color: #6272a4;">Disparo na Coordenada [${coordinate}]</span><br><br>${currentQuestion.q}`;
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
    modal.classList.add('hidden');
    
    const row = parseInt(currentCell.dataset.row);
    const col = parseInt(currentCell.dataset.col);
    const shipType = shipMap[row][col];

    currentCell.classList.add('disabled');

    let pointsGained = shipType !== 0 ? pointsTable[shipType] : pointsTable.water;

    if (selected === correct) {
        // Se ACERTOU: Os pontos vão para o BEM
        p1Score += pointsGained;
        currentCell.classList.add('claimed-p1'); // Borda Azul do Bem

        if (shipType !== 0) {
            alert(`Boa! Resposta CORRETA. Você purificou um ${translateShip(shipType)} (+${pointsGained} pts para o BEM)!`);
            currentCell.classList.add(`ship-${shipType}`);
            discoveredShipSquares++;
        } else {
            alert(`Resposta CORRETA, mas o tiro deu na água (+${pointsGained} pts para o BEM).`);
            currentCell.classList.add('water');
        }
    } else {
        // Se ERROU: O MAL ganha os pontos
        p2Score += pointsGained;
        currentCell.classList.add('claimed-p2'); // Borda Laranja do Mal

        if (shipType !== 0) {
            alert(`Resposta INCORRETA! O disparo falhou. As forças do MAL capturaram o ${translateShip(shipType)} (+${pointsGained} pts para o MAL)!`);
            currentCell.classList.add(`ship-${shipType}`);
            discoveredShipSquares++;
        } else {
            alert(`Resposta INCORRETA! O disparo falhou. As forças do MAL pontuaram na Água (+${pointsGained} pts para o MAL)!`);
            currentCell.classList.add('water');
        }
    }

    // Atualiza os placares visuais na tela
    document.getElementById('p1-score').textContent = p1Score;
    document.getElementById('p2-score').textContent = p2Score;

    checkGameEnd();
}

function translateShip(type) {
    const names = { carrier: "Porta-Aviões", battleship: "Encouraçado", destroyer: "Contratorpedeiro", submarine: "Submarino", patrol: "Navio de Patrulha" };
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

    document.getElementById('p1-score').textContent = "0";
    document.getElementById('p2-score').textContent = "0";
    
    const p1Panel = document.getElementById('p1-panel');
    const p2Panel = document.getElementById('p2-panel');
    if (p1Panel && p2Panel) {
        p1Panel.classList.add('active');
        p2Panel.classList.remove('active');
    }

    modal.classList.add('hidden');
    alert("O oceano foi redefinido! Nova jornada contra o MAL iniciada.");
    createGameBoard();
}

// Inicializa o tabuleiro
createGameBoard();
