import { Router } from 'express';
import {
  getPartners,
  getPartnerById,
  getDashboardStats,
  exportPartnersCSV,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Protect all admin endpoints with auth middleware
router.use(authMiddleware);

// Data retrieval & Filtering
router.get('/partners', getPartners);
router.get('/partners/:id', getPartnerById);
router.get('/stats', getDashboardStats);
router.get('/export', exportPartnersCSV);

export default router;
