# LocalDevHub

A full-stack platform connecting local developers with NGOs and SMEs for meaningful software projects.

## 🚀 Features

- **Developer Profiles**: Showcase skills, experience, and portfolio
- **Project Listings**: Post and browse software development opportunities
- **Smart Matching**: Connect developers with relevant projects
- **Messaging System**: Direct communication between developers and clients
- **Dashboard**: Track projects, applications, and earnings
- **Real-time Updates**: Stay informed about project status and messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with responsive design
- **Font Awesome** - Icons and UI elements

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📁 Project Structure

```
localdevhub/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── utils/         # Utility functions and API calls
│   │   └── App.js         # Main application component
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middleware/        # Custom middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── .github/
│   └── workflows/        # GitHub Actions
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/localdevhub.git
   cd localdevhub
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localdevhub
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Database Setup

The application will automatically create the necessary collections when you first run it. No manual database setup is required.

## 📱 Usage

### For Developers
1. **Register** as a developer
2. **Complete your profile** with skills, experience, and portfolio
3. **Browse projects** in the marketplace
4. **Apply to projects** that match your skills
5. **Communicate** with clients through the messaging system
6. **Track progress** in your dashboard

### For Clients (NGOs/SMEs)
1. **Register** as a client
2. **Submit project requests** with detailed requirements
3. **Review applications** from developers
4. **Select developers** for your projects
5. **Manage projects** and track progress
6. **Communicate** with developers

## 🚀 Deployment

### Frontend (GitHub Pages)
The frontend is automatically deployed to GitHub Pages when you push to the main branch.

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to "GitHub Actions"
3. **Push to main branch** to trigger deployment

### Backend (Free Hosting Options)

#### Option 1: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables in Render dashboard

#### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Create a new project
3. Set root directory to `server`
4. Add environment variables in Railway dashboard

#### Option 3: Cyclic
1. Connect your GitHub repository to Cyclic
2. Set root directory to `server`
3. Add environment variables in Cyclic dashboard

### Database (MongoDB Atlas)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your deployment environment

## 💰 Monetization Strategy

### Freemium Model
- **Free**: Basic project listings and developer profiles
- **Premium**: Priority placement, advanced analytics, unlimited messaging

### Commission Model
- **Small fee** (2-5%) on successful project completions
- **Payment processing** through integrated payment gateways

### Advertising
- **Featured listings** for premium clients
- **Sponsored developer profiles**
- **Local tech company partnerships**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Open an issue on GitHub
- **Email**: contact@localdevhub.com

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic user authentication
- [x] Project and developer listings
- [x] Simple messaging system
- [x] Dashboard functionality

### Phase 2 (Next)
- [ ] Payment integration
- [ ] File upload system
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] AI-powered matching
- [ ] Video calling integration
- [ ] Project management tools
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- MongoDB for the flexible database solution
- All contributors and users of LocalDevHub

---

**Made with ❤️ for the developer community**
