// =====================================================================
// frases.js  (RF004 e RF005)
// Lógica do Formando Frases: mostra uma imagem e as palavras da frase
// embaralhadas. A criança toca nas palavras na ordem certa e clica em
// "Confirmar". Se errar, as palavras voltam. Cada rodada tem 3 frases.
// Usa funções do geral.js: embaralhar(), tocarSom() e salvarAtividade().
// =====================================================================

// Lista de frases do jogo (cada uma com a sua imagem de apoio)
const FRASES = [
    { frase: 'O gato bebe leite',      imagem: 'img/frases/gato-leite.svg' },
    { frase: 'O menino chuta a bola',  imagem: 'img/frases/menino-bola.svg' },
    { frase: 'A menina lê o livro',    imagem: 'img/frases/menina-livro.svg' },
    { frase: 'O cachorro come o osso', imagem: 'img/frases/cachorro-osso.svg' },
    { frase: 'O pássaro voa alto',     imagem: 'img/frases/passaro-voa.svg' },
    { frase: 'O peixe nada na água',   imagem: 'img/frases/peixe-agua.svg' },
    { frase: 'A abelha pousa na flor', imagem: 'img/frases/abelha-flor.svg' },
    { frase: 'O sapo pula no lago',    imagem: 'img/frases/sapo-pula.svg' }
];

const FRASES_POR_RODADA = 3;

// Frases de elogio (uma é sorteada a cada acerto)
const ELOGIOS = ['Muito bem!', 'Isso mesmo!', 'Frase perfeita!', 'Que demais!', 'Parabéns!'];

// ----- Variáveis que guardam a situação do jogo -----
let rodada = [];              // as 3 frases sorteadas
let posicao = 0;              // qual frase está na tela (0 a 2)
let acertosPrimeira = 0;      // quantas frases a criança acertou de primeira
let errouEssaFrase = false;   // se já errou a frase atual
let esperando = false;        // true durante as pausas (bloqueia cliques)

// As palavras da frase atual ficam em duas listas:
let palavrasNoBanco = [];     // as que estão embaixo, para escolher
let palavrasNaResposta = [];  // as que a criança já tocou, na ordem


// Começa uma rodada nova
function iniciarRodada() {
    rodada = embaralhar(FRASES).slice(0, FRASES_POR_RODADA);
    posicao = 0;
    acertosPrimeira = 0;

    // O botão Confirmar chama a função conferirFrase
    document.getElementById('botao-confirmar').onclick = conferirFrase;

    mostrarFrase();
}


// Mostra a imagem da frase da vez e as palavras embaralhadas
function mostrarFrase() {
    let atual = rodada[posicao];
    errouEssaFrase = false;
    esperando = false;

    let imagem = document.getElementById('imagem-frase');
    imagem.src = atual.imagem;
    imagem.alt = 'Imagem de apoio da frase';

    palavrasNoBanco = embaralharPalavras(atual.frase);
    palavrasNaResposta = [];

    document.getElementById('mensagem').textContent = '';
    atualizarProgresso();
    desenharPalavras();
}


// Separa a frase em palavras e embaralha.
// Se por acaso ficar na ordem certa, embaralha de novo.
function embaralharPalavras(frase) {
    // split(' ') separa a frase nas palavras: "O gato bebe" -> ['O', 'gato', 'bebe']
    let palavras = frase.split(' ');

    let embaralhadas = embaralhar(palavras);
    while (embaralhadas.join(' ') == frase) {
        embaralhadas = embaralhar(palavras);
    }
    return embaralhadas;
}


