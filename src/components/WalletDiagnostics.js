import React, { useState, useEffect } from 'react';

const WalletDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    windowCardano: false,
    availableWallets: [],
    walletDetails: {}
  });

  useEffect(() => {
    const checkWallets = () => {
      const results = {
        windowCardano: !!window.cardano,
        availableWallets: [],
        walletDetails: {}
      };

      if (window.cardano) {
        const walletNames = Object.keys(window.cardano);
        results.availableWallets = walletNames;
        
        walletNames.forEach(name => {
          const wallet = window.cardano[name];
          results.walletDetails[name] = {
            name: wallet?.name || name,
            icon: wallet?.icon || 'N/A',
            isEnabled: typeof wallet?.isEnabled === 'function',
            apiVersion: wallet?.apiVersion || 'Unknown'
          };
        });
      }

      setDiagnostics(results);
    };

    // Check immediately
    checkWallets();

    // Check again after a delay (some wallets take time to inject)
    const timeout = setTimeout(checkWallets, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const testWalletConnection = async (walletName) => {
    try {
      const wallet = window.cardano[walletName];
      if (!wallet) {
        alert(`${walletName} wallet not found`);
        return;
      }

      console.log(`Testing ${walletName} wallet:`, wallet);

      if (typeof wallet.isEnabled !== 'function') {
        alert(`${walletName} wallet doesn't have isEnabled method`);
        return;
      }

      const isEnabled = await wallet.isEnabled();
      console.log(`${walletName} isEnabled:`, isEnabled);

      if (!isEnabled) {
        if (typeof wallet.enable !== 'function') {
          alert(`${walletName} wallet doesn't have enable method`);
          return;
        }

        const api = await wallet.enable();
        console.log(`${walletName} API:`, api);
        
        if (api && typeof api.getChangeAddress === 'function') {
          const address = await api.getChangeAddress();
          console.log(`${walletName} address:`, address);
          alert(`${walletName} connected successfully!\nAddress: ${address}`);
        } else {
          alert(`${walletName} API doesn't have required methods`);
        }
      } else {
        alert(`${walletName} is already enabled`);
      }
    } catch (error) {
      console.error(`Error testing ${walletName}:`, error);
      alert(`Error testing ${walletName}: ${error.message}`);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔧 Wallet Diagnostics</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>window.cardano available:</strong> 
          <span className={diagnostics.windowCardano ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
            {diagnostics.windowCardano ? '✅ Yes' : '❌ No'}
          </span>
        </div>

        <div>
          <strong>Available wallets:</strong>
          {diagnostics.availableWallets.length > 0 ? (
            <div className="mt-2 space-y-2">
              {diagnostics.availableWallets.map(walletName => (
                <div key={walletName} className="bg-white p-2 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{diagnostics.walletDetails[walletName]?.name || walletName}</strong>
                      <div className="text-xs text-gray-500">
                        API Version: {diagnostics.walletDetails[walletName]?.apiVersion}
                      </div>
                    </div>
                    <button
                      onClick={() => testWalletConnection(walletName)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-red-600 ml-1">❌ None found</span>
          )}
        </div>

        {diagnostics.availableWallets.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
            <p className="text-red-800 font-medium">No Cardano wallets detected!</p>
            <p className="text-red-700 text-xs mt-1">
              Please install a Cardano wallet extension such as:
            </p>
            <ul className="text-red-700 text-xs mt-1 list-disc list-inside">
              <li><a href="https://www.lace.io/" target="_blank" rel="noopener noreferrer" className="underline">Lace Wallet</a></li>
              <li><a href="https://namiwallet.io/" target="_blank" rel="noopener noreferrer" className="underline">Nami Wallet</a></li>
              <li><a href="https://eternl.io/" target="_blank" rel="noopener noreferrer" className="underline">Eternl Wallet</a></li>
            </ul>
            <p className="text-red-700 text-xs mt-2">
              After installation, refresh this page and make sure the wallet is set to <strong>Preview</strong> or <strong>Pre-production</strong> testnet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDiagnostics;
