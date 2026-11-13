import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AdminPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dropyhub_super_secret_jwt_key_2026_master_dropy_admin_platform_auth';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please sign in again.',
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'.`,
      });
      return;
    }

    next();
  };
};
