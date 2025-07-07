import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faArrowRight, 
  faArrowLeft, 
  faCertificate, 
  faShieldAlt, 
  faKey,
  faSearch,
  faWallet,
  faLink
} from '@fortawesome/free-solid-svg-icons';

const Tutorial = ({ onComplete, onHome }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);
  const [lightOpacity, setLightOpacity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const backgroundLights = [
    { top: '20%', left: '10%', size: 'w-72 h-72' },
    { bottom: '20%', right: '10%', size: 'w-96 h-96' },
    { top: '50%', left: '50%', size: 'w-80 h-80', transform: 'transform -translate-x-1/2 -translate-y-1/2' },
    { top: '32%', right: '25%', size: 'w-48 h-48' },
    { bottom: '32%', left: '25%', size: 'w-64 h-64' },
    { top: '16%', left: '66%', size: 'w-56 h-56' },
    { bottom: '16%', right: '33%', size: 'w-40 h-40' },
    { top: '66%', left: '12%', size: 'w-52 h-52' },
    { top: '25%', right: '12%', size: 'w-60 h-60' },
    { bottom: '33%', left: '50%', size: 'w-44 h-44' }
  ];

  useEffect(() => {
    let fadeInTimeout, fadeOutTimeout, switchLightTimeout;
    
    const startLightCycle = () => {
      // Start with fade in: 0% to 70% over 2 seconds
      setLightOpacity(0);
      
      // Gradual fade in
      setTimeout(() => setLightOpacity(0.7), 100);
      
      // After 3 seconds at 70%, start fade out
      fadeOutTimeout = setTimeout(() => {
        setLightOpacity(0);
        
        // After fade out completes (2 seconds), switch to next light position
        switchLightTimeout = setTimeout(() => {
          setCurrentLight((prev) => (prev + 1) % backgroundLights.length);
        }, 2000);
      }, 5000);
    };

    // Start the first cycle
    startLightCycle();
    
    // Repeat every 7 seconds (2s fade in + 3s hold + 2s fade out)
    const interval = setInterval(startLightCycle, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(switchLightTimeout);
    };
  }, [backgroundLights.length]);

  const steps = [
    {
      id: 0,
      title: "Quick Setup Steps",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white mb-6">Get Started in 3 Easy Steps</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Get Your API Key</h4>
                <p className="text-white">
                  Sign up at <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="text-white underline">blockfrost.io</a> and get your free API key for Cardano testnet access.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Install a Cardano Wallet</h4>
                <p className="text-white">
                  Download and set up a Cardano wallet like Lace, Nami, or Eternl. Make sure it's set to "Preview" testnet mode.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Get Test ADA</h4>
                <p className="text-white">
                  Visit the Cardano testnet faucet to get free test ADA for transactions. You'll need this for blockchain operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "How It Works",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white mb-6">Understanding CertiFy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="text-4xl text-white mb-4">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Digital Certificates</h4>
              <p className="text-white text-sm">
                Upload your PDF certificates and create tamper-proof digital records on the blockchain.
              </p>
            </div>

            <div className="text-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="text-4xl text-white mb-4">
                <FontAwesomeIcon icon={faLink} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Blockchain Storage</h4>
              <p className="text-white text-sm">
                Certificate hashes are stored on Cardano blockchain, ensuring immutable and permanent records.
              </p>
            </div>

            <div className="text-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="text-4xl text-white mb-4">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Instant Verification</h4>
              <p className="text-white text-sm">
                Anyone can verify certificate authenticity by comparing the uploaded file with blockchain records.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Issue Certificate",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl text-white">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <h3 className="text-2xl font-semibold text-white">Issuing Certificates</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-3">Step-by-Step Process:</h4>
              <ol className="list-decimal list-inside space-y-2 text-white">
                <li>Configure your Blockfrost API key in the settings</li>
                <li>Upload your PDF certificate file</li>
                <li>Connect your Cardano wallet</li>
                <li>Click "Issue" to store the file hash on blockchain</li>
                <li>Transaction creates permanent proof of authenticity</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 bg-opacity-20 border border-blue-200 border-opacity-30 rounded-md">
                <p className="text-xs text-white">
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  <strong>Note:</strong> This app uses Cardano's testnet for demonstration. 
                  Make sure your wallet is set to "Preview" or "Pre-production" testnet mode and has test ADA.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 bg-opacity-20 border border-green-200 border-opacity-30 rounded-md">
                <p className="text-xs text-white">
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  <strong>Real Blockchain:</strong> This app creates real Cardano blockchain transactions. 
                  Configure your Blockfrost API key in the settings to enable transaction submission and verification.
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 bg-opacity-20 border border-purple-200 border-opacity-30 rounded-md">
                <p className="text-xs text-white">
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  <strong>Setup Required:</strong> Get your free Blockfrost API key at{' '}
                  <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="underline text-white">
                    blockfrost.io
                  </a>{' '}
                  and enter it in the configuration panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Verify Certificate",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl text-white">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <h3 className="text-2xl font-semibold text-white">Verifying Certificates</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-3">Verification Process:</h4>
              <ol className="list-decimal list-inside space-y-2 text-white">
                <li>Configure your Blockfrost API key in the settings</li>
                <li>Upload the certificate you want to verify</li>
                <li>Connect your wallet to access blockchain data</li>
                <li>Click "Verify" to check against stored hashes</li>
                <li>Get instant verification results from blockchain</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 bg-opacity-10 rounded-lg border border-green-200 border-opacity-30">
                <h5 className="text-white font-semibold mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Valid Certificate
                </h5>
                <p className="text-white text-sm">
                  Certificate hash matches blockchain records. Document is authentic and unmodified.
                </p>
              </div>
              
              <div className="p-4 bg-red-50 bg-opacity-10 rounded-lg border border-red-200 border-opacity-30">
                <h5 className="text-white font-semibold mb-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                  Invalid Certificate
                </h5>
                <p className="text-white text-sm">
                  Certificate not found on blockchain or has been modified. Authentication failed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (isTransitioning) return;
    
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setCurrentStep(currentStep + 1);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (isTransitioning) return;
    
    if (currentStep > 0) {
      setIsTransitioning(true);
      setCurrentStep(currentStep - 1);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  const goToStep = (stepIndex) => {
    if (isTransitioning || stepIndex === currentStep) return;
    
    setIsTransitioning(true);
    setCurrentStep(stepIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary-light relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Single animated light */}
        {backgroundLights.map((light, index) => (
          <div
            key={index}
            className={`absolute ${light.size} bg-white rounded-full blur-3xl transition-all duration-[2000ms] ease-in-out ${light.transform || ''}`}
            style={{
              top: light.top,
              left: light.left,
              bottom: light.bottom,
              right: light.right,
              opacity: index === currentLight ? lightOpacity * 0.3 : 0, // More visible at 3.5% max
              transform: `${light.transform || ''} scale(${index === currentLight ? 1 : 0.8})`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => onHome ? onHome() : onComplete()}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://i.postimg.cc/CL1bSS6P/Certi-Fy-logo-white.png" 
                alt="CertiFy Logo" 
                className="h-12 w-auto object-contain"
              />
            </button>
            <div className="flex items-center space-x-4">
              {/* Space for future header actions */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-white text-primary shadow-lg' 
                      : 'bg-white bg-opacity-30 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                      index < currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">{steps[currentStep].title}</h2>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 mb-8 h-[550px] relative overflow-hidden">
            <div className="absolute inset-0">
              {/* Render all steps with proper positioning */}
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="absolute inset-0 p-8 md:p-12 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(${(index - currentStep) * 100}%)`
                  }}
                >
                  {step.content}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || isTransitioning}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 0 || isTransitioning
                  ? 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed' 
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-white scale-125' 
                      : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                  } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onComplete()}
                className="text-white text-sm hover:text-blue-200 transition-colors underline px-3 py-2"
              >
                Skip
              </button>
              <button
                onClick={nextStep}
                disabled={isTransitioning}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                  currentStep === steps.length - 1 
                    ? 'bg-gradient-to-r from-white to-blue-100 text-primary hover:from-blue-50 hover:to-blue-200 hover:scale-110 shadow-lg hover:shadow-2xl' 
                    : 'bg-white text-primary hover:bg-blue-50 hover:scale-105'
                } ${isTransitioning ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                <span>{currentStep === steps.length - 1 ? 'Start' : 'Next'}</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tutorial;