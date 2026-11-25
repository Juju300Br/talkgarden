// Gera o roteiro de fala e o guia de perguntas da apresentação do PCCT
// uso: node roteiro-pcct.js <caminho do módulo docx>
const fs = require('fs');
const path = require('path');
const D = require(process.argv[2]);
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Footer, PageNumber } = D;

const F = 'Calibri';
const ROXO = '5B4FA8', TINTA = '2F2A4A', CINZA = '6B6789', VERDE = '3F8A44', ROSA = 'B8325A';

// texto com **negrito** simples
function runs(t, o = {}) {
  return t.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p => new TextRun({
    text: p.replace(/\*\*/g, ''), bold: p.startsWith('**') || o.bold, italics: o.italics, font: F, size: o.size || 23, color: o.color || TINTA,
  }));
}
const p = (t, o = {}) => new Paragraph({ spacing: { after: o.after ?? 140, line: 300 }, indent: o.indent ? { left: o.indent } : undefined, children: runs(t, o) });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 200 }, children: [new TextRun({ text: t, font: F, size: 36, bold: true, color: ROXO })] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, spacing: { before: 300, after: 100 }, children: [new TextRun({ text: t, font: F, size: 27, bold: true, color: TINTA })] });
const quem = (q, tempo, cor) => new Paragraph({ keepNext: true, spacing: { after: 100 }, children: [
  new TextRun({ text: q, font: F, size: 21, bold: true, color: cor }), new TextRun({ text: '  ·  ' + tempo, font: F, size: 21, color: CINZA })] });
const fala = t => p(t, { indent: 280 });
const acao = t => p(t, { indent: 280, italics: true, color: CINZA, size: 21 });
const item = t => new Paragraph({ bullet: { level: 0 }, spacing: { after: 80, line: 290 }, children: runs(t) });
const pergunta = t => new Paragraph({ keepNext: true, spacing: { before: 220, after: 80 }, children: runs(t, { bold: true, color: ROXO, size: 23 }) });
const quebra = () => new Paragraph({ children: [new PageBreak()] });

const J = 'Julliana', N = 'Nicoli';
const CJ = ROXO, CN = VERDE;

