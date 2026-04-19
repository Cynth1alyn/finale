import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserPayload {
  user_id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ success: false, error: 'Token is invalid or expired' });
      }

      req.user = user as UserPayload;
      next();
    });
  } else {
    res.status(401).json({ success: false, error: 'Authorization token required' });
  }
};
