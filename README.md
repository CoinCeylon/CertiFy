# CertiFy

A blockchain-based certificate verification system that creates tamper-proof digital certificates on the Cardano blockchain.

## What It Does

CertiFy solves certificate fraud by storing cryptographic hashes of PDF certificates on the blockchain, creating permanent proof of authenticity that cannot be tampered with.

### Core Features
- **Issue Certificates**: Upload PDF certificates and store their SHA-256 hash on Cardano blockchain
- **Verify Certificates**: Instantly verify if a certificate is authentic by checking blockchain records
- **Tamper Detection**: Any modification to a certificate changes its hash, making fraud detectable
- **Permanent Records**: Blockchain storage ensures certificates can't be deleted or modified

## Getting Started

### Prerequisites
- Node.js 18+
- Cardano wallet (Nami, Eternl, Lace, etc.)
- Blockfrost API key (free at [blockfrost.io](https://blockfrost.io))

### Installation
```bash
npm install
npm start
```

### Setup
1. Get a free Blockfrost API key from [blockfrost.io](https://blockfrost.io)
2. Configure your API key in the app settings
3. Set your wallet to testnet mode (Preview/Preprod)
4. Get test ADA from the [Cardano testnet faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)

## How It Works

### Issuing Certificates
1. Upload a PDF certificate
2. System calculates SHA-256 hash
3. Connect Cardano wallet
4. Transaction stores hash in blockchain metadata
5. Certificate hash is now permanently recorded

### Verifying Certificates
1. Upload certificate to verify
2. System calculates its hash
3. Search blockchain for matching hash
4. Instant verification result

## Project Structure
```
src/
├── components/           # React components
│   ├── IssueCertificate.js
│   ├── VerifyCertificate.js
│   └── ...
├── services/
│   └── blockchainService.js  # Cardano blockchain integration
└── App.js
```

## Technology Stack
- **React 19** - Frontend framework
- **MeshSDK & Lucid** - Cardano blockchain integration
- **Blockfrost API** - Blockchain data access
- **Tailwind CSS** - Styling
- **SHA-256** - Cryptographic hashing

## Development

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build  
- `npm test` - Run tests

### Configuration
Uses `config-overrides.js` for crypto polyfills to enable browser-compatible blockchain operations.

## 🙏 Acknowledgments

- **Unihack** - For hosting the competition
- **MeshSDK** - For Cardano blockchain integration
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS approach

---

**Built with ❤️ for Unihack 2025**
