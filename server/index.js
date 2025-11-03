const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (uses provided Atlas user by default, with ENV override)
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

// Routes
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
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;