// =====================================================================
// geral.js
// Funções usadas em várias páginas do TalkGarden:
// senha, sons, embaralhar listas, salvar a atividade e mostrar a recompensa.
// =====================================================================


// ---------------------------------------------------------------------
// SENHA: mostra ou esconde a senha quando a pessoa clica no "olhinho".
// idCampo = o id do <input> da senha (ex.: "senha").
// ---------------------------------------------------------------------
function mostrarSenha(idCampo) {
    let campo = document.getElementById(idCampo);

    // Se está escondida (password), mostra (text). Se está aparecendo, esconde.
    if (campo.type == 'password') {
        campo.type = 'text';
    } else {
        campo.type = 'password';
    }
}


// ---------------------------------------------------------------------
// SONS
// Os sons são notas musicais criadas pelo próprio navegador (Web Audio API),
// então não precisamos de arquivos de áudio.
// ---------------------------------------------------------------------
let contextoSom = null; // o "aparelho de som" do navegador (criado só quando precisar)

// tipo: 'acerto', 'erro' ou 'vitoria'
function tocarSom(tipo) {
    // O <body> tem data-som="1" (ligado) ou "0" (desligado), vindo do perfil.
    if (document.body.dataset.som != '1') {
        return;
    }

    // Navegadores muito antigos não têm Web Audio: aí fica sem som mesmo.
    let AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (!AudioContexto) {
        return;
    }
    if (contextoSom == null) {
        contextoSom = new AudioContexto();
    }

    // Cada número é a frequência de uma nota musical (em Hz).
    let notas;
    if (tipo == 'acerto') {
        notas = [523, 659, 784];        // dó, mi, sol (subindo = alegre)
    } else if (tipo == 'erro') {
        notas = [392, 330];             // sol, mi (descendo, baixinho e suave)
    } else {
        notas = [523, 659, 784, 1047];  // vitória: dó, mi, sol, dó agudo
    }

    // Toca uma nota depois da outra (0,12 segundo de diferença)
    for (let i = 0; i < notas.length; i++) {
        tocarNota(notas[i], i * 0.12, 0.25);
    }
}

// Toca uma única nota.
// frequencia = qual nota | atraso = daqui a quantos segundos | duracao = em segundos
function tocarNota(frequencia, atraso, duracao) {
    let oscilador = contextoSom.createOscillator(); // gera o som
    let volume = contextoSom.createGain();          // controla o volume

    oscilador.type = 'sine'; // som "redondinho", suave
    oscilador.frequency.value = frequencia;

    let inicio = contextoSom.currentTime + atraso;
    volume.gain.setValueAtTime(0.2, inicio);                          // começa baixo (20%)
    volume.gain.exponentialRampToValueAtTime(0.001, inicio + duracao); // e vai sumindo

    oscilador.connect(volume);
    volume.connect(contextoSom.destination); // destination = caixa de som
    oscilador.start(inicio);
    oscilador.stop(inicio + duracao);
}


// ---------------------------------------------------------------------
// EMBARALHAR: devolve uma CÓPIA da lista com os itens em ordem aleatória.
// (Algoritmo de Fisher-Yates: troca cada item com outro sorteado.)
// ---------------------------------------------------------------------
function embaralhar(lista) {
    let copia = lista.slice(); // slice() sem nada faz uma cópia da lista

    for (let i = copia.length - 1; i > 0; i--) {
        let sorteado = Math.floor(Math.random() * (i + 1)); // número de 0 até i
        let guardado = copia[i];
        copia[i] = copia[sorteado];
        copia[sorteado] = guardado;
    }
    return copia;
}


// ---------------------------------------------------------------------
// SALVAR ATIVIDADE (usada pelos dois jogos no fim da rodada)
// Envia o resultado para api/salvar_atividade.php com fetch().
// A API responde com as moedas ganhas e aí mostramos a recompensa.
// ---------------------------------------------------------------------
function salvarAtividade(tipo, totalItens, acertosPrimeira) {
    let mensagem = document.getElementById('mensagem');
    mensagem.className = 'mensagem-jogo';
    mensagem.textContent = 'Plantando sua flor...';

    // Dados que vão para o PHP, em formato JSON
    let dados = {
        tipo: tipo,
        total_itens: totalItens,
        acertos_primeira: acertosPrimeira
    };

    fetch('api/salvar_atividade.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados) // transforma o objeto em texto JSON
    })
        .then(function (resposta) {
            return resposta.json(); // transforma a resposta (texto JSON) em objeto
        })
        .then(function (resultado) {
            if (resultado.ok) {
                mensagem.textContent = '';
                mostrarRecompensa(resultado, totalItens, acertosPrimeira);
            } else {
                mostrarErroAoSalvar(resultado.mensagem, tipo, totalItens, acertosPrimeira);
            }
        })
        .catch(function () {
            // Entra aqui se o servidor não responder (XAMPP desligado, sem internet...)
            mostrarErroAoSalvar('Não consegui falar com o servidor.', tipo, totalItens, acertosPrimeira);
        });
}

// Mostra a mensagem de erro e um botão para tentar salvar de novo.
function mostrarErroAoSalvar(texto, tipo, totalItens, acertosPrimeira) {
    let mensagem = document.getElementById('mensagem');
    mensagem.className = 'mensagem-jogo msg-erro-gentil';
    mensagem.textContent = 'Ops! ' + texto + ' ';

    let botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'link-botao';
    botao.textContent = 'Tentar de novo';
    botao.onclick = function () {
        salvarAtividade(tipo, totalItens, acertosPrimeira);
    };
    mensagem.appendChild(botao);
}


// ---------------------------------------------------------------------
// RECOMPENSA (protótipo 09)
// resultado = resposta da API: { moedas_ganhas, saldo, total_flores, ... }
// ---------------------------------------------------------------------

// Cores das flores, na ordem em que são plantadas (1ª rosa, 2ª azul, 3ª amarela, 4ª rosa...)
const CORES_DAS_FLORES = ['rosa', 'azul', 'amarela'];

function mostrarRecompensa(resultado, totalItens, acertosPrimeira) {
    // Atualiza o saldo de moedas lá no topo da página
    document.getElementById('saldo-moedas').textContent = resultado.saldo;

    // Escolhe a cor da flor nova. O % é o "resto da divisão":
    // flor 1 -> resto 0 -> rosa | flor 2 -> 1 -> azul | flor 3 -> 2 -> amarela | flor 4 -> 0 -> rosa
    let cor = CORES_DAS_FLORES[(resultado.total_flores - 1) % 3];
    document.getElementById('recompensa-flor').src = 'img/jardim/flor-' + cor + '.svg';

    document.getElementById('recompensa-moeda').textContent = '+' + resultado.moedas_ganhas;
    document.getElementById('recompensa-pilula-moedas').textContent = '+' + resultado.moedas_ganhas + ' moedas';
    document.getElementById('recompensa-acertos').textContent =
        'Acertos de primeira: ' + acertosPrimeira + ' de ' + totalItens;

    // Tira o "hidden" para o modal aparecer
    document.getElementById('modal-recompensa').hidden = false;
    tocarSom('vitoria');
}
