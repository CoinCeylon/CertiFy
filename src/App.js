import React from 'react';
import { MeshProvider, useWallet } from '@meshsdk/react';
import SimpleIssueCertificate from './components/SimpleIssueCertificate';
import SimpleVerifyCertificate from './components/SimpleVerifyCertificate';
import StatusDisplay from './components/StatusDisplay';
import CustomWalletConnect from './components/CustomWalletConnect';
import ConfigurationPanel from './components/ConfigurationPanel';
import Home from './components/Home';
import Tutorial from './components/Tutorial';
import MainMenu from './components/MainMenu';
import IssueCertificatePage from './components/IssueCertificatePage';
import VerifyCertificatePage from './components/VerifyCertificatePage';

// Suppress React DOM warnings for SVG attributes from MeshSDK
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Invalid DOM property') ||
       args[0].includes('stroke-width') ||
       args[0].includes('stroke-linecap') ||
       args[0].includes('stroke-linejoin'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

function WalletStatus({ status }) {
  const { connected, wallet } = useWallet();

  const handleConnect = React.useCallback(async () => {
    console.log('handleConnect called.');
    try {
      if (wallet) {
        console.log('Wallet object before getChangeAddress:', wallet);
        const address = await wallet.getChangeAddress();
        console.log('Wallet address:', address);
        console.log('Wallet object after getChangeAddress:', wallet);
      } else {
        console.log('Wallet object is null or undefined.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }, [wallet]);

  React.useEffect(() => {
    if (connected) {
      handleConnect();
    }
  }, [connected, handleConnect]);

  React.useEffect(() => {
    // Check if Cardano is available in window
    console.log('Window.cardano:', window.cardano);
    if (window.cardano) {
      console.log('Available wallets:', Object.keys(window.cardano));
      if (window.cardano.lace) {
        console.log('Lace wallet found:', window.cardano.lace);
      }
    }
  }, []);

  return (
    <div className="mb-4">
      <p className={`text-sm ${status.connected ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
        Wallet Status: {status.connected ? '✅ Connected' : '❌ Not Connected'}
      </p>
      {status.connected && status.walletName && (
        <p className="text-xs text-gray-500 mt-1">
          Using: {status.walletName} Wallet
        </p>
      )}
      {status.error && (
        <p className="text-xs text-red-500 mt-1">
          Error: {status.error.message || status.error}
        </p>
      )}
    </div>
  );
}

function App() {
  console.log("App component rendering...");
  const [currentView, setCurrentView] = React.useState('home'); // 'home', 'tutorial', 'menu', 'issue', 'verify', 'app'
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [transitionDirection, setTransitionDirection] = React.useState('forward'); // 'forward' or 'backward'
  const [tutorialCompleted, setTutorialCompleted] = React.useState(
    localStorage.getItem('tutorial_completed') === 'true'
  );
  const [connectionStatus, setConnectionStatus] = React.useState({
    connected: false,
    error: null,
    walletName: null,
  });

  // State for status messages
  const [statusMessages, setStatusMessages] = React.useState([]);
  
  // State for configuration
  const [appConfig, setAppConfig] = React.useState({
    blockfrostApiKey: '',
    network: 'preprod',
    isValid: false
  });

  // Function to add status messages
  const addStatusMessage = (message, type = 'info', details = null) => {
    const newMessage = {
      id: Date.now(),
      message,
      type,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setStatusMessages(prev => [newMessage, ...prev.slice(0, 19)]); // Keep only last 20 messages
  };

  // Clear status messages
  const clearStatusMessages = () => {
    setStatusMessages([]);
  };

  // Handle configuration updates
  const handleConfigUpdate = (config, isValid) => {
    setAppConfig({
        ...config,
      isValid
    });

    // Update blockchain service configuration
    if (window.blockchainServiceConfig) {
      window.blockchainServiceConfig = config;
    } else {
      window.blockchainServiceConfig = config;
    }
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (tutorialCompleted) {
      // User has seen tutorial before, go directly to menu
      transitionToView('menu', 'forward');
    } else {
      // First time user, show tutorial
      transitionToView('tutorial', 'forward');
    }
  };

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setTutorialCompleted(true);
    localStorage.setItem('tutorial_completed', 'true');
    transitionToView('menu', 'forward');
  };

  // Smooth transition function
  const transitionToView = (newView, direction = 'forward') => {
    if (isTransitioning || currentView === newView) return;
    
    setIsTransitioning(true);
    setTransitionDirection(direction);
    
    // Fade out current view (300ms)
    setTimeout(() => {
      setCurrentView(newView);
      
      // Fade in new view (300ms)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure DOM update
    }, 300);
  };

  // Clean up demo data on app startup
  React.useEffect(() => {
    // Import and use the cleanup function
    import('./services/blockchainService').then(module => {
      const blockchainService = module.default;
      blockchainService.cleanupDemoData();
    });
  }, []);

  return (
    <MeshProvider network={appConfig.network || "preprod"}>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary-light">
        {/* Home View */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'home' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <Home 
              onGetStarted={handleGetStarted}
              onTutorial={() => transitionToView('tutorial', 'forward')}
            />
          </div>
        </div>
        
        {/* Tutorial View */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'tutorial' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <Tutorial 
              onComplete={handleTutorialComplete} 
              onHome={() => transitionToView('home', 'backward')}
            />
          </div>
        </div>
        
        {/* Main Menu View */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'menu' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <MainMenu 
              onSelectOption={(option) => {
                if (option === 'issue') {
                  transitionToView('issue', 'forward');
                } else if (option === 'verify') {
                  transitionToView('verify', 'forward');
                }
              }}
              onHome={() => transitionToView('home', 'backward')}
            />
          </div>
        </div>
        
        {/* Issue Certificate Page */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'issue' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <IssueCertificatePage 
              onBack={() => transitionToView('menu', 'backward')}
              onHome={() => transitionToView('home', 'backward')}
            />
          </div>
        </div>
        
        {/* Verify Certificate Page */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'verify' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <VerifyCertificatePage 
              onBack={() => transitionToView('menu', 'backward')}
              onHome={() => transitionToView('home', 'backward')}
            />
          </div>
        </div>
        
        {/* App View (Full Dashboard) */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out ${
          currentView === 'app' && !isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="w-full h-full overflow-y-auto">
            <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => transitionToView('menu', 'backward')}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Menu
                    </button>
                    <button
                      onClick={() => transitionToView('home', 'backward')}
                      className="flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="https://i.postimg.cc/CL1bSS6P/Certi-Fy-logo-white.png" 
                        alt="CertiFy Logo" 
                        className="h-12 w-auto object-contain"
                      />
                    </button>
                  </div>
                <div className="flex flex-col items-end gap-2">
                  <WalletStatus status={connectionStatus} />
                  <div className="flex gap-2 items-center">
                    <CustomWalletConnect 
                      onConnected={(walletInfo) => {
                        console.log('Custom wallet connected:', walletInfo);
                        setConnectionStatus({ 
                          connected: true, 
                          error: null, 
                          walletName: walletInfo.name,
                          walletApi: walletInfo.api,
                          address: walletInfo.address,
                          networkId: walletInfo.networkId
                        });
                        addStatusMessage(`Wallet connected: ${walletInfo.name} (${walletInfo.networkId === 0 ? 'Testnet' : 'Mainnet'})`, 'success');
                      }}
                      onDisconnected={() => {
                        console.log('Wallet disconnected!');
                        setConnectionStatus({ connected: false, error: null, walletName: null });
                        addStatusMessage('Wallet disconnected', 'info');
                      }}
                      onError={(error) => {
                        console.error('Wallet connection error:', error);
                        setConnectionStatus({ connected: false, error: error, walletName: null });
                        addStatusMessage(`Connection failed: ${error.message}`, 'error');
                      }}
                    />
                    {statusMessages.length > 0 && (
                      <button
                        onClick={clearStatusMessages}
                        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        Clear Log
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Configuration Panel */}
              <div className="mb-6">
                <ConfigurationPanel onConfigUpdate={handleConfigUpdate} />
              </div>
              
              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Issue Certificate Section */}
                <SimpleIssueCertificate 
                  onStatusUpdate={addStatusMessage} 
                  walletApi={connectionStatus.walletApi}
                  config={appConfig}
                />
                
                {/* Verify Certificate Section */}
                <SimpleVerifyCertificate 
                  onStatusUpdate={addStatusMessage}
                  walletAddress={connectionStatus.address}
                  walletApi={connectionStatus.walletApi}
                  config={appConfig}
                />
              </div>
              
              {/* Status Display Section */}
              <StatusDisplay messages={statusMessages} />
              
              {/* Information Panel */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Issue Certificate:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Configure your Blockfrost API key</li>
                      <li>Upload your PDF certificate file</li>
                      <li>Connect your Cardano wallet</li>
                      <li>Click "Issue" to store the file hash on blockchain</li>
                      <li>Transaction creates permanent proof of authenticity</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Verify Certificate:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Configure your Blockfrost API key</li>
                      <li>Upload the certificate you want to verify</li>
                      <li>Connect your wallet to access blockchain</li>
                      <li>Click "Verify" to check against stored hashes</li>
                      <li>Get instant verification results from blockchain</li>
                    </ol>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> This app uses Cardano's testnet for demonstration. 
                    Make sure your wallet is set to "Preview" or "Pre-production" testnet mode and has test ADA.
                  </p>
                </div>
                
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-green-800">
                    <strong>Real Blockchain:</strong> This app creates real Cardano blockchain transactions. 
                    Configure your Blockfrost API key in the settings to enable transaction submission and verification.
                  </p>
                </div>
                
                <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-xs text-purple-800">
                    <strong>Setup Required:</strong> Get your free Blockfrost API key at{' '}
                    <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="underline">
                      blockfrost.io
                    </a>{' '}
                    and enter it in the configuration panel above.
                  </p>
                </div>
              </div>
            </div>
          </main>
            </div>
          </div>
        </div>
      </div>
    </MeshProvider>
  );
}

export default App;