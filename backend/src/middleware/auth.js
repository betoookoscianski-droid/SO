/**
 * Middleware de Autenticação
 * Valida JWT token em cada requisição
 */

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token inválido ou expirado',
      details: error.message
    });
  }
};

export default authMiddleware;
