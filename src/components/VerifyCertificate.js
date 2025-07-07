import React, { useState } from 'react';
import { useWallet } from '@meshsdk/react';
import blockchainService from '../services/blockchainService';

const VerifyCertificate = ({ onStatusUpdate }) => {
  const { connected, wallet } = useWallet();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [fileHash, setFileHash] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      blockchainService.validateFile(file);
      setSelectedFile(file);
      setVerificationResult(null);
      
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

  const handleVerify = async () => {
    if (!connected) {
      onStatusUpdate('Please connect your wallet first', 'error');
      return;
    }

    if (!selectedFile) {
      onStatusUpdate('Please select a certificate file first', 'error');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      onStatusUpdate('Verifying certificate on blockchain...', 'info');
      
      // Get wallet address for searching transactions
      const addresses = await wallet.getUsedAddresses();
      const address = addresses[0] || await wallet.getChangeAddress();
      
      const result = await blockchainService.verifyCertificate(fileHash, address);
      setVerificationResult(result);
      
      if (result.valid) {
        onStatusUpdate(
          `✅ Certificate is VALID! Found on blockchain in transaction: ${result.transactionHash}`,
          'success'
        );
      } else {
        onStatusUpdate(
          `❌ Certificate is INVALID! Hash not found on blockchain.`,
          'error'
        );
      }
      
    } catch (error) {
      console.error('Verify certificate error:', error);
      onStatusUpdate(`Failed to verify certificate: ${error.message}`, 'error');
      setVerificationResult({ valid: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Verify Certificate</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="verify-file-input" className="block text-sm font-medium text-gray-700 mb-2">
            Select Certificate to Verify (PDF only)
          </label>
          <input
            id="verify-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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
          onClick={handleVerify}
          disabled={!connected || !selectedFile || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !connected || !selectedFile || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying Certificate...
            </div>
          ) : (
            'Verify Certificate'
          )}
        </button>

        {!connected && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Connect your wallet to verify certificates
          </p>
        )}

        {/* Verification Results */}
        {verificationResult && (
          <div className={`p-4 rounded-lg border-2 ${
            verificationResult.valid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-2 ${
                verificationResult.valid ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.valid ? '✅' : '❌'}
              </span>
              <h3 className={`text-lg font-semibold ${
                verificationResult.valid ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.valid ? 'Certificate is VALID' : 'Certificate is INVALID'}
              </h3>
            </div>
            
            {verificationResult.valid ? (
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Transaction Hash:</strong> 
                  <code className="bg-green-100 px-1 rounded ml-1 break-all">
                    {verificationResult.transactionHash}
                  </code>
                </p>
                {verificationResult.fileName && (
                  <p><strong>Original Filename:</strong> {verificationResult.fileName}</p>
                )}
                {verificationResult.issuedAt && (
                  <p><strong>Issued At:</strong> {formatDate(verificationResult.issuedAt)}</p>
                )}
                {verificationResult.issuer && (
                  <p><strong>Issued By:</strong> {verificationResult.issuer}</p>
                )}
                {verificationResult.blockTime && (
                  <p><strong>Block Time:</strong> {formatDate(verificationResult.blockTime * 1000)}</p>
                )}
              </div>
            ) : (
              <div className="text-sm text-red-700">
                <p>{verificationResult.message || 'This certificate was not found on the blockchain.'}</p>
                <p className="mt-2 text-xs">
                  This could mean the certificate is fake, modified, or was issued by a different system.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
