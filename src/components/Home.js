import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faLink, faWallet, faShield, faBolt, faGlobe, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Home = ({ onGetStarted, onTutorial }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);
  const [lightOpacity, setLightOpacity] = useState(0);

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

  const sections = [
    {
      id: 0,
      title: "Certificate Authentication",
      subtitle: "Secure Your Documents",
      description: "CertiFy revolutionizes document verification by creating tamper-proof digital certificates on the blockchain. Issue, store, and verify certificates with unmatched security and transparency.",
      icon: faCertificate,
      gradient: "from-primary to-secondary"
    },
    {
      id: 1,
      title: "Blockchain Technology",
      subtitle: "Powered by Cardano",
      description: "Built on Cardano's robust blockchain infrastructure, ensuring immutable record-keeping, decentralized verification, and enterprise-grade security for all your certificates.",
      icon: faLink,
      gradient: "from-secondary to-primary-light"
    },
    {
      id: 2,
      title: "Crypto Wallet Integration",
      subtitle: "Seamless Web3 Experience",
      description: "Connect your Cardano wallet to interact with the blockchain. Secure, user-friendly, and compatible with popular wallets like Lace, Nami, and Eternl.",
      icon: faWallet,
      gradient: "from-primary via-secondary to-primary-light"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [sections.length]);

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

  const handleDotClick = (index) => {
    if (index !== currentSection) {
      setCurrentSection(index);
    }
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
            <div className="flex items-center justify-center">
              <img 
                src="https://i.postimg.cc/CL1bSS6P/Certi-Fy-logo-white.png" 
                alt="CertiFy Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Welcome to
            </h1>
            <div className="flex justify-center">
              <img 
                src="https://i.postimg.cc/2540hCYd/Certi-Fy-text-white.png" 
                alt="CertiFy" 
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            The future of document verification is here. Secure, transparent, and immutable certificate management on the blockchain.
          </p>
        </div>

        {/* Animated Section Display */}
        <div className="w-full max-w-5xl mx-auto mb-12 overflow-hidden">
          <div className="relative h-96 flex items-center">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSection 
                    ? 'translate-x-0' 
                    : index < currentSection 
                      ? '-translate-x-full' 
                      : 'translate-x-full'
                }`}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-6xl mb-6 text-white">
                    <FontAwesomeIcon icon={section.icon} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <h3 className="text-xl md:text-2xl text-blue-100 mb-6">
                    {section.subtitle}
                  </h3>
                  <p className="text-lg text-blue-50 leading-relaxed max-w-3xl mx-auto px-4">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex space-x-4 mb-16">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                currentSection === index
                  ? 'bg-white shadow-lg scale-110'
                  : 'bg-white bg-opacity-40 hover:bg-opacity-60'
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-primary bg-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 hover:bg-blue-50"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:text-white">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-90 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <svg
              className="ml-3 w-6 h-6 transform group-hover:translate-x-2 transition-all duration-500 relative z-10 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          {/* Get Help Button */}
          <div className="mt-6">
            <button
              onClick={onTutorial}
              className="inline-flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300 px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 border border-white border-opacity-30 hover:border-opacity-50"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="text-lg" />
              <span className="font-medium">Get Help</span>
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">Why Choose</span>
              <img 
                src="https://i.postimg.cc/2540hCYd/Certi-Fy-text-white.png" 
                alt="CertiFy" 
                className="h-10 w-auto object-contain transform translate-y-1.5"
              />
              <span className="text-4xl font-bold text-white">?</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: faShield,
                title: "Immutable Security",
                description: "Once issued, certificates cannot be altered or deleted, ensuring permanent authenticity."
              },
              {
                icon: faBolt,
                title: "Instant Verification",
                description: "Verify any certificate in seconds using blockchain technology and cryptographic hashes."
              },
              {
                icon: faGlobe,
                title: "Global Access",
                description: "Access and verify certificates from anywhere in the world, 24/7, with internet connectivity."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2 border border-white border-opacity-20"
              >
                <div className="text-4xl mb-4 text-white">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-20 backdrop-blur-sm border-t border-white border-opacity-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-blue-200 text-sm text-center">
              © 2025 CertiFy by Kryptos. Securing the future of digital certificates.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;