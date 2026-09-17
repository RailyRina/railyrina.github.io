#!/usr/bin/env bash
# Prints the résumé sources to PDF with headless Chrome. Usage: bash cv-src/build.sh
cd "$(dirname "$0")/.."
CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe"
for lang in ru en; do
  [ -f "cv-src/cv-$lang.html" ] || continue
  out="assets/cv/Rina_Abdrakhmanova_Product_Designer_${lang^^}.pdf"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$(cygpath -w "$PWD/$out")" "file:///$(cygpath -m "$PWD/cv-src/cv-$lang.html")" >/dev/null 2>&1
  echo "$out  $(du -k "$out" | cut -f1)KB"
done
