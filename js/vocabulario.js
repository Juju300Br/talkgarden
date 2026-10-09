// =====================================================================
// vocabulario.js  (RF003 e RF005)
// Lógica do Jogo de Vocabulário: mostra uma palavra e 3 imagens.
// A criança toca na imagem certa. Cada rodada tem 5 palavras sorteadas.
// Usa funções do geral.js: embaralhar(), tocarSom() e salvarAtividade().
// =====================================================================

// Lista de palavras do jogo (cada uma com a sua imagem SVG)
const PALAVRAS = [
    { palavra: 'MAÇÃ',     imagem: 'img/palavras/maca.svg' },
    { palavra: 'CASA',     imagem: 'img/palavras/casa.svg' },
    { palavra: 'BOLA',     imagem: 'img/palavras/bola.svg' },
    { palavra: 'GATO',     imagem: 'img/palavras/gato.svg' },
    { palavra: 'CACHORRO', imagem: 'img/palavras/cachorro.svg' },
    { palavra: 'SOL',      imagem: 'img/palavras/sol.svg' },
    { palavra: 'CARRO',    imagem: 'img/palavras/carro.svg' },
    { palavra: 'PEIXE',    imagem: 'img/palavras/peixe.svg' },
    { palavra: 'BANANA',   imagem: 'img/palavras/banana.svg' },
    { palavra: 'LIVRO',    imagem: 'img/palavras/livro.svg' },
    { palavra: 'LUA',      imagem: 'img/palavras/lua.svg' },
    { palavra: 'PATO',     imagem: 'img/palavras/pato.svg' },
    { palavra: 'BOLO',     imagem: 'img/palavras/bolo.svg' },
    { palavra: 'UVA',      imagem: 'img/palavras/uva.svg' }
];

const PALAVRAS_POR_RODADA = 5;

// Frases de elogio (uma é sorteada a cada acerto)
const ELOGIOS = ['Muito bem!', 'Isso mesmo!', 'Você acertou!', 'Que demais!', 'Parabéns!'];

// ----- Variáveis que guardam a situação do jogo -----
let rodada = [];             // as 5 palavras sorteadas
let posicao = 0;             // qual palavra está na tela (0 a 4)
let acertosPrimeira = 0;     // quantas a criança acertou de primeira
let errouEssaPalavra = false; // se já errou a palavra atual
let esperando = false;       // true durante a pausa depois do acerto (bloqueia cliques)


// Começa uma rodada nova
function iniciarRodada() {
    // Embaralha todas e pega as 5 primeiras
    rodada = embaralhar(PALAVRAS).slice(0, PALAVRAS_POR_RODADA);
    posicao = 0;
    acertosPrimeira = 0;
    mostrarPalavra();
}


// Mostra a palavra da vez e cria os 3 botões de imagem
function mostrarPalavra() {
    let atual = rodada[posicao];
    errouEssaPalavra = false;
    esperando = false;

    // Escolhe 2 imagens erradas entre as OUTRAS palavras
    let outras = PALAVRAS.filter(function (item) {
        return item.palavra != atual.palavra;
    });
    let erradas = embaralhar(outras).slice(0, 2);

    // Junta a certa com as erradas e embaralha (assim a certa muda de lugar)
    let opcoes = embaralhar([atual, erradas[0], erradas[1]]);

    // Atualiza os textos da tela
    document.getElementById('palavra-atual').textContent = atual.palavra;
    document.getElementById('mensagem').textContent = '';
    atualizarProgresso();

    // Cria os botões das imagens
    let area = document.getElementById('opcoes');
    area.innerHTML = ''; // apaga os botões da palavra anterior

    for (let i = 0; i < opcoes.length; i++) {
        let opcao = opcoes[i];

        let botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'opcao-imagem';
        botao.innerHTML = '<img src="' + opcao.imagem + '" alt="">';
        botao.setAttribute('aria-label', opcao.palavra);

        // Quando clicar, confere se é a palavra certa
        botao.onclick = function () {
            escolher(botao, opcao.palavra == atual.palavra);
        };

        area.appendChild(botao);
    }
}


// Confere a resposta. "certo" é true ou false.
function escolher(botao, certo) {
    if (esperando) {
        return; // ignora cliques enquanto passa para a próxima palavra
    }

    let mensagem = document.getElementById('mensagem');

    if (certo) {
        esperando = true;
        if (!errouEssaPalavra) {
            acertosPrimeira++; // só conta se não errou antes
        }

        botao.classList.add('certo');
        mensagem.className = 'mensagem-jogo msg-certo';
        mensagem.textContent = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)] + ' Sua flor está crescendo!';
        tocarSom('acerto');

        // Espera 1,3 segundo para a criança ver o acerto e vai para a próxima
        setTimeout(proximaPalavra, 1300);
    } else {
        errouEssaPalavra = true;

        // Desliga o botão errado (não dá para clicar de novo nele)
        botao.classList.add('errado');
        botao.disabled = true;

        // Feedback gentil, nunca punitivo
        mensagem.className = 'mensagem-jogo msg-erro-gentil';
        mensagem.textContent = 'Quase lá! Tente novamente.';
        tocarSom('erro');
    }
}


function proximaPalavra() {
    posicao++;

    if (posicao < PALAVRAS_POR_RODADA) {
        mostrarPalavra();
    } else {
        // Acabou a rodada: marca a última bolinha e salva o resultado
        atualizarProgresso();
        document.getElementById('opcoes').innerHTML = '';
        document.getElementById('palavra-atual').textContent = 'FIM!';
        salvarAtividade('vocabulario', PALAVRAS_POR_RODADA, acertosPrimeira);
    }
}


// Mostra "Palavra X de 5" e pinta as bolinhas das palavras já feitas
function atualizarProgresso() {
    let numero = Math.min(posicao + 1, PALAVRAS_POR_RODADA);
    document.getElementById('progresso-texto').textContent =
        'Palavra ' + numero + ' de ' + PALAVRAS_POR_RODADA;

    let bolinhas = '';
    for (let i = 0; i < PALAVRAS_POR_RODADA; i++) {
        if (i < posicao) {
            bolinhas += '<span class="bolinha-progresso feita"></span>';
        } else if (i == posicao) {
            bolinhas += '<span class="bolinha-progresso atual"></span>';
        } else {
            bolinhas += '<span class="bolinha-progresso"></span>';
        }
    }
    document.getElementById('progresso-bolinhas').innerHTML = bolinhas;
}


// Começa o jogo assim que a página carrega
iniciarRodada();
