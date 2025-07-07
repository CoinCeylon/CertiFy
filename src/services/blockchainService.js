import { Transaction } from '@meshsdk/core';
import { Lucid, Blockfrost } from 'lucid-cardano';
import CryptoJS from 'crypto-js';

/* eslint-env es2020 */
/* global BigInt */

class BlockchainService {
  constructor() {
    this.defaultNetwork = 'preprod';
    
    // Clean up any legacy demo data on initialization
    this.cleanupDemoData();
  }

  // Get current configuration from global state or use defaults
  getConfig() {
    const config = window.blockchainServiceConfig || {};
    return {
      apiKey: config.blockfrostApiKey || process.env.REACT_APP_BLOCKFROST_API_KEY || 'preprodYOUR_API_KEY_HERE',
      network: config.network || this.defaultNetwork,
      baseUrl: this.getBaseUrl(config.network || this.defaultNetwork)
    };
  }

  getBaseUrl(network) {
    switch (network) {
      case 'mainnet':
        return 'https://cardano-mainnet.blockfrost.io/api/v0';
      case 'preview':
        return 'https://cardano-preview.blockfrost.io/api/v0';
      case 'preprod':
      default:
        return 'https://cardano-preprod.blockfrost.io/api/v0';
    }
  }

  /**
   * Calculate SHA-256 hash of a file
   * @param {File} file - The file to hash
   * @returns {Promise<string>} - The hex hash string
   */
  async calculateFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Issue a certificate by storing its hash on the blockchain
   * @param {string} fileHash - The hash of the certificate file
   * @param {Object} walletApi - The connected wallet API instance
   * @param {string} fileName - The original filename
   * @returns {Promise<string>} - The transaction hash
   */
  async issueCertificate(fileHash, walletApi, fileName = 'certificate.pdf') {
    try {
      console.log('Issuing certificate with hash:', fileHash);
      console.log('Wallet API:', walletApi);
      
      if (!walletApi) {
        throw new Error('Wallet API not provided. Please connect your wallet.');
      }

      const config = this.getConfig();
      
      if (!config.apiKey || config.apiKey === 'preprodYOUR_API_KEY_HERE') {
        throw new Error('Blockfrost API key not configured. Please set up your API key in the configuration panel.');
      }

      // Validate API key first
      const isValidKey = await this.validateApiKey();
      if (!isValidKey) {
        throw new Error('Invalid Blockfrost API key. Please check your configuration.');
      }

      // Initialize Lucid with Blockfrost
      const lucidNetwork = config.network === 'mainnet' ? 'Mainnet' : 
                          config.network === 'preview' ? 'Preview' : 'Preprod';
      
      console.log('Initializing Lucid with network:', lucidNetwork);
      console.log('Blockfrost config:', { baseUrl: config.baseUrl, network: config.network });
      
      const lucid = await Lucid.new(
        new Blockfrost(config.baseUrl, config.apiKey),
        lucidNetwork
      );

      console.log('Lucid initialized successfully');

      // Create a wallet adapter for Lucid
      const walletAdapter = {
        getUtxos: () => walletApi.getUtxos(),
        getUsedAddresses: () => walletApi.getUsedAddresses(),
        getUnusedAddresses: () => walletApi.getUnusedAddresses(),
        getChangeAddress: () => walletApi.getChangeAddress(),
        getRewardAddresses: () => walletApi.getRewardAddresses(),
        signTx: (tx) => walletApi.signTx(tx, true),
        submitTx: (tx) => walletApi.submitTx(tx),
      };

      // Select wallet
      lucid.selectWallet(walletAdapter);

      // Get wallet address - try to get bech32 format
      let address;
      try {
        address = await this.getBech32Address(walletApi);
        console.log('Using bech32 address:', address);
      } catch (bech32Error) {
        console.warn('Could not get bech32 address, using change address:', bech32Error);
        address = await walletApi.getChangeAddress();
        console.log('Using change address:', address);
      }

      // Validate address format
      if (!address) {
        throw new Error('Could not get wallet address. Please ensure your wallet is properly connected.');
      }

      if (typeof address !== 'string' || address.length < 10) {
        throw new Error(`Invalid address format received from wallet: ${address}`);
      }

      // Check wallet balance
      const utxos = await walletApi.getUtxos();
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs found in wallet. Please ensure your wallet has some test ADA.');
      }

      // Create metadata
      const metadata = {
        674: {
          certificate_hash: fileHash,
          file_name: fileName,
          issued_at: new Date().toISOString(),
          issuer: 'CertiFy - Certificate Verifier App',
          version: '1.0',
          network: config.network
        }
      };

      console.log('Building transaction with metadata:', metadata);

      // Build transaction with Lucid - use string instead of BigInt to avoid length issues
      const tx = await lucid
        .newTx()
        .payToAddress(address, { lovelace: "2000000" }) // Send 2 ADA to self (string format)
        .attachMetadata(674, metadata[674])
        .complete();

      console.log('Transaction built, signing...');

      // Sign transaction
      const signedTx = await tx.sign().complete();
      
      console.log('Transaction signed, submitting...');

      // Submit transaction
      const txHash = await signedTx.submit();
      
      console.log('Transaction submitted with hash:', txHash);

      return txHash;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      
      // Provide specific error messages for common issues
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      if (errorMessage.includes('insufficient')) {
        throw new Error('Insufficient funds in wallet. Please ensure you have at least 3 ADA in your wallet.');
      } else if (errorMessage.includes('network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (errorMessage.includes('API key')) {
        throw new Error('Blockfrost API configuration error. Please check your API key and network settings.');
      } else {
        throw new Error(`Failed to issue certificate: ${errorMessage}`);
      }
    }
  }



  /**
   * Verify a certificate by checking if its hash exists on the blockchain
   * @param {string} fileHash - The hash to search for
   * @param {string} walletAddress - The wallet address to search transactions for
   * @returns {Promise<Object>} - Verification result with details
   */
  async verifyCertificate(fileHash, walletAddress) {
    try {
      console.log('Verifying certificate with hash:', fileHash);
      console.log('Searching address:', walletAddress);

      const config = this.getConfig();
      
      if (!config.apiKey || config.apiKey === 'preprodYOUR_API_KEY_HERE') {
        throw new Error('Blockfrost API key not configured. Please set up your API key in the configuration panel.');
      }

      // Validate API key first
      const isValidKey = await this.validateApiKey();
      if (!isValidKey) {
        throw new Error('Invalid Blockfrost API key. Please check your configuration.');
      }

      // Check if address is hex format and try to convert it
      let searchAddress = walletAddress;
      if (walletAddress.length > 50 && !walletAddress.startsWith('addr')) {
        console.log('Address appears to be in hex format, attempting conversion...');
        
        // Initialize Lucid to use address utilities
        try {
          const lucidNetwork = config.network === 'mainnet' ? 'Mainnet' : 
                              config.network === 'preview' ? 'Preview' : 'Preprod';
          
          const lucid = await Lucid.new(
            new Blockfrost(config.baseUrl, config.apiKey),
            lucidNetwork
          );
          
          // Try to convert hex to bech32 using Lucid
          // This might not work directly, so we'll fall back to using the hex address
          searchAddress = walletAddress;
        } catch (conversionError) {
          console.warn('Could not convert address format:', conversionError);
          searchAddress = walletAddress;
        }
      }

      // Get transactions for the address
      const transactions = await this.getAddressTransactions(searchAddress);
      console.log(`Found ${transactions.length} transactions to check`);

      if (transactions.length === 0) {
        return {
          valid: false,
          message: 'No transactions found for this address. The certificate may have been issued from a different wallet or the address format may be incompatible.'
        };
      }

      // Check each transaction for matching metadata
      for (const tx of transactions) {
        try {
          const metadata = await this.getTransactionMetadata(tx.tx_hash);
          console.log(`Checking transaction ${tx.tx_hash} metadata:`, metadata);
          
          // Look for certificate metadata in label 674
          if (metadata && metadata['674'] && metadata['674'].certificate_hash === fileHash) {
            return {
              valid: true,
              transactionHash: tx.tx_hash,
              issuedAt: metadata['674'].issued_at,
              fileName: metadata['674'].file_name,
              issuer: metadata['674'].issuer,
              blockTime: tx.block_time,
              blockHeight: tx.block_height,
              network: metadata['674'].network || config.network
            };
          }
        } catch (metadataError) {
          console.log(`No metadata found for transaction ${tx.tx_hash}`);
          continue;
        }
      }

      return {
        valid: false,
        message: 'Certificate hash not found on blockchain. The certificate may be invalid or issued on a different network.'
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      
      // Provide specific error messages for common issues
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      if (errorMessage.includes('API key')) {
        throw new Error('Blockfrost API configuration error. Please check your API key and network settings.');
      } else if (errorMessage.includes('Invalid address format')) {
        throw new Error('Address format not supported by Blockfrost API. This may be a hex-encoded address that needs conversion to bech32 format.');
      } else if (errorMessage.includes('network') || errorMessage.includes('400')) {
        throw new Error('Network error or invalid address format. Please check your wallet connection and try again.');
      } else {
        throw new Error(`Failed to verify certificate: ${errorMessage}`);
      }
    }
  }



  /**
   * Get transactions for a given address using Blockfrost API
   * @param {string} address - The wallet address
   * @returns {Promise<Array>} - Array of transactions
   */
  async getAddressTransactions(address) {
    try {
      const config = this.getConfig();
      
      if (!config.apiKey || config.apiKey === 'preprodYOUR_API_KEY_HERE') {
        throw new Error('Blockfrost API key not configured. Please set up your API key in the configuration panel.');
      }

      // Clean address
      const cleanAddress = address.trim();
      
      // Check if address is hex format (long hex string without addr prefix)
      if (cleanAddress.length > 50 && !cleanAddress.startsWith('addr') && !cleanAddress.startsWith('stake')) {
        console.warn('Address appears to be in hex format:', cleanAddress.substring(0, 20) + '...');
        throw new Error(`Invalid address format: ${cleanAddress.substring(0, 20)}... (hex format not supported)`);
      }

      console.log(`Fetching transactions for address: ${cleanAddress}`);

      const response = await fetch(`${config.baseUrl}/addresses/${cleanAddress}/transactions?order=desc&count=50`, {
        headers: {
          'project_id': config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Address not found or has no transactions');
          return [];
        }
        if (response.status === 400) {
          throw new Error(`Invalid address format: ${cleanAddress.substring(0, 20)}...`);
        }
        throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`);
      }

      const transactions = await response.json();
      console.log('Fetched transactions from Blockfrost:', transactions);
      return transactions || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      throw new Error(`Failed to fetch transactions: ${errorMessage}`);
    }
  }

  /**
   * Get metadata for a specific transaction
   * @param {string} txHash - The transaction hash
   * @returns {Promise<Object>} - Transaction metadata
   */
  async getTransactionMetadata(txHash) {
    try {
      const config = this.getConfig();
      
      const response = await fetch(`${config.baseUrl}/txs/${txHash}/metadata`, {
        headers: {
          'project_id': config.apiKey
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No metadata found
        }
        console.warn(`Metadata fetch failed for ${txHash}: ${response.status} ${response.statusText}`);
        throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`);
      }

      const metadataArray = await response.json();
      console.log('Raw metadata from Blockfrost:', metadataArray);
      
      // Convert array format to object format
      const metadata = {};
      metadataArray.forEach(item => {
        metadata[item.label] = item.json_metadata;
      });
      
      return metadata;
    } catch (error) {
      console.error('Error fetching transaction metadata:', error);
      return null;
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate file type (only PDF for now)
   * @param {File} file - The file to validate
   * @returns {boolean} - Whether file is valid
   */
  validateFile(file) {
    const allowedTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF files are supported');
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    return true;
  }

  /**
   * Clean up any demo data from localStorage
   * This function removes any legacy demo transaction data
   */
  cleanupDemoData() {
    try {
      localStorage.removeItem('demo_transactions');
      console.log('Demo data cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up demo data:', error);
    }
  }

  /**
   * Get network info from config
   * @returns {Object} - Network information
   */
  getNetworkInfo() {
    const config = this.getConfig();
    return {
      network: config.network,
      networkName: config.network === 'mainnet' ? 'Mainnet' : 
                   config.network === 'preview' ? 'Preview Testnet' : 
                   'Pre-production Testnet',
      apiUrl: config.baseUrl,
      isTestnet: config.network !== 'mainnet'
    };
  }

  /**
   * Validate Blockfrost API configuration
   * @returns {Promise<boolean>} - Whether the API key is valid
   */
  async validateApiKey() {
    try {
      const config = this.getConfig();
      
      if (!config.apiKey || config.apiKey === 'preprodYOUR_API_KEY_HERE') {
        return false;
      }

      // Test the API key by making a simple request
      const response = await fetch(`${config.baseUrl}/network`, {
        headers: {
          'project_id': config.apiKey
        }
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  /**
   * Test wallet connectivity and get basic info
   * @param {Object} walletApi - The wallet API instance
   * @returns {Promise<Object>} - Wallet information
   */
  async testWalletConnection(walletApi) {
    try {
      console.log('Testing wallet connection...');
      
      // Get basic wallet info
      const address = await walletApi.getChangeAddress();
      const usedAddresses = await walletApi.getUsedAddresses();
      const unusedAddresses = await walletApi.getUnusedAddresses();
      const utxos = await walletApi.getUtxos();
      
      const walletInfo = {
        changeAddress: address,
        usedAddressesCount: usedAddresses?.length || 0,
        unusedAddressesCount: unusedAddresses?.length || 0,
        utxosCount: utxos?.length || 0,
        totalAda: utxos?.reduce((sum, utxo) => {
          const amount = utxo.amount?.find(a => a.unit === 'lovelace');
          return sum + (parseInt(amount?.quantity || 0) / 1000000);
        }, 0) || 0
      };
      
      console.log('Wallet info:', walletInfo);
      return walletInfo;
    } catch (error) {
      console.error('Wallet connection test failed:', error);
      throw error;
    }
  }

  /**
   * Convert hex address to bech32 format for Blockfrost API
   * @param {string} hexAddress - The hex-encoded address
   * @returns {string} - The bech32-encoded address
   */
  hexToBech32Address(hexAddress) {
    try {
      // If it's already a bech32 address, return as is
      if (hexAddress.startsWith('addr') || hexAddress.startsWith('stake')) {
        return hexAddress;
      }
      
      // For hex addresses, we need to use Lucid's address utilities
      // This is a simplified conversion - in practice you'd use proper address conversion
      console.log('Converting hex address to bech32:', hexAddress);
      
      // For now, return the hex address and let the calling function handle the error
      // In a real implementation, you'd use Lucid's address conversion utilities
      return hexAddress;
    } catch (error) {
      console.error('Error converting address:', error);
      return hexAddress;
    }
  }

  /**
   * Get bech32 address from wallet using Lucid
   * @param {Object} walletApi - The wallet API instance
   * @returns {Promise<string>} - The bech32 address
   */
  async getBech32Address(walletApi) {
    try {
      const config = this.getConfig();
      
      // Initialize Lucid
      const lucidNetwork = config.network === 'mainnet' ? 'Mainnet' : 
                          config.network === 'preview' ? 'Preview' : 'Preprod';
      
      const lucid = await Lucid.new(
        new Blockfrost(config.baseUrl, config.apiKey),
        lucidNetwork
      );

      // Create wallet adapter
      const walletAdapter = {
        getUtxos: () => walletApi.getUtxos(),
        getUsedAddresses: () => walletApi.getUsedAddresses(),
        getUnusedAddresses: () => walletApi.getUnusedAddresses(),
        getChangeAddress: () => walletApi.getChangeAddress(),
        getRewardAddresses: () => walletApi.getRewardAddresses(),
        signTx: (tx) => walletApi.signTx(tx, true),
        submitTx: (tx) => walletApi.submitTx(tx),
      };

      // Select wallet
      lucid.selectWallet(walletAdapter);
      
      // Get the address in bech32 format
      const address = await lucid.wallet.address();
      console.log('Bech32 address from Lucid:', address);
      
      return address;
    } catch (error) {
      console.error('Error getting bech32 address:', error);
      // Fallback to wallet's address
      return await walletApi.getChangeAddress();
    }
  }

}

const blockchainService = new BlockchainService();
export default blockchainService;
