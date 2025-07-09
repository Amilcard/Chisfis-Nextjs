const jwt = require('jsonwebtoken');
require('dotenv').config();

try {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET manquant');
  }
  const token = jwt.sign({userId: 'test'}, process.env.JWT_SECRET, {expiresIn: '1h'});
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Test JWT réussi:', decoded.userId === 'test');
  console.log('✅ JWT_SECRET configuré correctement');
} catch(e) {
  console.log('❌ Test JWT échoué:', e.message);
}
