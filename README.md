
# 🎯 Advanced Chess Application

A modern, feature-rich chess application built with React, TypeScript, and advanced AI capabilities. Play against intelligent AI opponents, get strategic hints, and improve your chess skills with multiple game modes.

![Chess App Screenshot](https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=800&h=400&fit=crop)

## ✨ Features

### 🎮 **Core Gameplay**
- **Full Chess Implementation**: Complete rule set including castling, en passant, and pawn promotion
- **Multiple Game Modes**: 
  - Classic (10 minutes per side)
  - Speed Chess (3 minutes + 2 second increment)
  - Math Master (solve problems before moves)
- **AI Opponents**: Three difficulty levels (Easy, Medium, Hard)
- **Human vs Human**: Local multiplayer support

### 🧠 **Advanced AI System**
- **Dual Engine Architecture**: 
  - JavaScript AI engine (always available)
  - Python Stockfish integration (development mode)
- **Intelligent Hints**: Get strategic advice and best move suggestions
- **Position Analysis**: Evaluation, threats, and opportunities
- **Adaptive Difficulty**: AI adjusts to provide optimal challenge

### 🎨 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Themes**: Automatic theme switching
- **Multi-language Support**: English and Spanish
- **Interactive Board**: Smooth animations and visual feedback
- **Move History**: Complete game notation and replay
- **Game Statistics**: Track your progress and improvement

### 🔧 **Technical Features**
- **Real-time Updates**: Instant move validation and board updates
- **Error Recovery**: Robust error handling and graceful fallbacks
- **Performance Optimized**: Fast rendering and minimal re-renders
- **Accessible**: Screen reader support and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd chess-app

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:8080`

### Optional: Python AI Engine (Development)

For enhanced AI capabilities, you can run the Python chess engine:

```bash
# Navigate to the Python engine directory
cd python_engine

# Install Python dependencies
pip install -r requirements.txt

# Start the engine
python app.py
```

## 📖 How to Play

### Getting Started
1. **Choose Game Mode**: Select Classic, Speed, or Math Master from the main menu
2. **Select Difficulty**: Pick Easy (learning), Medium (intermediate), or Hard (challenging)
3. **Start Playing**: Click on pieces to select them, then click destination squares to move

### Game Controls
- **New Game**: Reset the board for a fresh start
- **Hint System**: Get AI-powered strategic advice (limited uses)
- **Resign**: Concede the current game
- **Move History**: Review all moves played

### Hint System
- **Easy Mode**: Unlimited hints for learning
- **Medium Mode**: 5 hints per game
- **Hard Mode**: 3 hints per game
- **Speed Mode**: 1 hint per game

Each hint provides:
- Suggested best move
- Position evaluation
- Strategic advice
- Threat and opportunity analysis

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling and hot reload
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components

### State Management
- **React Context**: Global app state (language, difficulty, game mode)
- **Custom Hooks**: Modular game logic
- **React Query**: Server state and caching

### AI Integration
- **JavaScript Engine**: Pure JS implementation with minimax algorithm
- **Python Engine**: Stockfish integration for advanced analysis
- **Fallback System**: Graceful degradation when Python engine unavailable

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ChessBoard.tsx  # Main game board
│   ├── GameStatus.tsx  # Game state display
│   └── HintDisplay.tsx # AI hint visualization
├── contexts/           # React contexts for global state
├── features/chess/     # Chess game logic
│   ├── types.ts       # TypeScript definitions
│   ├── utils/         # Game utilities
│   └── constants.ts   # Game constants
├── hooks/             # Custom React hooks
├── pages/             # Application pages
├── services/          # External service integrations
└── utils/             # General utilities
```

## 🚢 Deployment

### Vercel (Recommended)

The application is optimized for Vercel deployment:

```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel
```

### Configuration
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

### Environment Variables
- `VITE_SENTRY_DSN`: Optional Sentry error tracking

## 🧪 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm test`: Run test suite

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Performance Monitoring
```bash
# Run Lighthouse audit
npm run lighthouse

# Security scan with Snyk
npm run snyk:test
```

## 🔒 Security

- Regular dependency updates via Dependabot
- Security scanning with Snyk
- CSP headers for XSS protection
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Use semantic commit messages
- Update documentation for API changes

## 📊 Performance

- **Bundle Size**: ~800KB gzipped
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2.5s
- **Lighthouse Score**: 95+ across all metrics

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**AI Not Working**
- Check console for errors
- Verify Python engine is running (development only)
- Ensure network connectivity

**Performance Issues**
- Check browser console for errors
- Disable browser extensions
- Clear browser cache

### Getting Help
- Check the [Issues](../../issues) page for known problems
- Create a new issue with detailed error information
- Include browser version and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chess piece designs inspired by classic Staunton sets
- AI algorithms based on modern chess engine techniques
- Icons provided by [Lucide React](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ using modern web technologies**
