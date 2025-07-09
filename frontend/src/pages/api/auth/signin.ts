import { NextApiRequest, NextApiResponse } from 'next';

// Base de données utilisateurs simulée (remplacer par une vraie DB en production)
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'demo123', // En production, utiliser un hash
    firstName: 'Demo',
    lastName: 'User',
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'POST') {
    const { email, password, action } = req.body;

    if (action === 'signin') {
      // Connexion
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // En production, créer un JWT ou une session sécurisée
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json({
          success: true,
          user: userWithoutPassword,
          message: 'Connexion réussie'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
    } else {
      res.status(400).json({ success: false, message: 'Action non supportée' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
