# Getting Started with LocalDevHub

Welcome to LocalDevHub! This guide will help you get the application running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/localdevhub.git
cd localdevhub
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp server/env.example server/.env

# Edit the .env file with your settings
# For local development, the default values should work
```

### 4. Start MongoDB
**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

### 5. Run the Application
```bash
# Start both frontend and backend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Detailed Setup

### Environment Configuration

Edit `server/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localdevhub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### Database Setup

The application will automatically create the necessary database collections when you first run it. No manual setup required!

### Running Individual Services

If you prefer to run services separately:

```bash
# Backend only (Terminal 1)
npm run server

# Frontend only (Terminal 2)
npm run client
```

## Testing the Setup

### 1. Check API Health
Visit http://localhost:5000/api/health - you should see:
```json
{
  "status": "OK",
  "message": "LocalDevHub API is running",
  "timestamp": "2024-01-XX..."
}
```

### 2. Test Frontend
Visit http://localhost:3000 - you should see the LocalDevHub homepage.

### 3. Create Test Account
1. Click "Sign Up" in the navigation
2. Register as either a developer or client
3. Complete your profile
4. Explore the platform!

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB Atlas whitelist (if using cloud)

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors (Windows)
Run terminal as Administrator or use:
```bash
npm install --no-optional
```

## Development Commands

```bash
# Install all dependencies
npm run install-all

# Start development server (both frontend & backend)
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build frontend for production
npm run build

# Install backend dependencies only
cd server && npm install

# Install frontend dependencies only
cd client && npm install
```

## Project Structure Overview

```
localdevhub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── utils/         # API utilities
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # API controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
└── package.json          # Root package.json
```

## Next Steps

1. **Explore the Code**: Start with `client/src/App.js` and `server/index.js`
2. **Read the Documentation**: Check `DEVELOPMENT.md` for detailed info
3. **Customize**: Modify colors, text, and features to match your needs
4. **Deploy**: Follow the deployment guide in `README.md`

## Getting Help

- **Documentation**: Check `README.md` and `DEVELOPMENT.md`
- **Issues**: Open an issue on GitHub
- **Code Comments**: Most functions have detailed comments

## Happy Coding! 🚀

You're now ready to start developing with LocalDevHub. The platform is designed to be easily customizable and extensible.

**Pro Tip**: Start by exploring the marketplace page to see how projects and developers are displayed, then dive into the dashboard to understand the user experience flow.
