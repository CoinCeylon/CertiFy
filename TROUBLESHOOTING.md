# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to issue certificate: invalid length" Error

This error usually occurs due to BigInt handling issues. The application has been updated to handle this properly.

**Solutions:**
- Ensure your wallet is properly connected
- Check that you have sufficient ADA (at least 3 ADA) in your wallet
- Verify your Blockfrost API key is correct for the selected network

### 2. "Network error or invalid address format" Error

This error occurs when the Blockfrost API cannot process the wallet address.

**Solutions:**
- Ensure your wallet is connected to the correct network (testnet for preprod/preview)
- Check that your Blockfrost API key matches the selected network
- Try disconnecting and reconnecting your wallet

### 3. API Key Configuration

**To get a Blockfrost API key:**
1. Go to https://blockfrost.io/
2. Sign up for a free account
3. Create a new project for the testnet (Preprod or Preview)
4. Copy the API key to the configuration panel

**Network Configuration:**
- **Preprod**: Use for most testing (recommended)
- **Preview**: Alternative testnet
- **Mainnet**: Real ADA (not recommended for testing)

### 4. Wallet Setup

**Supported Wallets:**
- Lace Wallet
- Nami Wallet
- Eternl Wallet
- Other CIP-30 compatible wallets

**Wallet Configuration:**
1. Install a supported wallet browser extension
2. Set wallet to testnet mode (preprod or preview)
3. Get test ADA from faucet: https://docs.cardano.org/cardano-testnet/tools/faucet/
4. Connect wallet to the application

### 5. Transaction Debugging

If transactions fail, check:
1. Wallet balance (need at least 3 ADA)
2. Network selection (wallet and app must match)
3. API key validity
4. Internet connection

### 6. Verification Issues

If certificate verification fails:
1. Ensure the certificate was issued from the same wallet address
2. Check that you're on the same network where the certificate was issued
3. Wait a few minutes for blockchain confirmation
4. Verify your Blockfrost API key has read access

## Getting Help

If issues persist:
1. Check browser console for detailed error messages
2. Verify all configuration settings
3. Try with a different wallet or browser
4. Ensure all browser extensions are up to date

## Debug Mode

To enable detailed logging:
1. Open browser developer tools (F12)
2. Check the Console tab for detailed error messages
3. Look for specific error patterns mentioned above