// ---------- 1. roteiro de fala ----------
const slides = [
  { n: 1, t: 'Capa', q: J, c: CJ, tempo: '20 s', falas: [
    'Bom dia a todos. Eu sou a Julliana, esta é a Nicoli, e nós vamos apresentar o nosso Projeto de Conclusão de Curso Técnico: o TalkGarden, uma plataforma web de apoio ao desenvolvimento da linguagem em crianças com TDL. O trabalho foi orientado pela professora Josiane Rodrigues Sandes.'] },
  { n: 2, t: 'O que é o TDL e por que ele preocupa', q: J, c: CJ, tempo: '1 min 30 s', falas: [
    'Primeiro, o que é o TDL. O Transtorno do Desenvolvimento da Linguagem é uma dificuldade para **compreender e para se expressar pela linguagem**, em crianças que não têm deficiência intelectual nem problema auditivo. Ou seja: a criança escuta bem, é inteligente, mas tem dificuldade com as palavras, com as frases e com o que ouve.',
    'E ele é mais comum do que parece. Um estudo com crianças no primeiro ano escolar encontrou **7,58%** de prevalência, o que dá mais ou menos **duas crianças em cada turma de 30**.',
    'O problema é que o acesso ao fonoaudiólogo, que é quem diagnostica e trata o TDL, é desigual. Em 2013, o **Amazonas tinha a menor oferta de fonoaudiólogos no SUS** do país: 2,12 para cada 100 mil habitantes, enquanto o Amapá tinha 7,73.',
    'Isso se soma a um desafio de alfabetização: em 2024, **40,8%** das crianças das escolas públicas ainda não estavam alfabetizadas no fim do 2º ano. Como a linguagem oral é a base da leitura, a criança com TDL está entre as que mais correm o risco de ficar para trás.',
    'E o próprio nome TDL só foi padronizado em 2017, pelo consenso internacional CATALISE. Por isso ele ainda é pouco conhecido, inclusive nas escolas. Foi pensando nessas crianças que nós criamos o TalkGarden.'] },
  { n: 3, t: 'Objetivos', q: J, c: CJ, tempo: '1 min', falas: [
    'O TalkGarden é para crianças de **6 a 9 anos** com TDL ou com sinais de dificuldade de linguagem. Escolhemos essa faixa porque o TDL é identificado quando as dificuldades continuam depois dos 5 anos, e porque é a fase da alfabetização.',
    'O objetivo geral foi desenvolver um sistema web educativo, lúdico e acessível, focado em vocabulário, construção de frases e compreensão de comandos e de histórias.',
    'Para isso, os objetivos específicos foram: relacionar a BNCC às atividades; estudar as plataformas que já existem e as evidências científicas; oferecer um questionário e avisos ao responsável, sem fazer diagnóstico; modelar o sistema com a UML; projetar telas pensadas para crianças; desenvolver com HTML, CSS e JavaScript; e modelar o banco de dados. Agora a Nicoli continua.'] },
  { n: 4, t: 'O que já existe e o que falta', q: N, c: CN, tempo: '1 min 15 s', falas: [
    'Obrigada, Julliana. Mas por que criar mais uma plataforma? Para explicar, usamos a **Visão Simples da Leitura**, de Gough e Tunmer. Ela diz que entender um texto depende de duas coisas: **decodificar**, que é reconhecer as palavras escritas, e **compreender a linguagem**, que é entender o vocabulário, as frases, as instruções e as histórias.',
    'Já existem boas plataformas gratuitas de alfabetização, como o **GraphoGame**, do MEC, e o **Escribo Play**. Mas elas focam na decodificação, ou seja, nas letras e nos sons. E uma revisão de 2025 sobre intervenções digitais para o TDL mostrou que vocabulário e gramática ainda são pouco trabalhados.',
    'Só que a criança com TDL tem mais dificuldade justamente na **compreensão**. Então o TalkGarden trabalha essa parte, de graça e direto no navegador. Ele não substitui essas plataformas nem o fonoaudiólogo: ele **complementa**.'] },
  { n: 5, t: 'Decisões baseadas em evidências', q: N, c: CN, tempo: '1 min 15 s', falas: [
    'E não foi só isso: cada decisão do projeto partiu de um estudo. Como a dificuldade está mais na compreensão, os jogos trabalham **vocabulário, frases, comandos e histórias**. Como as intervenções digitais focam no fonológico, o nosso foco é **vocabulário e sintaxe**.',
    'O NIDCD aponta que crianças com TDL têm dificuldade para seguir instruções e organizar narrativas: daí vieram o **Siga a Abelha** e o **Conte a História**. Um estudo de Storkel mostrou que são precisas cerca de **36 exposições** para aprender uma palavra nova, por isso as rodadas são curtas e o jardim incentiva a criança a voltar todo dia. E intervenções feitas com os pais melhoram a linguagem, então o **responsável** tem login próprio e acompanha as estatísticas.'] },
  { n: 6, t: 'Como o projeto foi feito', q: N, c: CN, tempo: '50 s', falas: [
    'Quanto ao método, foi uma pesquisa aplicada, de abordagem qualitativa, feita em três etapas.',
    'Na primeira, o **levantamento**: pesquisamos sobre TDL, alfabetização e jogos digitais, e analisamos a BNCC e plataformas parecidas. Na segunda, o **planejamento**: fizemos os diagramas da UML no StarUML e os protótipos das telas no Canva. Na terceira, o **desenvolvimento**: programamos no VS Code com HTML, CSS e JavaScript e modelamos o banco de dados no MySQL Workbench. As tarefas foram organizadas no Trello e o código ficou guardado no GitHub.',
    'Agora a Julliana vai mostrar como a plataforma funciona.'] },
  { n: 7, t: 'Quatro minijogos, quatro habilidades', q: J, c: CJ, tempo: '1 min 30 s', falas: [
    'Obrigada, Nicoli. O TalkGarden tem quatro minijogos, e cada um treina uma habilidade. Todos têm rodadas curtas, leitura em voz alta e retorno imediato, **sem punição**: quando a criança erra, recebe um incentivo e tenta de novo.',
    'No **Jogo de Vocabulário**, a criança ouve a palavra e toca na imagem certa entre três opções. No **Formando Frases**, ela toca nas palavras, uma de cada vez, na ordem certa, para montar a frase.',
    'No **Siga a Abelha**, ela escuta um comando e toca na figura certa. Os comandos vão ficando mais difíceis: primeiro a cor, depois o tamanho, depois a posição, como em cima ou embaixo da mesa, e por fim um comando de duas etapas, como “toque primeiro na bola e depois na estrela”.',
    'E no **Conte a História**, ela ouve uma história curta, coloca três cenas na ordem e responde qual é a ideia central. Cada jogo está ligado a uma habilidade de Língua Portuguesa da BNCC, que aparece no slide.'] },
  { n: 8, t: 'Motivar a criança, orientar a família', q: J, c: CJ, tempo: '1 min 15 s', falas: [
    'Para manter a criança motivada, cada atividade concluída dá **moedas** e faz nascer uma **flor** no jardim virtual. Quando ela bate uma meta, ganha uma **medalha**, como “Primeiro passo”, “Jardim florido” e “Sequência de 7 dias”.',
    'Para o responsável, no primeiro acesso aparece o questionário **“Conhecendo a criança”**. Ele pergunta se a criança tem diagnóstico, quais sinais o responsável percebe no dia a dia, que foram adaptados do NIDCD, e a idade. Se o responsável marca sinais e a criança não tem diagnóstico, a plataforma explica que isso **não significa TDL** e recomenda uma avaliação na UBS ou com o apoio da escola.',
    'E nas estatísticas, se a criança acerta de primeira **menos de 60%** depois de **pelo menos 12 respostas**, aparece o aviso “Vale prestar atenção”, sugerindo compartilhar os dados com a escola ou com um fonoaudiólogo. Esses valores são parâmetros iniciais que nós definimos e ainda precisam ser validados por profissionais. A plataforma **nunca diz que a criança tem TDL**. Agora a Nicoli mostra como tudo isso foi planejado.'] },
  { n: 9, t: 'Requisitos e casos de uso', q: N, c: CN, tempo: '40 s', falas: [
    'Obrigada, Julliana. Para construir tudo isso, levantamos **16 requisitos funcionais**, como login, cadastro, os quatro jogos, recompensas, conquistas, estatísticas, o questionário e o aviso. São **três atores**: o visitante, que pode criar uma conta; o responsável, que faz login e acompanha a criança; e a criança, que joga. No diagrama, os quatro jogos incluem o caso “Ganhar recompensas”, que pode se estender para “Desbloquear conquista”.'] },
  { n: 10, t: 'Classes, arquitetura e dados', q: N, c: CN, tempo: '1 min', acoes: ['Use a seta para passar pelos três diagramas.'], falas: [
    'No **diagrama de classes**, as principais são Responsável, Criança e Atividade. Atividade é uma **classe abstrata**, e os quatro jogos herdam dela os acertos, os erros e a conclusão.',
    '[seta] Na **arquitetura**, são três camadas: a apresentação, no navegador; a lógica, no servidor; e os dados, no MySQL.',
    '[seta] E o **modelo lógico** do banco, feito no MySQL Workbench, tem oito tabelas. É importante dizer que, **nesta versão do protótipo, os dados ficam salvos no próprio navegador, com o localStorage**, seguindo as mesmas informações do modelo. Levar o banco para o MySQL num servidor é a próxima etapa.'] },
  { n: 11, t: 'Uma interface acolhedora e alegre', q: N, c: CN, tempo: '40 s', falas: [
    'Na interface, cada cor tem um significado: roxo é a marca, verde é o acerto, rosa é o “tente de novo” e amarelo são as moedas. As ilustrações são vetoriais e o cenário é fixo, sem animações que distraiam. A logo junta um balão de fala, o “talk”, com uma flor nascendo, o “garden”. E pensamos na acessibilidade: **leitura em voz alta, letras grandes, controle de sons e pouco texto por tela**. E a Julliana vai mostrar as telas.'] },
  { n: 12, t: 'Principais telas', q: J, c: CJ, tempo: '20 s', acoes: ['Mostre só duas ou três abas e siga para o vídeo. Neste slide, a seta passa pelas 10 abas antes de ir para o próximo; para pular, clique direto na última aba.'], falas: [
    'Obrigada, Nicoli. Aqui estão as principais telas da plataforma. Mas o melhor é ver o sistema funcionando.'] },
  { n: 13, t: 'O TalkGarden funcionando (vídeo)', q: J, c: CJ, tempo: '2 min 21 s de vídeo', acoes: ['Clique no play. O vídeo já tem narração. Quando terminar, passe para o próximo slide e a Nicoli assume a conclusão.'], falas: [
    'Preparamos um vídeo curto com o sistema do começo ao fim.'] },
  { n: 14, t: 'Conclusão', q: N, c: CN, tempo: '1 min 15 s', falas: [
    'Para concluir: o TalkGarden ocupa um espaço pouco explorado, que é a **compreensão da linguagem** em crianças com TDL. Entregamos quatro minijogos alinhados à BNCC, o questionário e os avisos para o responsável, o jardim com moedas e medalhas, e uma interface colorida, responsiva e acessível.',
    'Também reconhecemos as limitações: a plataforma depende de internet, **ainda não foi testada com crianças com TDL nem avaliada por fonoaudiólogos**, e ela **não diagnostica**, porque esse papel é do fonoaudiólogo.',
    'Como trabalhos futuros, queremos avaliar a plataforma com crianças e fonoaudiólogos, validar um instrumento de triagem para famílias e escolas, hospedar o sistema com o banco MySQL, criar atividades de inferência para as crianças maiores e um painel para professores e fonoaudiólogos.'] },
  { n: 15, t: 'Referências', q: N, c: CN, tempo: '10 s', falas: [
    'Essas são as principais referências do trabalho. A lista completa está no documento.'] },
  { n: 16, t: 'Obrigada', q: J, c: CJ, tempo: '10 s', falas: [
    'Obrigada pela atenção. Estamos à disposição para as perguntas.'] },
];

