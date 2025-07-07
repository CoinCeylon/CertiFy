# 🚀 Quick Setup Guide for CertiFy

## Prerequisites

### 1. Install a Cardano Wallet
You need a Cardano wallet browser extension. Choose one:
- **[Lace Wallet](https://www.lace.io/)** (Recommended)
- **[Nami Wallet](https://namiwallet.io/)**
- **[Eternl Wallet](https://eternl.io/)**

### 2. Configure Wallet for Testnet
⚠️ **IMPORTANT**: Switch your wallet to testnet mode:
- Open your wallet extension
- Go to Settings → Network
- Select **"Preview"** or **"Pre-production"** testnet
- **DO NOT use Mainnet** for this demo

### 3. Get Test ADA
Visit a Cardano testnet faucet to get free test ADA:
- **[Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)**
- Enter your testnet wallet address
- Request test ADA (you'll need it for transaction fees)

### 4. Get Blockfrost API Key
1. Go to **[Blockfrost.io](https://blockfrost.io)**
2. Sign up for a free account
3. Create a new project
4. Select **"Preview"** or **"Pre-production"** testnet (same as your wallet)
5. Copy your API key
6. Update the `.env` file in this project:
   ```
   REACT_APP_BLOCKFROST_API_KEY=preprod_YOUR_ACTUAL_API_KEY_HERE
   ```

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000 in your browser

4. Check the "Wallet Diagnostics" section to verify your wallet is detected

## Troubleshooting

### Wallet Not Connecting
- ✅ Make sure wallet extension is installed and enabled
- ✅ Wallet should be set to **testnet mode** (not mainnet)
- ✅ Try refreshing the page after installing wallet
- ✅ Check browser console for error messages

### "No wallets detected"
- Install a supported wallet extension
- Refresh the page
- Make sure the wallet extension is enabled

### Transaction Fails
- ✅ Make sure you have test ADA in your wallet
- ✅ Confirm wallet is on the correct testnet
- ✅ Check that Blockfrost API key is correct and for the right network

## Features

### Issue Certificate
- Upload a PDF certificate
- Connect your Cardano wallet
- Creates a transaction with the file hash in metadata
- Permanent proof of authenticity on blockchain

### Verify Certificate  
- Upload a certificate to verify
- Checks blockchain for matching hash
- Instant verification results
- Shows original issuance details

---

🎯 **Goal**: Demonstrate how blockchain can solve certificate fraud by creating immutable proof of authenticity.
