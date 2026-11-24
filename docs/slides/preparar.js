// Prepara as imagens dos slides: recorta o fundo branco das logos e tira uma foto da tela inicial só com os jogos do PI
const puppeteer = require('../../video/fonte/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const A = path.join(__dirname, 'assets');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  fs.mkdirSync(path.join(A, 'logos'), { recursive: true });
  for (const f of fs.readdirSync(path.join(A, 'logos-orig'))) {
    const src = 'data:image/' + (f.endsWith('png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(path.join(A, 'logos-orig', f)).toString('base64');
    const png = await p.evaluate(async (src) => {
      const img = new Image(); img.src = src; await img.decode();
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const fundo = d[i + 3] < 20 || (d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238);
        if (!fundo) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      // deixa o fundo branco transparente para ficar bonito sobre o lilás
      const o = document.createElement('canvas'); o.width = w; o.height = h;
      const og = o.getContext('2d'); og.drawImage(c, x0, y0, w, h, 0, 0, w, h);
      const od = og.getImageData(0, 0, w, h);
      for (let i = 0; i < od.data.length; i += 4) {
        const m = Math.min(od.data[i], od.data[i + 1], od.data[i + 2]);
        if (m > 238) od.data[i + 3] = Math.round(255 * (255 - m) / 17);
      }
      og.putImageData(od, 0, 0);
      return o.toDataURL('image/png');
    }, src);
    fs.writeFileSync(path.join(A, 'logos', f.replace(/\.\w+$/, '.png')), Buffer.from(png.split(',')[1], 'base64'));
  }

  // tela inicial do sistema só com os dois jogos do PI
  await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1.2 });
  await p.goto('file:///' + path.resolve(__dirname, '..', '..', 'index.html').replace(/\\/g, '/'));
  await p.evaluate(() => { const s = document.createElement('style'); s.textContent = '.game-card.cmd,.game-card.story{display:none!important}'; document.head.appendChild(s); });
  await p.type('#loginEmail', 'demo@talkgarden.com'); await p.type('#loginPass', '123456');
  await p.click('#formLogin button[type="submit"]');
  await p.waitForSelector('#view-home.active', { visible: true });
  await new Promise(r => setTimeout(r, 900));
  await p.screenshot({ path: path.join(A, 'tela-inicio-pi.png') });
  await b.close();
  console.log('ok', fs.readdirSync(path.join(A, 'logos')).join(' '));
})();