const roteiro = [];
for (const s of slides) {
  roteiro.push(h2(`Slide ${s.n}. ${s.t}`));
  roteiro.push(quem(s.q, s.tempo, s.c));
  (s.acoes || []).forEach(a => roteiro.push(acao(a)));
  s.falas.forEach(f => roteiro.push(fala(f)));
}
const palavras = q => slides.filter(s => s.q === q).flatMap(s => s.falas).join(' ').split(/\s+/).length;
console.log('palavras', J, palavras(J), N, palavras(N));

// ---------- 2. como o sistema funciona ----------
const sistema = [
  ['Cadastro e login', [
    'O responsável cria a conta com o nome dele, o nome da criança, o e-mail e uma senha de pelo menos 6 caracteres. O sistema confere se os campos estão preenchidos, se o e-mail é válido e se ainda não foi cadastrado.',
    'A senha **nunca é guardada como foi digitada**: antes de salvar, o sistema gera um **hash SHA-256** dela, com a Web Crypto API do navegador. No login, ele gera o hash da senha digitada e compara com o hash salvo.',
    'A opção **“Lembrar de mim”** guarda a sessão no localStorage, que continua depois de fechar o navegador; sem ela, a sessão fica no sessionStorage, que some ao fechar a aba.',
    'Em **“Esqueci a senha”**, o sistema confere se o e-mail existe e deixa criar uma senha nova. No protótipo, o envio do e-mail é **simulado**: mandar um e-mail de verdade precisa de um servidor.',
    'Conta de demonstração: **demo@talkgarden.com**, senha **123456**.']],
  ['Onde ficam os dados', [
    'Nesta versão, tudo fica no **localStorage** do navegador, que é um espaço de armazenamento do próprio navegador. É um objeto em formato JSON com os usuários, e cada usuário guarda os dados da criança: moedas, flores, medalhas, acertos de cada jogo, dias de prática, questionário e configurações.',
    'Por isso, se o navegador for limpo ou a pessoa trocar de aparelho, os dados não vão junto. Isso será resolvido com o banco **MySQL** no servidor, que já está modelado (oito tabelas) e é a próxima etapa.',
    'Antes do login, do cadastro e de salvar o perfil, o sistema confere se há internet (navigator.onLine) e avisa se não houver, como vai acontecer na versão com servidor.']],
  ['Questionário “Conhecendo a criança”', [
    'Aparece no primeiro acesso e pode ser refeito no perfil. São três perguntas: se a criança tem diagnóstico de TDL (sim, em avaliação ou não), quais destes **6 sinais** o responsável percebe, adaptados do NIDCD, e a idade.',
    'Os sinais: dificuldade para seguir instruções; para aprender palavras novas ou achar a palavra certa; frases curtas ou com muitos erros para a idade; histórias contadas de forma desorganizada; dificuldade para aprender a ler ou entender o que lê; e ter começado a falar mais tarde.',
    'A resposta é uma **orientação**, nunca um diagnóstico. Com diagnóstico, sugere compartilhar as estatísticas com o fonoaudiólogo. Em avaliação, diz que a criança já pode usar a plataforma. Com sinais e sem diagnóstico, diz que isso não significa TDL e recomenda uma avaliação na UBS ou com a escola. Se a idade estiver fora de 6 a 9 anos, recomenda usar com um adulto.']],
  ['Jogo de Vocabulário', [
    'Cada rodada sorteia **3 palavras** de uma lista de **14**. A palavra aparece escrita e é lida em voz alta, e a criança escolhe entre **três imagens**: a certa e duas sorteadas.',
    'Se erra, a imagem errada fica marcada e ela tenta de novo. O sistema conta quantas palavras ela acertou **de primeira**, e é esse número que vai para as estatísticas.',
    'Moedas: 3 por acerto de primeira, mais 1 (no mínimo 4).']],
  ['Formando Frases', [
    'Sorteia uma de **6 frases** (por exemplo, “O gato dorme no sofá”), com uma imagem de apoio. As palavras aparecem embaralhadas em blocos, e a criança toca nelas na ordem certa e depois em “Verificar”.',
    'Se a ordem estiver errada, os blocos voltam e ela tenta de novo. Moedas: 10, menos 3 por erro (no mínimo 4).']],
  ['Siga a Abelha', [
    'Cada rodada tem **4 comandos**, um de cada tipo, do mais fácil ao mais difícil: **cor** (“toque na bola azul”), **tamanho** (“toque na estrela grande e vermelha”), **posição** (“toque no gato que está embaixo da mesa”) e **duas etapas** (“toque primeiro na bola e depois na flor”).',
    'Os comandos são **gerados no código** a cada rodada, sorteando objetos, cores e posições, então raramente se repetem. Se a criança erra, a abelha repete o comando. Moedas: 2 por acerto de primeira, mais 2 (no mínimo 4).']],
  ['Conte a História', [
    'Sorteia uma de **4 histórias** curtas (A sementinha, O pintinho, O sorvete e Dia e noite). A história é lida em voz alta, e a criança coloca **3 cenas** na ordem em que aconteceram.',
    'Depois, responde **sobre o que é a história**, escolhendo a ideia central entre três opções. Moedas: 10, menos 3 por erro (no mínimo 4).']],
  ['Recompensas, jardim e medalhas', [
    'Toda atividade concluída soma as moedas, planta **uma flor** (os tipos seguem um ciclo) e conta uma atividade no dia. O jardim fica **100% completo com 20 flores**. A **sequência** conta quantos dias seguidos a criança jogou, e a meta diária é de 4 atividades.',
    'São **8 medalhas**, conferidas automaticamente depois de cada atividade: Primeiro passo (1ª atividade), Jardim florido (5 flores), Sequência de 7 dias, Mestre das frases (25 frases), Caçador de palavras (50 palavras certas), Cofrinho cheio (300 moedas), Bom ouvinte (20 comandos certos no Siga a Abelha) e Contador de histórias (10 histórias organizadas). Na tela de conquistas aparecem as ganhas e o que falta para as outras.']],
  ['Estatísticas e aviso', [
    'Mostram o percentual de acertos de primeira no Vocabulário e no Siga a Abelha, quantas frases e histórias foram feitas, os dias de prática e um gráfico com as atividades de cada dia da semana.',
    'O aviso **“Vale prestar atenção”** aparece quando o acerto de primeira fica **abaixo de 60%** com **pelo menos 12 respostas**, e só nesses dois jogos, porque são eles que contam acertos por pergunta. O texto deixa claro que não é diagnóstico.']],
  ['Perfil e acessibilidade', [
    'No perfil, o responsável edita os nomes, o e-mail e a idade, escolhe o avatar e liga ou desliga **sons, música, leitura em voz alta e letras grandes**.',
    'A **leitura em voz alta** usa a **Web Speech API** (speechSynthesis), que é a voz em português do próprio navegador; não há arquivos de áudio. Os **sons** de acerto e erro e a música são notas geradas no código com a **Web Audio API**.',
    'O layout é **responsivo**: o CSS adapta as telas para computador, tablet e celular. Ao sair, o sistema pede confirmação e o jardim fica guardado.']],
];
const parte2 = [];
for (const [t, ps] of sistema) { parte2.push(h2(t)); ps.forEach(x => parte2.push(p(x))); }