// Desenha (de novo) as palavras nas duas áreas, a partir das duas listas.
// Sempre que uma lista muda, chamamos esta função.
function desenharPalavras() {
    let areaResposta = document.getElementById('area-resposta');
    let banco = document.getElementById('banco-palavras');

    // Tira as cores de certo/errado da tentativa anterior
    areaResposta.classList.remove('certo', 'errado');

    // --- Área da resposta ---
    areaResposta.innerHTML = '';
    if (palavrasNaResposta.length == 0) {
        areaResposta.innerHTML = '<span class="dica-resposta">Toque nas palavras aqui embaixo</span>';
    }
    for (let i = 0; i < palavrasNaResposta.length; i++) {
        let botao = criarBotaoPalavra(palavrasNaResposta[i]);
        // Tocar numa palavra da resposta devolve ela para o banco
        botao.onclick = function () {
            moverPalavra(palavrasNaResposta, palavrasNoBanco, i);
        };
        areaResposta.appendChild(botao);
    }

    // --- Banco de palavras ---
    banco.innerHTML = '';
    for (let i = 0; i < palavrasNoBanco.length; i++) {
        let botao = criarBotaoPalavra(palavrasNoBanco[i]);
        // Tocar numa palavra do banco coloca ela no fim da resposta
        botao.onclick = function () {
            moverPalavra(palavrasNoBanco, palavrasNaResposta, i);
        };
        banco.appendChild(botao);
    }

    // O "Confirmar" só funciona quando todas as palavras foram usadas
    document.getElementById('botao-confirmar').disabled = (palavrasNoBanco.length > 0);
}


// Cria o botão de uma palavra
function criarBotaoPalavra(texto) {
    let botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'palavra-botao';
    botao.textContent = texto;
    return botao;
}


// Tira a palavra da posição "indice" da lista "origem" e coloca no fim da lista "destino"
function moverPalavra(origem, destino, indice) {
    if (esperando) {
        return;
    }
    let palavra = origem.splice(indice, 1)[0]; // splice remove e devolve o item
    destino.push(palavra);
    document.getElementById('mensagem').textContent = '';
    desenharPalavras();
}


// Clicou em "Confirmar": confere se a frase montada está certa
function conferirFrase() {
    if (esperando) {
        return;
    }
    esperando = true;

    let atual = rodada[posicao];
    let montada = palavrasNaResposta.join(' '); // junta as palavras com espaço
    let areaResposta = document.getElementById('area-resposta');
    let mensagem = document.getElementById('mensagem');
    document.getElementById('botao-confirmar').disabled = true;

    if (montada == atual.frase) {
        if (!errouEssaFrase) {
            acertosPrimeira++;
        }
        areaResposta.classList.add('certo');
        mensagem.className = 'mensagem-jogo msg-certo';
        mensagem.textContent = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)] + ' Sua flor está crescendo!';
        tocarSom('acerto');

        // Espera 1,5 segundo e vai para a próxima frase
        setTimeout(proximaFrase, 1500);
    } else {
        errouEssaFrase = true;
        areaResposta.classList.add('errado');
        mensagem.className = 'mensagem-jogo msg-erro-gentil';
        mensagem.textContent = 'Quase lá! Tente novamente.';
        tocarSom('erro');

        // Depois de 1,2 segundo, as palavras voltam para o banco
        setTimeout(function () {
            palavrasNoBanco = embaralharPalavras(atual.frase);
            palavrasNaResposta = [];
            esperando = false;
            desenharPalavras();
        }, 1200);
    }
}


function proximaFrase() {
    posicao++;

    if (posicao < FRASES_POR_RODADA) {
        mostrarFrase();
    } else {
        // Acabou a rodada: marca a última bolinha e salva o resultado
        atualizarProgresso();
        salvarAtividade('frases', FRASES_POR_RODADA, acertosPrimeira);
    }
}


// Mostra "Frase X de 3" e pinta as bolinhas das frases já feitas
function atualizarProgresso() {
    let numero = Math.min(posicao + 1, FRASES_POR_RODADA);
    document.getElementById('progresso-texto').textContent =
        'Frase ' + numero + ' de ' + FRASES_POR_RODADA;

    let bolinhas = '';
    for (let i = 0; i < FRASES_POR_RODADA; i++) {
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
