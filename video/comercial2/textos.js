// Falas do comercial (roteiro de dublagem; o vídeo não tem legenda).
module.exports = {
  abertura: [
    { clipe: 'v6100', de: 1.5, dur: 5.2, texto: 'Sabe aquela criança que trava na hora de falar?' },
    { clipe: 'v5927', de: 1.0, dur: 7.0, texto: 'Pode ser TDL, o Transtorno do Desenvolvimento da Linguagem, que atinge sete em cada cem crianças.' },
    { clipe: 'v6100', de: 12.0, dur: 5.4, texto: 'E muitas famílias não conseguem acompanhamento com um fonoaudiólogo.' },
    { logo: true, dur: 14.5, itens: ['Plataforma web gratuita', 'Para crianças de 6 a 9 anos com TDL', 'Jogos, recompensas e um jardim que cresce'],
      texto: 'Para ajudar essas crianças, criamos o TalkGarden: uma plataforma web gratuita, para crianças de seis a nove anos, que trabalha a linguagem com jogos, recompensas e um jardim que cresce a cada atividade. Veja como funciona.' },
  ],
  sistema: [
    { id: 'cadastro', texto: 'Primeiro, o responsável cria a conta. Se faltar alguma informação, o sistema avisa.' },
    { id: 'senha', texto: 'Esqueceu a senha? Dá para criar uma nova em poucos passos.' },
    { id: 'login', texto: 'No login, o e-mail e a senha são conferidos antes de entrar.' },
    { id: 'inicio', texto: 'Na tela inicial, ela vê o jardim e os dois jogos.' },
    { id: 'vocab', texto: 'No Jogo de Vocabulário, ela ouve a palavra e toca na imagem certa. Se errar, recebe um incentivo para tentar de novo.' },
    { id: 'recompensa', texto: 'Cada jogo concluído dá moedas e faz nascer uma flor.' },
    { id: 'frases', texto: 'No Formando Frases, ela toca nas palavras na ordem certa para montar a frase.' },
    { id: 'medalha', texto: 'Bateu uma meta? Ganha uma medalha nova.' },
    { id: 'jardim', texto: 'No jardim, ela vê o progresso florescer.' },
    { id: 'conquistas', texto: 'Nas conquistas, ela vê as medalhas ganhas e as próximas.' },
    { id: 'estatisticas', texto: 'E o responsável acompanha o desempenho da criança pelas estatísticas.' },
    { id: 'perfil', texto: 'No perfil, dá para trocar o avatar e ajustar sons, leitura em voz alta e letras grandes.' },
    { id: 'sair', texto: 'Ao sair, tudo fica guardado para a próxima vez.' },
  ],
  final: [
    { clipe: 'v6264', de: 2.5, dur: 4.2, texto: 'Com o TalkGarden, aprender vira brincadeira.' },
    { clipe: 'v6166', de: 4.0, dur: 4.2, texto: 'E cada palavra nova faz o jardim florescer.' },
    { clipe: 'v4874', de: 3.0, dur: 6.0, texto: 'Um apoio para praticar em casa e na escola, junto com o fonoaudiólogo.' },
    { logo: true, dur: 4.6, texto: 'TalkGarden: aprender brincando, uma flor de cada vez.' },
  ],
};
// tempo de leitura de cada fala (~2,6 palavras por segundo)
module.exports.tempoFala = t => t.split(/\s+/).filter(Boolean).length / 2.6 + 0.8;
