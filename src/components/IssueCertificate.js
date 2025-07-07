import React, { useState } from 'react';
import { useWallet } from '@meshsdk/react';
import blockchainService from '../services/blockchainService';

const IssueCertificate = ({ onStatusUpdate }) => {
  const { connected, wallet } = useWallet();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileHash, setFileHash] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      blockchainService.validateFile(file);
      setSelectedFile(file);
      
      // Calculate hash immediately for preview
      onStatusUpdate('Calculating file hash...', 'info');
      const hash = await blockchainService.calculateFileHash(file);
      setFileHash(hash);
      onStatusUpdate(`File selected: ${file.name} (Hash: ${hash.substring(0, 16)}...)`, 'success');
    } catch (error) {
      onStatusUpdate(`File validation error: ${error.message}`, 'error');
      setSelectedFile(null);
      setFileHash('');
    }
  };

  const handleIssue = async () => {
    if (!connected) {
      onStatusUpdate('Please connect your wallet first', 'error');
      return;
    }

    if (!selectedFile) {
      onStatusUpdate('Please select a certificate file first', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      onStatusUpdate('Issuing certificate to blockchain...', 'info');
      
      const txHash = await blockchainService.issueCertificate(
        fileHash, 
        wallet, 
        selectedFile.name
      );
      
      onStatusUpdate(
        `Certificate issued successfully! Transaction hash: ${txHash}`, 
        'success'
      );
      
      // Reset form
      setSelectedFile(null);
      setFileHash('');
      const fileInput = document.getElementById('issue-file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Issue certificate error:', error);
      onStatusUpdate(`Failed to issue certificate: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Issue Certificate</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="issue-file-input" className="block text-sm font-medium text-gray-700 mb-2">
            Select Certificate (PDF only)
          </label>
          <input
            id="issue-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>File:</strong> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Size:</strong> {blockchainService.formatFileSize(selectedFile.size)}
            </p>
            {fileHash && (
              <p className="text-sm text-gray-600 break-all">
                <strong>Hash:</strong> <code className="bg-gray-200 px-1 rounded">{fileHash}</code>
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleIssue}
          disabled={!connected || !selectedFile || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !connected || !selectedFile || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Issuing Certificate...
            </div>
          ) : (
            'Issue Certificate'
          )}
        </button>

        {!connected && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Connect your wallet to issue certificates
          </p>
        )}
      </div>
    </div>
  );
};

export default IssueCertificate;
