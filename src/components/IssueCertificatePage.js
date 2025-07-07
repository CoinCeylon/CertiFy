import React from 'react';
import { MeshProvider, useWallet } from '@meshsdk/react';
import SimpleIssueCertificate from './SimpleIssueCertificate';
import StatusDisplay from './StatusDisplay';
import CustomWalletConnect from './CustomWalletConnect';
import ConfigurationPanel from './ConfigurationPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faKey, faLink, faWallet } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="mb-4">
      <p className={`text-sm ${status.connected ? 'text-green-200 font-medium' : 'text-blue-200'}`}>
        Wallet Status: {status.connected ? '✅ Connected' : '❌ Not Connected'}
      </p>
      {status.connected && status.walletName && (
        <p className="text-xs text-blue-100 mt-1">
          Using: {status.walletName} Wallet
        </p>
      )}
      {status.error && (
        <p className="text-xs text-red-200 mt-1">
          Error: {status.error.message || status.error}
        </p>
      )}
    </div>
  );
}

const IssueCertificatePage = ({ onBack, onHome }) => {
  const [connectionStatus, setConnectionStatus] = React.useState({
    connected: false,
    error: null,
    walletName: null,
  });

  const [statusMessages, setStatusMessages] = React.useState([]);
  
  const [appConfig, setAppConfig] = React.useState({
    blockfrostApiKey: '',
    network: 'preprod',
    isValid: false
  });

  const addStatusMessage = (message, type = 'info', details = null) => {
    const newMessage = {
      id: Date.now(),
      message,
      type,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setStatusMessages(prev => [newMessage, ...prev.slice(0, 19)]);
  };

  const clearStatusMessages = () => {
    setStatusMessages([]);
  };

  const handleConfigUpdate = (config, isValid) => {
    setAppConfig({
      ...config,
      isValid
    });
    
    if (window.blockchainServiceConfig) {
      window.blockchainServiceConfig = config;
    } else {
      window.blockchainServiceConfig = config;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary-light relative">
      <header className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBack()}
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Menu
              </button>
              <div className="flex items-center justify-center">
                <img 
                  src="https://i.postimg.cc/CL1bSS6P/Certi-Fy-logo-white.png" 
                  alt="CertiFy Logo" 
                  className="h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onHome()}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-2">
                <WalletStatus status={connectionStatus} />
                <div className="flex gap-2 items-center">
                  <CustomWalletConnect 
                    onConnected={(walletInfo) => {
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
                      setConnectionStatus({ connected: false, error: null, walletName: null });
                      addStatusMessage('Wallet disconnected', 'info');
                    }}
                    onError={(error) => {
                      setConnectionStatus({ connected: false, error: error, walletName: null });
                      addStatusMessage(`Connection failed: ${error.message}`, 'error');
                    }}
                  />
                  {statusMessages.length > 0 && (
                    <button
                      onClick={clearStatusMessages}
                      className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Issue Certificate</h2>
            <p className="text-lg text-blue-100">
              Upload and register certificates on the Cardano blockchain
            </p>
          </div>
          
          {/* Configuration Panel */}
          <div className="mb-6">
            <ConfigurationPanel onConfigUpdate={handleConfigUpdate} />
          </div>
          
          {/* Issue Certificate Section */}
          <div className="mb-6">
            <SimpleIssueCertificate 
              onStatusUpdate={addStatusMessage} 
              walletApi={connectionStatus.walletApi}
              config={appConfig}
            />
          </div>
          
          {/* Status Display Section */}
          <div className="mb-6">
            <StatusDisplay messages={statusMessages} />
          </div>
          
          {/* Tutorial Information Section */}
          <div className="mb-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg border border-white border-opacity-20 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl text-white">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <h2 className="text-2xl font-semibold text-white">Issuing Certificates - How It Works</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white bg-opacity-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-3">Step-by-Step Process:</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-100">
                  <li>Configure your Blockfrost API key in the settings above</li>
                  <li>Upload your PDF certificate file using the form above</li>
                  <li>Connect your Cardano wallet using the wallet button</li>
                  <li>Click "Issue" to store the file hash on blockchain</li>
                  <li>Transaction creates permanent proof of authenticity</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 bg-opacity-10 border border-blue-200 border-opacity-30 rounded-md backdrop-blur-sm">
                  <p className="text-sm text-white">
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    <strong>Note:</strong> This app uses Cardano's testnet for demonstration. 
                    Make sure your wallet is set to "Preview" or "Pre-production" testnet mode and has test ADA.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 bg-opacity-10 border border-green-200 border-opacity-30 rounded-md backdrop-blur-sm">
                  <p className="text-sm text-white">
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                    <strong>Real Blockchain:</strong> This app creates real Cardano blockchain transactions. 
                    Configure your Blockfrost API key in the settings to enable transaction submission and verification.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 bg-opacity-10 border border-purple-200 border-opacity-30 rounded-md backdrop-blur-sm">
                  <p className="text-sm text-white">
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                    <strong>Setup Required:</strong> Get your free Blockfrost API key at{' '}
                    <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-200">
                      blockfrost.io
                    </a>{' '}
                    and enter it in the configuration panel above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueCertificatePage;