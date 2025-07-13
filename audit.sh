#!/usr/bin/env bash
set -e

# 1. Récupère tous les imports
grep -RhoE "from ['\"][^'\"]+['\"]" src/app \
  | sed -E "s/from ['\"]([^'\"]+)['\"]/\\1/" \
  | sort -u > audit_imports.txt

# 2. Teste leur existence
> audit_missing.txt
while read -r path; do
  fs=\${path//@\//src/}
  exists=false
  for ext in .tsx .ts ''; do
    if [[ -e "\$fs\$ext" ]] || [[ -d "\$fs\$ext" ]]; then
      exists=true
      break
    fi
  done
  if [[ "\$exists" == "false" ]]; then
    echo "Manquant: \$path" >> audit_missing.txt
  fi
done < audit_imports.txt

# 3. Affiche les résultats
echo "=== Imports manquants ==="
cat audit_missing.txt

# 4. Nettoyage
rm audit_imports.txt audit_missing.txt
