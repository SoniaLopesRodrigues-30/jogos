const columnsLetters = ["A", "B", "C", "D", "E", "F"];
const totalShipSquares = 12;

// Tabela de pontos por tipo de navio encontrado
const pointsTable = {
    carrier: 50,     // Porta-Aviões (Mais valioso)
    battleship: 40,  // Encouraçado
    destroyer: 30,   // Contratorpedeiro
    submarine: 30,   // Submarino
    patrol: 20,      // Navio de Patrulha
    water: 10        // Acertou a pergunta mas pegou água
};

// Contador interno para saber quando o jogo acaba (máximo 12 pedaços)
let discoveredShipSquares = 0; 

// Mapa 6x6 totalmente preenchido com 6 colunas em todas as linhas
const shipMap = [
    ['carrier', 'carrier', 'carrier', 'carrier', 0, 0],
    [0, 'battleship', 'battleship', 'battleship', 0, 0],
    [0, 0, 'destroyer', 'destroyer', 0, 0],
    [0, 0, 0, 'submarine', 'submarine', 0],
    [0, 0, 0, 0, 'patrol', 0],
    [0, 0, 0, 0, 0, 0]
];

let currentPlayer = 1;
let p1Score = 0; // Pontuação numérica do Jogador 1
let p2Score = 0; // Pontuação numérica do Jogador 2
let currentCell = null;
let currentQuestion = null;

