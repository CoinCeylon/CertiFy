import React, { useState } from 'react';
import blockchainService from '../services/blockchainService';

const SimpleVerifyCertificate = ({ onStatusUpdate, walletAddress, config, walletApi }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const isConnected = !!walletAddress;
  const isConfigured = config && config.isValid;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      blockchainService.validateFile(file);
      setSelectedFile(file);
      setVerificationResult(null);
      onStatusUpdate(`File selected: ${file.name}`, 'success');
    } catch (error) {
      onStatusUpdate(`File validation error: ${error.message}`, 'error');
      setSelectedFile(null);
    }
  };

  const handleVerify = async () => {
    if (!isConnected) {
      onStatusUpdate('Please connect your wallet first', 'error');
      return;
    }

    if (!isConfigured) {
      onStatusUpdate('Please configure Blockfrost API key in the configuration panel', 'error');
      return;
    }

    if (!selectedFile) {
      onStatusUpdate('Please select a certificate file first', 'error');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      onStatusUpdate('Calculating file hash...', 'info');
      const fileHash = await blockchainService.calculateFileHash(selectedFile);
      
      onStatusUpdate('Getting wallet address...', 'info');
      
      // Get bech32 address if we have wallet API, otherwise use the provided address
      let searchAddress = walletAddress;
      if (walletApi) {
        try {
          searchAddress = await blockchainService.getBech32Address(walletApi);
          console.log('Using bech32 address for search:', searchAddress);
        } catch (addressError) {
          console.warn('Could not get bech32 address, using provided address:', addressError);
          searchAddress = walletAddress;
        }
      }
      
      onStatusUpdate('Searching blockchain for certificate...', 'info');
      const result = await blockchainService.verifyCertificate(fileHash, searchAddress);
      
      setVerificationResult(result);

      if (result.valid) {
        onStatusUpdate(`Certificate is VALID! Found on blockchain in transaction: ${result.transactionHash}`, 'success');
      } else {
        onStatusUpdate('Certificate is INVALID - not found on blockchain', 'error');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      onStatusUpdate(`Verification failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        🔍 Verify Certificate
      </h2>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Select Certificate File (PDF)
          </label>
          <input
            id="verify-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="w-full p-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-md focus:ring-2 focus:ring-white focus:ring-opacity-50 text-white placeholder-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-primary hover:file:bg-blue-50"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-green-200 bg-green-500 bg-opacity-20 p-2 rounded backdrop-blur-sm">
              ✅ Selected: {selectedFile.name} ({blockchainService.formatFileSize(selectedFile.size)})
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isConnected || !isConfigured || !selectedFile || isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all backdrop-blur-sm ${
            !isConnected || !isConfigured || !selectedFile || isLoading
              ? 'bg-gray-500 bg-opacity-30 text-gray-300 cursor-not-allowed border border-gray-300 border-opacity-30'
              : 'bg-green-600 bg-opacity-80 text-white hover:bg-opacity-100 border border-green-400 border-opacity-50 hover:border-opacity-80'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify Certificate'}
        </button>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`p-4 rounded-lg border backdrop-blur-sm ${
            verificationResult.valid 
              ? 'bg-green-500 bg-opacity-20 border-green-200 border-opacity-30' 
              : 'bg-red-500 bg-opacity-20 border-red-200 border-opacity-30'
          }`}>
            <div className={`font-medium ${
              verificationResult.valid ? 'text-green-200' : 'text-red-200'
            }`}>
              {verificationResult.valid ? '✅ VALID Certificate' : '❌ INVALID Certificate'}
            </div>
            
            {verificationResult.valid && (
              <div className="mt-2 text-sm text-green-100 space-y-1">
                <div><strong>Transaction:</strong> {verificationResult.transactionHash}</div>
                <div><strong>Issued:</strong> {verificationResult.issuedAt}</div>
                <div><strong>File:</strong> {verificationResult.fileName}</div>
                <div><strong>Issuer:</strong> {verificationResult.issuer}</div>
                <div className="text-xs bg-secondary bg-opacity-20 text-blue-100 p-2 rounded mt-2 backdrop-blur-sm border border-blue-200 border-opacity-30">
                  🔗 <strong>Blockchain Verified:</strong> This certificate was verified using real Cardano blockchain data.
                </div>
              </div>
            )}
            
            {!verificationResult.valid && (
              <div className="mt-1 text-sm text-red-100">
                This certificate was not found on the blockchain or has been tampered with.
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {!isConnected && (
          <div className="text-sm text-red-200 bg-red-500 bg-opacity-10 p-3 rounded backdrop-blur-sm border border-red-200 border-opacity-30">
            ❌ Wallet not connected
          </div>
        )}
        {!isConfigured && (
          <div className="text-sm text-orange-200 bg-orange-500 bg-opacity-10 p-3 rounded backdrop-blur-sm border border-orange-200 border-opacity-30">
            ⚠️ Blockfrost API key not configured
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleVerifyCertificate;
