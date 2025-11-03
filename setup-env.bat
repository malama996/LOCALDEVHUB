@echo off
echo  Setting up LocalDevHub environment...

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo  Creating .env file...
    (
        echo # Environment Configuration
        echo NODE_ENV=development
        echo PORT=5000
        echo.
        echo # Database - MongoDB Atlas
        echo MONGODB_URI=mongodb+srv://ARNOLD47:KALUMBA47@localdevhub.wghlwdy.mongodb.net/?appName=LOCALDEVHUB
        echo.
        echo # JWT Secret
        echo JWT_SECRET=localdevhub-super-secret-jwt-key-2024-production-ready
        echo.
        echo # Frontend URL (for CORS)
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Email Configuration (for future use)
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
        echo.
        echo # File Upload (for future use)
        echo UPLOAD_PATH=./uploads
        echo MAX_FILE_SIZE=5242880
        echo.
        echo # Rate Limiting
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
    ) > server\.env
    echo  .env file created successfully!
) else (
    echo    .env file already exists, skipping creation...
)

echo.
echo  Environment setup complete!
echo.
echo  Next steps:
echo 1. Make sure MongoDB Atlas is accessible from your network
echo 2. Run 'npm run dev' to start both frontend and backend
echo 3. Visit http://localhost:3000 to access the application
echo.
echo  If you're still having MongoDB connection issues:
echo - Check your internet connection
echo - Verify MongoDB Atlas cluster is running
echo - Ensure your IP is whitelisted in MongoDB Atlas
echo.
pause
