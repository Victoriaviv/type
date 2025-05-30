import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Request } from 'express';


export interface AuthRequest extends Request {
  user: User;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log("authHeader",authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  console.log("decoded",decoded)
  try {
   
    (req as any).user = { id: decoded.id } as User;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};
