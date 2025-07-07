# 🚀 Kryptos - Unihack Project

A cutting-edge blockchain-enabled web application built with React and cryptographic tools for the Unihack competition. This project leverages modern web technologies with crypto capabilities and Cardano integration through MeshSDK.

## ✨ Features

- 🔐 **Cryptographic Operations** - Built-in crypto functionality with browser-compatible polyfills
- 🌐 **Cardano Integration** - MeshSDK integration for blockchain interactions
- 🎨 **Modern UI** - Tailwind CSS for responsive, beautiful design
- ⚡ **Fast Development** - CRACO configuration for optimized build process
- 🧪 **Comprehensive Testing** - Full testing suite with React Testing Library
- 📱 **Responsive Design** - Mobile-first approach with modern CSS

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd unihack-project

# Install dependencies
npm install

# Install crypto polyfills (if needed)
npm install crypto-browserify stream-browserify buffer process
```

### Development
```bash
# Start development server with CRACO
npm start
```
Opens the app at [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
# Create optimized production build
npm run build

# Serve the build locally (optional)
npx serve -s build
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with CRACO |
| `npm test` | Run tests in watch mode with Jest |
| `npm run build` | Build optimized production bundle |
| `npm run eject` | ⚠️ Eject from CRA (irreversible - not recommended) |

## 🏗️ Project Structure
```
unihack-project/
├── 📁 public/                 # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── 📁 src/                    # Source code
│   ├── App.js                 # Main App component
│   ├── App.css               # App styles
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles
│   └── setupTests.js         # Test configuration
├── 📁 config/                 # Build configuration
│   └── craco.config.js       # CRACO configuration
├── package.json              # Dependencies & scripts
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── README.md                 # Project documentation
```

## 🧪 Testing
```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests once (CI mode)
npm test -- --watchAll=false
```

## 🔧 Configuration

### CRACO Configuration
This project uses CRACO (Create React App Configuration Override) to customize the webpack configuration for crypto polyfills:

- **Crypto Polyfills**: Browser-compatible versions of Node.js crypto modules
- **Stream & Buffer Support**: For handling data streams and buffers in the browser
- **Process Polyfill**: Node.js process object for browser compatibility

### Tailwind CSS
Utility-first CSS framework configuration in `tailwind.config.js` for rapid UI development.

## 📦 Deployment

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `build/` folder.

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy build folder to Netlify
```

## 📚 Tech Stack

### Core Technologies
- **React 19.1.0** - Modern React with latest features
- **CRACO 7.1.0** - Create React App Configuration Override
- **Tailwind CSS 3.4.0** - Utility-first CSS framework

### Blockchain & Crypto
- **@meshsdk/react** - Cardano blockchain SDK for React
- **crypto-js** - JavaScript cryptography library
- **crypto-browserify** - Browser-compatible crypto module

### Development Tools
- **Axios** - HTTP client for API requests
- **PostCSS** - CSS post-processor
- **Autoprefixer** - CSS vendor prefixing
- **React Testing Library** - Testing utilities for React

### Browser Polyfills
- **buffer** - Buffer polyfill for browsers
- **stream-browserify** - Stream module for browsers
- **process** - Process object polyfill
- **https-browserify** - HTTPS module for browsers

## 🔍 Key Features

### Cryptographic Capabilities
- Browser-compatible cryptographic operations
- Secure data handling and encryption
- Integration with Cardano blockchain

### Modern Development Experience
- Hot reload development server
- Comprehensive testing suite
- Optimized production builds
- Modern JavaScript features

## 🐛 Troubleshooting

### Common Issues

**Module not found errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Crypto polyfill issues:**
- Check `craco.config.js` for proper webpack fallbacks
- Ensure all crypto dependencies are installed

**Build errors:**
```bash
# Clear build cache
npm start -- --reset-cache
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

### Development Guidelines
- Keep components small and focused
- Use Tailwind CSS for styling
- Follow React best practices
- Document complex crypto operations

## 📄 License

This project is part of the Unihack competition. Please refer to the competition guidelines for usage rights and restrictions.

## 🙏 Acknowledgments

- **Unihack** - For hosting the competition
- **MeshSDK** - For Cardano blockchain integration
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS approach

---

**Built with ❤️ for Unihack 2025**
