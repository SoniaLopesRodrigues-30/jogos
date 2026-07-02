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
    { q: "Quem foi o codificador da Doutrina Espírita?", options: ["Chico Xavier", "Allan Kardec", "Léon Denis", "Emmanuel"], answer: 1 },
    { q: "Qual foi a primeira obra da Codificação Espírita, lançada em 1857?", options: ["O Livro dos Médiuns", "O Evangelho segundo o Espiritismo", "O Livro dos Espíritos", "A Gênese"], answer: 2 },
    { q: "Qual era o nome real de Allan Kardec?", options: ["Hippolyte Léon Denizard Rivail", "Léon Denis", "Gabriel Delanne", "Amélie Boudet"], answer: 0 },
    { q: "Quantas obras principais formam a Codificação Espírita?", options: ["3 obras", "4 obras", "5 obras", "6 obras"], answer: 2 },
    { q: "Qual livro da codificação explica as leis morais e a vida espiritual?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "O Céu e o Inferno", "A Gênese"], answer: 0 },
    { q: "Qual obra aborda a mediunidade e a comunicação com o mundo invisível?", options: ["O Evangelho segundo o Espiritismo", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Segundo o Espiritismo, qual é o objetivo principal da reencarnação?", options: ["Punição eterna", "Evolução moral e intelectual", "Esquecer o passado", "Apenas viver na Terra"], answer: 1 },
    { q: "Qual livro aborda a justiça divina, as penas e os gozos futuros?", options: ["O Livro dos Espíritos", "A Gênese", "O Céu e o Inferno", "O Livro dos Médiuns"], answer: 2 },    
    { q: "A quem os espíritas consideram o maior modelo e guia para a humanidade?", options: ["Allan Kardec", "Jesus", "Chico Xavier", "Anjo da Guarda"], answer: 1 },
    { q: "Em qual categoria de mundos a Terra se encontra atualmente segundo a escala evolutiva?", options: ["Mundo Primitivo", "Mundo de Provas e Expiações", "Mundo de Regeneração", "Mundo Feliz"], answer: 1 },
    { q: "Qual o nome do princípio universal do qual derivam todas as formas de matéria no universo?", options: ["Fluido Cósmico Universal", "Energia Escura", "Matéria Ectoplásmica", "Fluido Espiritual"], answer: 0 },
    { q: "Qual é o nome do envoltório semimaterial que serve de ligação entre o Espírito e o corpo?", options: ["Corpo Astral", "Perispírito", "Alma", "Duplo Vital"], answer: 1 },
    { q: "Como o Espiritismo define a situação da alma após a morte do corpo?", options: ["Adormece até o juízo final", "Mantém sua individualidade e continua sua evolução", "Funde-se imediatamente com o Absoluto", "Deixa de existir"], answer: 1 }
];
perguntasEspiritismo.push(
    { q: "De acordo com as Leis Morais, qual é o principal objetivo da Lei de Sociedade?", options: ["Permitir o progresso mútuo através da convivência", "Garantir a sobrevivência dos mais fortes", "Criar divisões de classes sociais", "Impor regras de conduta severas"], answer: 0 },
    { q: "O que significa o termo 'Erraticidade' na Doutrina Espírita?", options: ["O estado de erro constante do ser humano", "O intervalo entre duas encarnações corporais", "A perda completa da memória de vidas passadas", "O ato de cometer faltas graves"], answer: 1 },
    { q: "Qual é a tríplice herança ou o tríplice aspecto em que o Espiritismo se baseia?", options: ["Religião, Dogma e Ritual", "Ciência, Filosofia e Religião", "Misticismo, Ocultismo e Ciência", "Filosofia, Política e Arte"], answer: 1 },
    { q: "O que determina a rapidez da evolução de um Espírito?", options: ["A vontade divina e o destino", "O tempo absoluto de sua criação", "Seus próprios esforços e livre-arbítrio", "O número exato de reencarnações"], answer: 2 },
    { q: "Na escala espírita, quais são as três ordens principais de Espíritos?", options: ["Anjos, Demônios e Humanos", "Imperfeitos, Bons Espíritos e Puros Espíritos", "Terrenos, Astrais e Divinos", "Evoluídos, Estagnados e Regressivos"], answer: 1 },
    { q: "Qual livro da Codificação analisa os milagres e as predições segundo as leis da natureza?", options: ["O Livro dos Espíritos", "O Evangelho segundo o Espiritismo", "A Gênese", "O Céu e o Inferno"], answer: 2 },
    { q: "Onde começaram as manifestações que deram origem às investigações de Kardec?", options: ["Nas mesas girantes em Paris", "Em reuniões mediúnicas no Brasil", "Em monastérios no Tibete", "Em templos religiosos na Inglaterra"], answer: 0 },
    { q: "Quem foi a fiel esposa e colaboradora direta de Allan Kardec?", options: ["Amélie-Gabrielle Boudet", "Marie Curie", "Hermance Dufaux", "Delphine de Girardin"], answer: 0 },
    { q: "Quem escreveu o clássico livro 'Depois da Morte', sendo considerado o consolidador do Espiritismo?", options: ["Chico Xavier", "Léon Denis", "Gabriel Delanne", "Camille Flammarion"], answer: 1 },
    { q: "Qual o nome da revista mensal fundada e editada por Allan Kardec a partir de 1858?", options: ["Revista de Estudos Psíquicos", "O Clarim Espírita", "Revista Espírita", "O Reformador"], answer: 2 },
    { q: "O que é o passe na prática espírita?", options: ["Uma transfusão de fluidos e energias espirituais", "Um ritual de purificação com água benta", "Um exame para testar a mediunidade", "Uma prece silenciosa individual"], answer: 0 },
    { q: "Como o Espiritismo enxerga a perda das pessoas amadas pela morte física?", options: ["Como uma separação eterna e dolorosa", "Como uma separação temporária, pois a alma continua viva", "Como o fim definitivo de qualquer laço de afeto", "Como um castigo pelas faltas cometidas"], answer: 1 },
    { q: "Qual médium brasileiro psicografou mais de 450 livros e doou todos os direitos autorais?", options: ["Divaldo Franco", "Chico Xavier", "Zíbia Gasparetto", "Yvonne do Amaral Pereira"], answer: 1 },
    { q: "Qual é o título do primeiro livro ditado pelo espírito André Luiz a Chico Xavier em 1944?", options: ["Nosso Lar", "Os Mensageiros", "Missionários da Luz", "Evolução em Dois Mundos"], answer: 0 },
    { q: "Qual livro da Codificação Espírita é considerado o guia teórico e prático da mediunidade?", options: ["O Livro dos Espíritos", "O Livro dos Médiuns", "A Gênese", "O Céu e o Inferno"], answer: 1 },
    { q: "Como o Espiritismo define a mediunidade?", options: ["Um dom sobrenatural e milagroso", "Uma faculdade orgânica e natural do ser humano", "Um privilégio concedido apenas a santos", "Uma doença psicológica grave"], answer: 1 }
);
perguntasEspiritismo.push(
    { q: "Qual o nome dado ao médium que serve de canal para que os Espíritos escrevam?", options: ["Médium de efeitos físicos", "Médium psicógrafo", "Médium audiente", "Médium vidente"], answer: 1 },
    { q: "Qual livro de Allan Kardec foi publicado em 1864 e foca nos ensinamentos morais de Cristo?", options: ["O Livro dos Médiuns", "A Gênese", "O Evangelho segundo o Espiritismo", "O Céu e o Inferno"], answer: 2 },
    { q: "Qual é o nome da colônia espiritual mais famosa descrita pelo espírito André Luiz?", options: ["Alvorada", "Nosso Lar", "Nova Esperança", "Fraternidade"], answer: 1 },
    { q: "De acordo com o Espiritismo, o que determina o livre-arbítrio de um Espírito?", options: ["Sua riqueza na Terra", "Seu grau de evolução e consciência", "O destino traçado pelos protetores", "Sua idade cronológica física"], answer: 1 },
    { q: "Qual é a última obra da Codificação Espírita lançada por Allan Kardec, em 1868?", options: ["A Gênese", "O Céu e o Inferno", "O Que é o Espiritismo", "Obras Póstumas"], answer: 0 },
    { q: "Segundo as Leis Morais, qual virtude é considerada a mais importante por resumir toda a lei de Deus?", options: ["Orgulho", "Caridade", "Inteligência", "Pacifismo"], answer: 1 },
    { q: "O que acontece com os laços de afeto reais entre Espíritos após a morte do corpo?", options: ["Desaparecem imediatamente", "São rompidos pelo esquecimento", "Continuam existindo e se fortalecem no mundo espiritual", "Ficam congelados até a próxima encarnação"], answer: 2 },
    { q: "Como o Espiritismo define os chamados 'Milagres' de Jesus?", options: ["Derrogações das leis divinas feitas por privilégio", "Fatos naturais produzidos pela manipulação do fluido universal", "Invenções poéticas sem base real", "Atos de magia incompreensíveis"], answer: 1 },
    { q: "Na Doutrina Espírita, o que significa a lei de causa e efeito?", options: ["Que tudo é fruto do puro acaso", "Que colhemos no presente e no futuro as consequências de nossas ações", "Que o destino de todos os seres humanos já está fixado", "Que Deus castiga fisicamente os pecadores"], answer: 1 },
    { q: "O que é o 'Fluido Vital' de acordo com as obras básicas?", options: ["O sangue que corre nas veias", "O princípio que dá vida à matéria orgânica durante a encarnação", "A alma do ser humano", "A energia escura do universo"], answer: 1 },
    { q: "Quem foi o mentor e protetor espiritual mais conhecido de Chico Xavier?", options: ["Emmanuel", "André Luiz", "Humberto de Campos", "Bezerra de Menezes"], answer: 0 },
    { q: "Qual médico ficou conhecido no Brasil como o 'Médico dos Pobres' por sua caridade e dedicação?", options: ["Dr. Fritz", "Dr. Bezerra de Menezes", "Eurípedes Barsanulfo", "Cairbar Schutel"], answer: 1 },
    { q: "Segundo O Livro dos Espíritos, onde está escrita a Lei de Deus?", options: ["Nos livros sagrados antigos", "Na consciência do próprio homem", "Nas tábuas de pedra guardadas pelos profetas", "Apenas no mundo espiritual superior"], answer: 1 },
    { q: "Qual é o termo utilizado para descrever a união temporária do Espírito a um novo corpo físico?", options: ["Desencarnação", "Reencarnação", "Bilocação", "Transmigração"], answer: 1 },
    { q: "Como são chamados os Espíritos que já atingiram o topo da escala evolutiva e não precisam mais reencarnar?", options: ["Bons Espíritos", "Espíritos Puros", "Espíritos Protetores", "Anjos Caídos"], answer: 1 },
    { q: "O que o Espiritismo ensina sobre a pluralidade dos mundos habitados?", options: ["A Terra é o único planeta com vida inteligente", "O universo possui diversos mundos habitados em diferentes níveis evolutivos", "Apenas o Sol e a Lua possuem moradores espirituais", "Os outros planetas abrigam apenas animais primitivos"], answer: 1 },
    { q: "Qual era o pseudônimo literário que Allan Kardec utiliza em suas obras pedagógicas antes de codificar o Espiritismo?", options: ["Professor Rivail", "Léon Denis", "Gabriel Delanne", "Amélie Boudet"], answer: 0 },
    { q: "Segundo o Espiritismo, qual é a natureza do fenômeno do sonho?", options: ["Uma ilusão cerebral sem qualquer significado", "A emancipação da alma durante o repouso do corpo", "Um aviso físico sobre doenças futuras", "A perda temporária da memória espiritual"], answer: 1 },
    { q: "Com que frequência os Espíritos influenciam os nossos pensamentos e ações no dia a dia?", options: ["Apenas em momentos de grande perigo", "Nunca influenciam, pois o livre-arbítrio é absoluto", "Muito mais do que imaginais, pois frequentemente são eles que vos dirigem", "Apenas quando estamos dormindo"], answer: 2 },
    { q: "Qual o nome das duas jovens irmãs cujos fenômenos mediúnicos deram origem aos episódios de Hydesville em 1848?", options: ["Irmãs Fox", "Irmãs Boudet", "Irmãs Brontë", "Irmãs Baudin"], answer: 0 },
    { q: "Em qual das Leis Morais de 'O Livro dos Espíritos' é discutido o dever de respeitar os direitos alheios e a fraternidade?", options: ["Lei de Destruição", "Lei de Justiça, Amor e Caridade", "Lei de Adoração", "Lei do Trabalho"], answer: 1 },
    { q: "Qual livro da Codificação trata especificamente sobre a formação da Terra, a evolução física e espiritual e os milagres?", options: ["O Céu e o Inferno", "O Livro dos Médiuns", "A Gênese", "O Livro dos Espíritos"], answer: 2 },
    { q: "O que acontece com as imperfeições morais da alma quando ela passa pela morte física?", options: ["Desaparecem imediatamente ao entrar no mundo espiritual", "Permanecem com o Espírito, que precisará se esforçar para corrigi-las", "São transferidas para o Anjo da Guarda", "Ficam adormecidas para sempre"], answer: 1 },
    { q: "Como a Doutrina Espírita orienta que deve ser encarada a prática da mediunidade?", options: ["Como uma profissão lucrativa", "Como um compromisso moral e gratuito de auxílio ao próximo", "Como um entretenimento para salões sociais", "Como um segredo que nunca deve ser revelado"], answer: 1 },
    { q: "Qual é o principal critério ensinado por Kardec para julgar a qualidade das comunicações espíritas?", options: ["A assinatura de um nome famoso no final", "A beleza poética da linguagem utilizada", "A lógica, o bom senso e o rigor moral do conteúdo", "A rapidez com que a mensagem foi escrita"], answer: 2 },
    { q: "Na escala espírita, qual é a principal característica dos Espíritos de Terceira Ordem (Espíritos Imperfeitos)?", options: ["O predomínio da matéria sobre o Espírito e a propensão ao mal", "O predomínio do bem e o conhecimento completo de Deus", "A ausência total de perispírito", "A incapacidade completa de se comunicarem"], answer: 0 },
    { q: "Qual o nome dado à obsessão em seu grau mais grave, onde o Espírito obsessor assume o controle temporário dos movimentos do corpo físico do indivíduo?", options: ["Obsessão simples", "Fascinação", "Subjugação", "Passe"], answer: 2 },
    { q: "Segundo o Espiritismo, qual é a causa principal da desigualdade das aptidões e inteligências humanas à nascença?", options: ["O favoritismo de Deus por algumas almas", "O esforço e o progresso realizados pelo Espírito em existências anteriores", "A alimentação e os cuidados na infância", "A pura sorte genética"], answer: 1 },
    { q: "Em qual cidade francesa Allan Kardec faleceu no ano de 1869?", options: ["Lyon", "Paris", "Bordeaux", "Marseille"], answer: 1 },
    { q: "Como o Espiritismo define o 'Anjo da Guarda' ou Espírito Protetor?", options: ["Uma entidade mística com asas literais", "Um Espírito superior que acompanha e guia o indivíduo ao longo da encarnação", "A própria shadow da pessoa projetada no astral", "Um familiar desencarnado recentemente que exige adoração"], answer: 1 },
    { q: "O que o Espiritismo ensina sobre o sofrimento e as dores da vida terrena?", options: ["São castigos arbitrários para demonstrar o poder divino", "São oportunidades de aprendizado, expiação e reparação necessárias ao progresso", "São ilusões que desaparecem se a pessoa não pensar nelas", "São o fim definitivo da evolução humana"], answer: 1 }
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
