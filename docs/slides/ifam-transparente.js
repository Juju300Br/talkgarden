const puppeteer = require('../../video/fonte/node_modules/puppeteer-core');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const p = await b.newPage();
  const src = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'assets', 'ifam.png')).toString('base64');
  const out = await p.evaluate(async src => {
    const img = new Image(); img.src = src; await img.decode();
    const k = 4, c = document.createElement('canvas'); c.width = img.naturalWidth * k; c.height = img.naturalHeight * k;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) { const m = Math.min(d.data[i], d.data[i + 1], d.data[i + 2]); if (m > 225) d.data[i + 3] = Math.round(255 * (255 - m) / 30); }
    g.putImageData(d, 0, 0); return c.toDataURL('image/png');
  }, src);
  fs.writeFileSync(path.join(__dirname, 'assets', 'ifam-transparente.png'), Buffer.from(out.split(',')[1], 'base64'));
  await b.close(); console.log('ok');
})();