// ---------- 3. perguntas ----------
const qa = [
  ['Sobre o tema', [
    ['O que é o TDL? É a mesma coisa que autismo ou dislexia?', 'Não. O TDL é uma dificuldade persistente na linguagem oral, para compreender e para se expressar, sem deficiência intelectual nem perda auditiva. O autismo envolve principalmente a interação social e o comportamento. A dislexia é uma dificuldade específica na leitura, no reconhecimento das palavras escritas. Elas podem aparecer junto com o TDL, mas são condições diferentes.'],
    ['Por que crianças de 6 a 9 anos?', 'Por três motivos: o TDL é identificado quando as dificuldades continuam depois dos 5 anos (consenso CATALISE); dos 6 aos 7 anos a BNCC coloca o foco na alfabetização, e o PNE quer todas as crianças alfabetizadas até o 3º ano; e é nessa idade que estão as crianças que estão aprendendo a ler ou que já deveriam ter aprendido.'],
    ['A plataforma diagnostica o TDL?', 'Não, e nem pode. Quem diagnostica é o fonoaudiólogo. O questionário e o aviso só orientam o responsável a procurar uma avaliação, e todos os textos dizem que aquilo não é diagnóstico.'],
    ['Qual é o diferencial em relação ao GraphoGame e ao Escribo Play?', 'Eles trabalham a decodificação: letras, sons e consciência fonológica. O TalkGarden trabalha a compreensão da linguagem (vocabulário, frases, comandos e histórias), que é onde a criança com TDL tem mais dificuldade. Ele pode ser usado junto com eles.'],
    ['Qual a relação com a BNCC?', 'Cada jogo foi ligado a uma habilidade de Língua Portuguesa dos anos iniciais: Vocabulário com a EF12LP01 (ler palavras de uso frequente), Formando Frases com a EF01LP12 (separação das palavras), Siga a Abelha com a EF15LP10 (escutar com atenção), e Conte a História com a EF15LP19 (recontar histórias) e a EF35LP03 (identificar a ideia central). Rimas e sílabas ficaram de fora de propósito, porque são o foco das outras plataformas.'],
  ]],
  ['Sobre a validação e os limites', [
    ['Como vocês sabem que a plataforma funciona? Ela foi testada com crianças?', 'Ainda não. Essa é a principal limitação, e nós colocamos isso na conclusão. As decisões foram baseadas em estudos científicos, mas o próximo passo é avaliar a plataforma com crianças e com fonoaudiólogos.'],
    ['De onde vieram os 60% e as 12 respostas do aviso?', 'São parâmetros iniciais que a equipe definiu. As 12 respostas existem para o aviso não aparecer por causa de uma rodada ruim (são 4 rodadas de vocabulário ou 3 do Siga a Abelha). Os dois números ainda precisam ser validados por fonoaudiólogos, e isso está nos trabalhos futuros.'],
    ['Por que o aviso só aparece no Vocabulário e no Siga a Abelha?', 'Porque esses dois jogos contam o acerto de primeira em cada pergunta. No Formando Frases e no Conte a História, cada rodada é uma frase ou uma história inteira, e o sistema conta quantas foram concluídas.'],
    ['O questionário foi validado?', 'Não. Os sinais foram adaptados da lista do NIDCD, mas não é um instrumento validado. Não encontramos um protocolo nacional de triagem do TDL para pais e professores, e por isso apontamos a validação de um instrumento como uma lacuna para pesquisas futuras.'],
    ['Tem pouco conteúdo: 14 palavras, 6 frases e 4 histórias. Isso não é pouco?', 'Para um protótipo, a ideia foi mostrar que os quatro tipos de atividade funcionam. O conteúdo fica em listas no arquivo de dados, então ampliar é só acrescentar itens. No Siga a Abelha, os comandos já são gerados automaticamente.'],
  ]],
  ['Sobre a parte técnica', [
    ['Onde ficam salvos os dados?', 'Nesta versão, no localStorage do navegador, em formato JSON. O banco MySQL está modelado no Workbench, com oito tabelas, e a migração para um servidor é a próxima etapa.'],
    ['Se o documento fala em MySQL e em servidor, por que vocês usaram localStorage?', 'Porque assim o protótipo funciona só abrindo no navegador, sem instalar servidor, o que facilitou desenvolver e testar. A estrutura dos dados segue o mesmo modelo do banco, então a troca fica mais simples.'],
    ['E se a pessoa limpar o navegador ou trocar de celular?', 'Os dados se perdem ou não vão junto. É uma limitação do localStorage e o principal motivo para ir para o MySQL num servidor.'],
    ['As senhas estão seguras?', 'A senha não é guardada como foi digitada: o sistema salva um hash SHA-256 dela, gerado com a Web Crypto API. No login, ele compara os hashes. Na versão com servidor, o hash será feito no servidor.'],
    ['O “Esqueci a senha” manda e-mail?', 'No protótipo, o envio é simulado: o sistema confere se o e-mail existe e deixa criar uma senha nova. Mandar e-mail de verdade precisa de um servidor.'],
    ['Por que a plataforma depende de internet se os dados estão no navegador?', 'O sistema confere a conexão antes do login e do cadastro porque a versão final vai salvar no servidor. No protótipo, essa verificação já deixa o comportamento pronto para isso.'],
    ['Como funciona a leitura em voz alta?', 'Com a Web Speech API, que já vem nos navegadores. O código pede para o navegador falar o texto com uma voz em português. Não usamos arquivos de áudio. Os sons de acerto e erro são gerados com a Web Audio API.'],
    ['Por que HTML, CSS e JavaScript puros e não um framework?', 'Porque são as linguagens que aprendemos no curso, rodam em qualquer navegador sem instalação e deixam o código mais simples de entender e de manter. Para o tamanho do projeto, um framework não era necessário.'],
    ['Como a plataforma funciona no celular?', 'O CSS é responsivo: com media queries, o layout se adapta ao tamanho da tela. Por isso funciona no computador, no tablet e no celular.'],
    ['Por que Atividade é uma classe abstrata?', 'Porque não existe uma “atividade” solta: toda atividade é um dos quatro jogos. A classe abstrata reúne o que todos têm em comum (acertos, erros e conclusão), e os jogos herdam isso.'],
    ['Por que existe a tabela crianca_conquista?', 'Porque a relação entre criança e conquista é de muitos para muitos: uma criança ganha várias medalhas, e cada medalha pode ser ganha por várias crianças. A tabela associativa resolve isso.'],
    ['Por que as estatísticas não têm uma tabela própria?', 'Porque elas são calculadas a partir da tabela atividade. Guardar de novo seria repetir dados.'],
    ['E a proteção dos dados das crianças (LGPD)?', 'No protótipo, nada sai do aparelho: os dados ficam só no navegador. Na versão com servidor, será preciso seguir a LGPD, que exige o consentimento do responsável para tratar dados de crianças. Por isso o login e o cadastro são do responsável.'],
  ]],
  ['Sobre vocês (respondam com as palavras de vocês)', [
    ['Como vocês dividiram o trabalho?', 'Falem a verdade sobre quem fez o quê: pesquisa, documento, diagramas, telas, código e vídeo. Dica: digam que as duas conhecem o sistema inteiro.'],
    ['Quais foram as maiores dificuldades?', 'Ideias para pensar: entender o TDL, que é pouco conhecido; tomar cuidado para a plataforma não parecer que faz diagnóstico; adaptar a linguagem e as telas para crianças pequenas; e fazer a voz funcionar em navegadores diferentes.'],
    ['O que vocês fariam diferente ou fariam em seguida?', 'Testar com crianças e fonoaudiólogos, colocar o banco no servidor, ampliar as palavras, frases e histórias e criar um painel para professores.'],
  ]],
];
const parte3 = [p('As respostas são curtas de propósito: falem com calma e com as palavras de vocês. Se não souberem algo, é melhor dizer “isso ainda não fizemos, mas está nos trabalhos futuros” do que inventar.')];
for (const [g, lista] of qa) { parte3.push(h2(g)); for (const [q, r] of lista) { parte3.push(pergunta(q)); parte3.push(p(r)); } }

