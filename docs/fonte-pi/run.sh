set -e
P="$(cd "$(dirname "$0")" && pwd)"; cd "$P"
SO="/c/Program Files/LibreOffice/program/soffice.exe"
for pass in 1 2 3; do
  node build-pi.js "$(cygpath -m "$P/out/PI.docx")" >/dev/null
  "$SO" --headless --convert-to pdf --outdir "$(cygpath -m "$P/out")" "$(cygpath -m "$P/out/PI.docx")" >/dev/null 2>&1
  pdftotext -enc UTF-8 -layout "out/PI.pdf" out/PI.txt
  cp pages.json pages.prev 2>/dev/null || echo '{}' > pages.prev
  node pages.js out/PI.txt pages.json
  if cmp -s pages.json pages.prev; then echo "stable at pass $pass"; break; fi
done
