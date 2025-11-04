const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Permanent CORS Solution
const allowedOrigins = [
  'https://localdevhub-4.onrender.com',
  'http://localhost:3000',
  'https://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Handle preflight requests properly
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LocalDevHub API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      users: '/api/users',
      messages: '/api/messages',
      dashboard: '/api/dashboard'
    },
    documentation: 'Check /api/health for detailed status'
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/localdevhub';

const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
};

const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  try {
    console.log(`🔌 Connecting to MongoDB (attempt ${retryCount + 1})`);
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error(`❌ MongoDB error (attempt ${retryCount + 1}): ${err.message}`);
    if (retryCount < maxRetries) {
      const delayMs = Math.pow(2, retryCount) * 1000;
      console.log(`⏳ Retrying in ${Math.round(delayMs / 1000)}s...`);
      setTimeout(() => connectDB(retryCount + 1), delayMs);
    } else {
      console.warn('⚠️  Continuing without DB (server remains up, will keep retrying in background)');
      setTimeout(() => connectDB(0), 10000);
    }
  }
};

// Start DB connection (non-blocking)
connectDB();

mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('connected', () => console.log('MongoDB connected'));

// ✅ FIXED ROUTE PATHS - Remove 'server/' prefix since index.js is already in server directory
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: dbStatus === 1 ? 'OK' : 'Degraded',
    message: 'LocalDevHub API is running',
    timestamp: new Date().toISOString(),
    database: { status: dbStates[dbStatus], readyState: dbStatus },
    services: {
      resend: !!process.env.RESEND_API_KEY,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
    },
    version: '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Allowed Frontends: ${allowedOrigins.join(', ')}`);
});

module.exports = app;