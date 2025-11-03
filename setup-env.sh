#!/bin/bash

# LocalDevHub Environment Setup Script
echo " Setting up LocalDevHub environment..."

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cat > server/.env << EOF
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://ARNOLD47:KALUMBA47@localdevhub.wghlwdy.mongodb.net/?appName=LOCALDEVHUB

# JWT Secret
JWT_SECRET=localdevhub-super-secret-jwt-key-2024-production-ready

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload (for future use)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo " .env file created successfully!"
else
    echo "⚠️  .env file already exists, skipping creation..."
fi

echo ""
echo "Environment setup complete!"
echo ""
echo " Next steps:"
echo "1. Make sure MongoDB Atlas is accessible from your network"
echo "2. Run 'npm run dev' to start both frontend and backend"
echo "3. Visit http://localhost:3000 to access the application"
echo ""
echo "🔧 If you're still having MongoDB connection issues:"
echo "- Check your internet connection"
echo "- Verify MongoDB Atlas cluster is running"
echo "- Ensure your IP is whitelisted in MongoDB Atlas"
echo ""
