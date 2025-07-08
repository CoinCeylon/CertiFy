# CertiFy
Demo Video Link : https://bit.ly/CertiFy-by-Kryptos-demo



[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Cardano](https://img.shields.io/badge/Cardano-Blockchain-0033AD?style=for-the-badge&logo=cardano&logoColor=white)](https://cardano.org/)
[![MeshSDK](https://img.shields.io/badge/MeshSDK-1.9.0-FF6B35?style=for-the-badge)](https://meshjs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache2.0-green.svg?style=for-the-badge)](LICENSE)

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com)
[![Security](https://img.shields.io/badge/Security-SHA--256-blue?style=flat-square)](https://en.wikipedia.org/wiki/SHA-2)
[![Network](https://img.shields.io/badge/Network-Cardano_Testnet-orange?style=flat-square)](https://docs.cardano.org/cardano-testnet/)
[![API](https://img.shields.io/badge/API-Blockfrost-purple?style=flat-square)](https://blockfrost.io/)

A blockchain-based certificate verification system that creates tamper-proof digital certificates on the Cardano blockchain.

## ⭐ Features


### Core Features
- **Issue Certificates**: Upload PDF certificates and store their SHA-256 hash on Cardano blockchain
- **Verify Certificates**: Instantly verify if a certificate is authentic by checking blockchain records
- **Tamper Detection**: Any modification to a certificate changes its hash, making fraud detectable
- **Permanent Records**: Blockchain storage ensures certificates can't be deleted or modified

## 🚀 Getting Started

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Wallet](https://img.shields.io/badge/Wallet-Cardano-0033AD?style=flat&logo=cardano&logoColor=white)
![API](https://img.shields.io/badge/API-Blockfrost-6B46C1?style=flat)

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

## 🔧 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) | 19.1.0 | Frontend framework |
| ![MeshSDK](https://img.shields.io/badge/MeshSDK-1.9-FF6B35?style=flat) | 1.9.0 | Cardano integration |
| ![Lucid](https://img.shields.io/badge/Lucid-0.10-4F46E5?style=flat) | 0.10.11 | Cardano transactions |
| ![Blockfrost](https://img.shields.io/badge/Blockfrost-API-6B46C1?style=flat) | Latest | Blockchain data access |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css) | 3.4.0 | Styling framework |
| ![SHA-256](https://img.shields.io/badge/SHA--256-Crypto-FF0000?style=flat) | Built-in | Cryptographic hashing |

## 💻 Development

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build  
- `npm test` - Run tests

### Configuration
Uses `config-overrides.js` for crypto polyfills to enable browser-compatible blockchain operations.


## 🏆 Competition

CertiFy was built for **Unihack 2025**, demonstrating how blockchain technology can solve real-world problems in document verification and fraud prevention.

## 🙏 Acknowledgments

- **Unihack** - For hosting the competition
- **MeshSDK** - For Cardano blockchain integration
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS approach

---

**Built with ❤️ for Unihack 2025**
