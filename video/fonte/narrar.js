// Gera um áudio por fala do roteiro (voz neural da Microsoft) e grava as durações
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const ffmpeg = require('ffmpeg-static');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const roteiro = require('./roteiro.js');

const VOZ = process.argv[2] || 'pt-BR-FranciscaNeural';
const DIR = path.join(__dirname, 'audio');

function duracao(arq) {
  const r = spawnSync(ffmpeg, ['-i', arq, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = [...r.stderr.matchAll(/time=(\d+):(\d+):([\d.]+)/g)].pop();
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}
async function falar(tts, texto, arq) {
  const { audioStream } = tts.toStream(texto);
  await new Promise((ok, erro) => {
    const saida = fs.createWriteStream(arq);
    audioStream.on('error', erro); saida.on('error', erro); saida.on('finish', ok);
    audioStream.pipe(saida);
  });
}
(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOZ, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const dur = {};
  let total = 0;
  for (const f of roteiro) {
    const arq = path.join(DIR, f.id + '.mp3');
    await falar(tts, f.texto, arq);
    dur[f.id] = +duracao(arq).toFixed(2);
    total += dur[f.id];
    console.log(f.id.padEnd(13), dur[f.id] + 's');
  }
  tts.close();
  fs.writeFileSync(path.join(__dirname, 'duracoes.json'), JSON.stringify(dur, null, 1));
  console.log('total falado:', total.toFixed(1) + 's');
})();
