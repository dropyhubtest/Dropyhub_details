import { Router } from 'express';
import { submitApplication } from '../controllers/publicController.js';

const router = Router();

// Inbound application intake endpoint (consumed by dropyhub-website)
router.post('/apply', submitApplication);
router.post('/applications', submitApplication);

export default router;
