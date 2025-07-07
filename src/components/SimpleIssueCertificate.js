import React, { useState } from 'react';
import blockchainService from '../services/blockchainService';

const SimpleIssueCertificate = ({ onStatusUpdate, walletApi, config }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = !!walletApi;
  const isConfigured = config && config.isValid;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      blockchainService.validateFile(file);
      setSelectedFile(file);
      onStatusUpdate(`File selected: ${file.name}`, 'success');
    } catch (error) {
      onStatusUpdate(`File validation error: ${error.message}`, 'error');
      setSelectedFile(null);
    }
  };

  const handleIssue = async () => {
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
    
    try {
      onStatusUpdate('Calculating file hash...', 'info');
      const fileHash = await blockchainService.calculateFileHash(selectedFile);
      
      onStatusUpdate('Creating blockchain transaction...', 'info');
      const txHash = await blockchainService.issueCertificate(
        fileHash, 
        walletApi, 
        selectedFile.name
      );

      onStatusUpdate(`Certificate issued successfully! Transaction: ${txHash}`, 'success');
      setSelectedFile(null);
      document.getElementById('issue-file-input').value = '';
    } catch (error) {
      console.error('Error issuing certificate:', error);
      onStatusUpdate(`Failed to issue certificate: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        📄 Issue Certificate
      </h2>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Select Certificate File (PDF)
          </label>
          <input
            id="issue-file-input"
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

        {/* Issue Button */}
        <button
          onClick={handleIssue}
          disabled={!isConnected || !isConfigured || !selectedFile || isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all backdrop-blur-sm ${
            !isConnected || !isConfigured || !selectedFile || isLoading
              ? 'bg-gray-500 bg-opacity-30 text-gray-300 cursor-not-allowed border border-gray-300 border-opacity-30'
              : 'bg-secondary bg-opacity-80 text-white hover:bg-opacity-100 border border-blue-400 border-opacity-50 hover:border-opacity-80'
          }`}
        >
          {isLoading ? 'Processing...' : 'Issue Certificate on Blockchain'}
        </button>

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

export default SimpleIssueCertificate;
