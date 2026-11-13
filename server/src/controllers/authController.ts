import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dropyhub_super_secret_jwt_key_2026_master_dropy_admin_platform_auth';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Static master credentials fallback for bootstrap resilience
const MASTER_EMAIL = 'master@dropyhub.com';
const MASTER_PASSWORD_HASH = '$2a$12$.js/Qj/5.GEO6KAEs0InBOEipTbxDEPfgSYFHASHdL/LD3tj8HIYe'; // masteR&26

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Attempt lookup in Supabase admin_users table
    let adminRecord: any = null;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        adminRecord = data;
      }
    } catch (dbErr) {
      console.warn('⚠️ Supabase admin lookup warning, checking bootstrap credentials:', dbErr);
    }

    // 2. If not found in DB or DB not yet migrated, check bootstrap master credentials
    if (!adminRecord && cleanEmail === MASTER_EMAIL) {
      const isMatch = await bcrypt.compare(password, MASTER_PASSWORD_HASH);
      if (isMatch) {
        adminRecord = {
          id: '00000000-0000-0000-0000-000000000001',
          email: MASTER_EMAIL,
          full_name: 'Master Administrator',
          role: 'SUPER_ADMIN',
          is_active: true,
        };
      }
    } else if (adminRecord) {
      const isMatch = await bcrypt.compare(password, adminRecord.password_hash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.',
        });
        return;
      }
    }

    if (!adminRecord) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or account is inactive.',
      });
      return;
    }

    // 3. Generate signed JWT token
    const token = jwt.sign(
      {
        id: adminRecord.id,
        email: adminRecord.email,
        full_name: adminRecord.full_name,
        role: adminRecord.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // 5. Update last_login_at in background
    if (adminRecord.id !== '00000000-0000-0000-0000-000000000001') {
      supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminRecord.id)
        .then();
    }

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: adminRecord.id,
        email: adminRecord.email,
        fullName: adminRecord.full_name,
        role: adminRecord.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

export const getCurrentAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const logoutAdmin = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};