const gridElement = document.getElementById('grid');
const modal = document.getElementById('quiz-modal');
const turnAnnouncer = document.getElementById('turn-announcer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// Banco de dados corrigido e finalizado com perguntas sobre o Espiritismo
const perguntasEspiritismo = [
    // --- 10 Perguntas Iniciais ---
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

    // --- Novas Perguntas (Conceitos Gerais e Doutrina) ---
    { q: "Em qual categoria de mundos a Terra se encontra atualmente segundo a escala evolutiva?", options: ["Mundo Primitivo", "Mundo de Provas e Expiações", "Mundo de Regeneração", "Mundo Feliz"], answer: 1 },
    { q: "Qual o nome do princípio universal do qual derivam todas as formas de matéria no universo?", options: ["Fluido Cósmico Universal", "Energia Escura", "Matéria Ectoplásmica", "Fluido Espiritual"], answer: 0 },
    { q: "Qual é o nome do envoltório semimaterial que serve de ligação entre o Espírito e o corpo?", options: ["Corpo Astral", "Perispírito", "Alma", "Duplo Vital"], answer: 1 },
    { q: "Como o Espiritismo define a situação da alma após a morte do corpo?", options: ["Adormece até o juízo final", "Mantém sua individualidade e continua sua evolução", "Funde-se imediatamente com o Absoluto", "Deixa de existir"], answer: 1 },
    { q: "De acordo com as Leis Morais, qual é o principal objetivo da Lei de Sociedade?", options: ["Permitir o progresso mútuo através da convivência", "Garantir a sobrevivência dos mais fortes", "Criar divisões de classes sociais", "Impor regras de conduta severas"], answer: 0 },
    { q: "O que significa o termo 'Erraticidade' na Doutrina Espírita?", options: ["O estado de erro constante do ser humano", "O intervalo entre duas encarnações corporais", "A perda completa da memória de vidas passadas", "O ato de cometer faltas graves"], answer: 1 },
    { q: "Qual é a tríplice herança ou o tríplice aspecto em que o Espiritismo se baseia?", options: ["Religião, Dogma e Ritual", "Ciência, Filosofia e Religião", "Misticismo, Ocultismo e Ciência", "Filosofia, Política e Arte"], answer: 1 },
    { q: "O que determina a rapidez da evolução de um Espírito?", options: ["A vontade divina e o destino", "O tempo absoluto de sua criação", "Seus próprios esforços e livre-arbítrio", "O número exato de reencarnações"], answer: 2 },
    { q: "Na escala espírita, quais são as três ordens principais de Espíritos?", options: ["Anjos, Demônios e Humanos", "Imperfeitos, Bons Espíritos e Puros Espíritos", "Terrenos, Astrais e Divinos", "Evoluídos, Estagnados e Regressivos"], answer: 1 },
    { q: "Qual livro da Codificação analisa os milagres e as predições segundo as leis da natureza?", options: ["O Livro dos Espíritos", "O Evangelho segundo o Espiritismo", "A Gênese", "O Céu e o Inferno"], answer: 2 },

    // --- Novas Perguntas (História, Prática e Obras Complementares) ---
    { q: "Onde começaram as manifestações que deram origem às investigações de Kardec?", options: ["Nas mesas girantes in Paris", "Em reuniões mediúnicas no Brasil", "Em monastérios no Tibete", "Em templos religiosos na Inglaterra"], answer: 0 },
    { q: "Quem foi a fiel esposa e colaboradora direta de Allan Kardec?", options: ["Amélie-Gabrielle Boudet", "Marie Curie", "Hermance Dufaux", "Delphine de Girardin"], answer: 0 },
    { q: "Quem escreveu o clássico livro 'Depois da Morte', sendo considerado o consolidador do Espiritismo?", options: ["Chico Xavier", "Léon Denis", "Gabriel Delanne", "Camille Flammarion"], answer: 1 },
    { q: "Qual o nome da revista mensal fundada e editada por Allan Kardec a partir de 1858?", options: ["Revista de Estudos Psíquicos", "O Clarim Espírita", "Revista Espírita", "O Reformador"], answer: 2 },
    { q: "O que é o passe na prática espírita?", options: ["Uma transfusão de fluidos e energias espirituais", "Um ritual de purificação com água benta", "Um exame para testar a mediunidade", "Uma prece silenciosa individual"], answer: 0 },
    { q: "Como o Espiritismo enxerga a perda das pessoas amadas pela morte física?", options: ["Como uma separação eterna e dolorosa", "Como uma separação temporária, pois a alma continua viva", "Como o fim definitivo de qualquer laço de afeto", "Como um castigo pelas faltas cometidas"], answer: 1 },
    { q: "Qual médium brasileiro psicografou mais de 450 livros e doou todos os direitos autorais?", options: ["Divaldo Franco", "Chico Xavier", "Zíbia Gasparetto", "Yvonne do Amaral Pereira"], answer: 1 },
    { q: "Qual é o título do primeiro livro ditado pelo espírito André Luiz a Chico Xavier em 1944?", options: ["Nosso Lar", "Os Mensageiros", "Missionários da Luz", "Evolução em Dois Mundos"], answer: 0 },

    // --- Perguntas ( Mediunidade) ---
    { q: "Qual livro da Codificação Espírita é considerado o guia teórico e prático da mediunidade?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Como o Espiritismo define a mediunidade?", options: ["Um dom sobrenatural e milagroso", "Uma faculdade orgânica e natural do ser humano", "Um privilégio concedido apenas a santos", "Uma doença psicológica grave"], answer: 1 },
    { q: "Qual o nome dado ao médium que serve de canal para que os espíritos escrevam?", options: ["Médium de efeitos físicos", "Médium psicógrafo", "Médium audiente", "Médium vidente"], answer: 1 },
    { q: "O que caracteriza os chamados 'médiuns de efeitos físicos'?", options: ["Sua capacidade de transmitir mensagens filosóficas por escrito", "Sua habilidade de produzir fenômenos materiais, como ruídos e movimentos de objetos", "Sua facilidade em curar doenças do corpo", "A capacidade de ver os espíritos claramente"], answer: 1 },
    { q: "Segundo Kardec, qual é o principal objetivo do desenvolvimento da mediunidade?", options: ["Adivinhar o futuro e ganhar dinheiro", "Servir à própria vaidade e orgulho", "O melhoramento moral do próprio médium e o auxílio ao próximo", "Descobrir tesouros escondidos"], answer: 2 },
    { q: "O que é a 'psicofonia' na fenomenologia espírita?", options: ["A faculdade pela qual o espírito fala através do órgão vocal do médium", "O ato de ouvir a voz direta dos espíritos no ambiente", "A transmissão de pensamentos de uma pessoa viva para outra", "A escrita mecânica dos espíritos"], answer: 0 },
    { q: "Como a Doutrina Espírita orienta que deve ser cobrado o trabalho mediúnico?", options: ["Deve ser cobrado um valor justo para sustentar o médium", "A mediunidade deve ser exercida gratuitamente, pois é um dom gratuito de Deus", "Pode ser cobrado apenas se for para caridade", "Deve ser cobrado apenas de pessoas ricas"], answer: 1 },
    { q: "Qual é o principal fator que atrai os Bons Espíritos para uma reunião mediúnica?", options: ["O luxo e a decoração do ambiente físico", "A quantidade exata de pessoas presentes", "A seriedade, a harmonia moral e as boas intenções dos participantes", "A realização de rituais com velas e incensos"], answer: 2 },
    { q: "O que é a 'vidência' no contexto mediúnico?", options: ["A capacidade de adivinhar o futuro das pessoas", "A faculdade de ver os Espíritos com os olhos da alma", "A habilidade de ler pensamentos ocultos", "O dom de curar através do olhar"], answer: 1 },
    { q: "Qual a melhor maneira recomendada por Kardec para identificar o valor de uma comunicação espiritual?", options: ["Pelo nome famoso que o Espírito assina", "Pela beleza da caligrafia do médium", "Pela análise lógica, moral e racional do conteúdo da mensagem", "Pelo número de páginas escritas"], answer: 2 }

];

let perguntasSorteadas = [];
// --- PARTE 2: FUNÇÕES LÓGICAS E INICIALIZAÇÃO ---

function createGameBoard() {
    gridElement.innerHTML = ''; 
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gridElement.appendChild(cell);
        }
    }
}

