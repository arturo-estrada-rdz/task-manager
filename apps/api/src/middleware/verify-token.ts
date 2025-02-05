import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils';

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader)
    return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.split(/\s/g)[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = (decoded as { id: string }).id;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
