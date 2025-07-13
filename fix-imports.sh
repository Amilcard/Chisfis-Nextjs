#!/usr/bin/env bash
set -e

# 1. Recréation du next.config.js côté frontend
cd frontend
rm -f next.config.js next.config.mjs
cat > next.config.js << 'CONF'
const path = require('path');
module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  }
};
CONF
cd ..

# 2. Copier les fichiers manquants en top-level src/
mkdir -p src/shared src/lib src/hooks
cp frontend/src/shared/{divider,fieldset,Input,Select,SwitchDarkMode2}.tsx src/shared/
cp frontend/src/lib/children-service.ts src/lib/
cp frontend/src/hooks/useRandomActivity.ts src/hooks/

# 3. Mettre à jour tous les imports dans src/app
find src/app -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 \
| xargs -0 sed -i '' -E \
  -e "s|from 'frontend/src/components/([^']*)'|from '@/components/\\1'|g" \
  -e "s|from 'frontend/src/services/([^']*)'|from '@/services/\\1'|g" \
  -e "s|from 'frontend/src/shared/([^']*)'|from '@/shared/\\1'|g" \
  -e "s|from 'frontend/src/lib/([^']*)'|from '@/lib/\\1'|g" \
  -e "s|from 'frontend/src/hooks/([^']*)'|from '@/hooks/\\1'|g"

# 4. Réinstaller et relancer le front
npm install
npm run dev --prefix frontend
