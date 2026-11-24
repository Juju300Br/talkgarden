// Falas do comercial (as legendas seguem estas frases; quem dubla lê junto com a legenda).
// A palavra entre *asteriscos* aparece em amarelo.
module.exports = {
  abertura: [
    { clipe: 'v6100', de: 1.5, dur: 5.2, texto: 'Sabe aquela criança que *trava* na hora de falar ou de ler?' },
    { clipe: 'v5927', de: 1.0, dur: 5.0, texto: 'Pode ser o *TDL*, que atinge sete em cada cem crianças.' },
    { clipe: 'v6100', de: 12.0, dur: 4.6, texto: 'E muitas famílias não conseguem um *fonoaudiólogo*.' },
    { logo: true, dur: 2.8, texto: 'Conheça o *TalkGarden*!' },
  ],
  sistema: [
    { id: 'cadastro', texto: 'O responsável cria a *conta*, e o sistema avisa se faltar alguma informação.' },
    { id: 'senha', texto: 'Esqueceu a *senha*? Dá para criar uma nova em poucos passos.' },
    { id: 'login', texto: 'No *login*, o e-mail e a senha são conferidos antes de entrar.' },
    { id: 'inicio', texto: 'Na tela inicial, a criança vê o seu *jardim* e os jogos.' },
    { id: 'vocab', texto: 'No Jogo de *Vocabulário*, ela ouve a palavra e toca na imagem certa. Se errar, recebe um *incentivo*.' },
    { id: 'recompensa', texto: 'Cada jogo concluído dá *moedas* e faz uma flor nascer.' },
    { id: 'frases', texto: 'No Formando *Frases*, ela toca nas palavras na ordem certa para montar a frase.' },
    { id: 'medalha', texto: 'Ao bater uma meta, ganha uma *medalha* nova.' },
    { id: 'jardim', texto: 'O *jardim* cresce a cada atividade.' },
    { id: 'conquistas', texto: 'Nas *conquistas*, ela vê as medalhas e o que falta para as próximas.' },
    { id: 'estatisticas', texto: 'E o responsável acompanha o desempenho nas *estatísticas*.' },
    { id: 'perfil', texto: 'No *perfil*, dá para trocar o avatar e ajustar sons, leitura em voz alta e letras grandes.' },
    { id: 'sair', texto: 'Ao sair, o jardim fica *guardado* para a próxima vez.' },
  ],
  final: [
    { clipe: 'v6264', de: 2.5, dur: 4.2, texto: 'Com o TalkGarden, aprender vira *brincadeira*.' },
    { clipe: 'v6166', de: 4.0, dur: 4.2, texto: 'E cada palavra nova faz o jardim *florescer*.' },
    { clipe: 'v4874', de: 3.0, dur: 3.6, texto: '' },
    { logo: true, dur: 4.4, texto: '*TalkGarden*: aprender brincando, uma flor de cada vez.' },
  ],
};
// tempo mínimo de cada fala (leitura calma, ~2,6 palavras por segundo)
module.exports.tempoFala = t => t.replace(/\*/g, '').split(/\s+/).filter(Boolean).length / 2.6 + 0.8;
