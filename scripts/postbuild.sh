#!/usr/bin/env bash
set -euo pipefail

# Next.js static export writes HTML with a fixed `<html lang="en">` because the app uses
# language prefixes ("/fr/", "/es/", "/de/") instead of a `[lang]` route segment.
# This postbuild step patches the generated HTML so crawlers and assistive tech see
# the correct `lang` without relying on client-side JS.

OUT_DIR="out"

if [[ ! -d "$OUT_DIR" ]]; then
  echo "postbuild: '$OUT_DIR/' not found (nothing to patch)" >&2
  exit 0
fi

patch_file_lang() {
  local file="$1"
  local lang="en"

  case "$file" in
    out/fr/*|*/out/fr/*) lang="fr" ;;
    out/es/*|*/out/es/*) lang="es" ;;
    out/de/*|*/out/de/*) lang="de" ;;
  esac

  # Replace the value of the first `<html ... lang="...">` occurrence.
  perl -pi -e 's/(<html\b[^>]*\blang=")[^"]*(")/$1'"$lang"'$2/' "$file"
}

export -f patch_file_lang

while IFS= read -r -d '' file; do
  patch_file_lang "$file"
done < <(find "$OUT_DIR" -type f -name '*.html' -print0)

echo "postbuild: patched <html lang> in exported HTML"