// ---------- 4. dicas ----------
const dicas = [
  'Abram a apresentação pelo arquivo **docs/Apresentacao-TalkGarden.html**. O vídeo **TalkGarden-demonstracao.mp4** precisa estar na mesma pasta, senão ele não aparece. Levem a pasta docs inteira num pen drive.',
  'Testem o som do computador da sala antes, porque o vídeo tem narração.',
  'Aperte **F** para tela cheia. As setas ou o passador passam os slides. No slide 10 e no slide 12, a seta passa primeiro pelas abas.',
  'Se pedirem para mostrar o sistema ao vivo, abram o **index.html** com internet ligada (sem internet o login não entra) e usem a conta **demo@talkgarden.com**, senha **123456**.',
  'O tempo total fica em torno de 15 minutos: uns 12 de fala e 2 min 21 s de vídeo. Se precisarem encurtar, resumam os slides 3 (objetivos), 6 (metodologia) e 9 (requisitos).',
  'Ensaiem pelo menos duas vezes cronometrando, uma lendo e outra só olhando os slides. Não precisa decorar palavra por palavra: o importante é saber a ideia de cada slide.',
  'Na hora das perguntas, a outra pode completar a resposta. Combinem que quem souber melhor o assunto responde.',
];

const doc = new Document({
  styles: { default: { document: { run: { font: F } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1200, left: 1400, right: 1400 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: F, size: 18, color: CINZA })] })] }) },
    children: [
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Apresentação do PCCT', font: F, size: 44, bold: true, color: ROXO })] }),
      new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: 'TalkGarden · roteiro de fala, como o sistema funciona e perguntas da banca', font: F, size: 25, color: CINZA })] }),
      p('A apresentação tem 16 slides e dura cerca de 15 minutos: uns 12 minutos de fala e 2 min 21 s de vídeo. A fala está dividida ao meio, e as duas apresentam teoria e sistema, alternando a cada dois ou três slides para não ficar cansativo. A **Julliana** faz a abertura e o problema (slides 1 a 3), os jogos e o jardim (7 e 8), as telas e o vídeo (12 e 13) e o agradecimento (16). A **Nicoli** faz o que já existe, as evidências e a metodologia (4 a 6), os requisitos, a modelagem e a interface (9 a 11), a conclusão e as referências (14 e 15).'),
      p('Os trechos em negrito são as ideias que não podem faltar. O resto pode ser dito com as palavras de vocês.'),
      h1('1. Roteiro de fala'), ...roteiro,
      quebra(), h1('2. Como o sistema funciona'),
      p('Esta parte é para estudar. Ela explica cada funcionalidade como está no código (js/app.js, js/data.js e js/games-data.js), com os números que a banca pode perguntar.'),
      ...parte2,
      quebra(), h1('3. Perguntas que a banca pode fazer'), ...parte3,
      quebra(), h1('4. Para o dia da apresentação'), ...dicas.map(item),
    ],
  }],
});
const out = path.join(__dirname, '..', 'Roteiro da apresentacao - PCCT.docx');
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('ok', out); });
