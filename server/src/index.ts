import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json());

// CORS configuration supporting DropyHub Website, Partners Admin Client, and Vercel Previews
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl / same-origin (no origin) or any requested origin (reflect)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Healthcheck routes
app.get('/', (_req, res) => {
  res.json({
    name: 'DropyHub Partner Platform API',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API v1 route mounts
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
  🚀 DropyHub Partner API Server running!
  📡 Port: http://localhost:${PORT}
  🔒 Admin Auth: http://localhost:${PORT}/api/v1/auth/login
  📥 Public Intake: http://localhost:${PORT}/api/v1/public/apply
  📊 Admin Portal API: http://localhost:${PORT}/api/v1/admin/partners
    `);
  });
}

export default app;