function handleCellClick(e) {
    const cell = e.target;
    if (cell.classList.contains('disabled')) return;
    
    currentCell = cell;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const coordinateName = columnsLetters[col] + (row + 1);

    openQuiz(coordinateName);
}

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

function openQuiz(coordinate) {
    currentQuestion = generateDynamicQuestion();
    
    turnAnnouncer.textContent = `Vez do Jogador ${currentPlayer}`;
    turnAnnouncer.style.color = currentPlayer === 1 ? '#3498db' : '#e67e22';

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
    currentCell.classList.add(`claimed-p${currentPlayer}`);

    let pointsGained = 0;

    if (selected === correct) {
        if (shipType !== 0) {
            pointsGained = pointsTable[shipType];
            alert(`Boa! Resposta CORRETA. Você atingiu um ${translateShip(shipType)} (+${pointsGained} pts)!`);
            currentCell.classList.add(`ship-${shipType}`);
            discoveredShipSquares++;
        } else {
            pointsGained = pointsTable.water;
            alert(`Resposta CORRETA, mas o tiro deu na água (+${pointsGained} pts).`);
            currentCell.classList.add('water');
        }
    } else {
        alert("Resposta INCORRETA! O disparo falhou e você somou 0 pontos.");
        currentCell.classList.add('water');
    }

    if (currentPlayer === 1) {
        p1Score += pointsGained;
        document.getElementById('p1-score').textContent = p1Score;
    } else {
        p2Score += pointsGained;
        document.getElementById('p2-score').textContent = p2Score;
    }

    checkGameEnd();
    switchPlayer();
}

function translateShip(type) {
    const names = { carrier: "Porta-Aviões", battleship: "Encouraçado", destroyer: "Contratorpedeiro", submarine: "Submarino", patrol: "Navio de Patrulha" };
    return names[type] || "Navio";
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('p1-panel').classList.toggle('active');
    document.getElementById('p2-panel').classList.toggle('active');
}

function checkGameEnd() {
    if (discoveredShipSquares === totalShipSquares) {
        let winnerText = "";
        if (p1Score > p2Score) {
            winnerText = "🏆 Fim da Batalha!\n\nO Jogador 1 (Azul) venceu pelo total de pontos!";
        } else if (p2Score > p1Score) {
            winnerText = "🏆 Fim da Batalha!\n\nO Jogador 2 (Laranja) venceu pelo total de pontos!";
        } else {
            winnerText = "🤝 Empate surpreendente no oceano!";
        }

        setTimeout(() => {
            alert(`${winnerText}\n\nPlacar Final:\nJogador 1: ${p1Score} pontos\nJogador 2: ${p2Score} pontos`);
            resetGame(); 
        }, 500);
    }
}

function resetGame() {
    discoveredShipSquares = 0;
    p1Score = 0;
    p2Score = 0;
    currentPlayer = 1;
    perguntasSorteadas = []; 
    currentCell = null;
    currentQuestion = null;

    document.getElementById('p1-score').textContent = "0";
    document.getElementById('p2-score').textContent = "0";
    
    document.getElementById('p1-panel').classList.add('active');
    document.getElementById('p2-panel').classList.remove('active');
    
    if (turnAnnouncer) {
        turnAnnouncer.textContent = "Vez do Jogador 1";
        turnAnnouncer.style.color = '#3498db';
    }

    const allCells = gridElement.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.className = 'cell'; 
    });

    modal.classList.add('hidden');
    
    alert("O oceano foi redefinido! Nova partida iniciada.");
    createGameBoard();
}

// Inicializa a grade 6x6 ao carregar a página
createGameBoard();
