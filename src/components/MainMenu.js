import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCertificate, 
  faSearch, 
  faShieldAlt,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const MainMenu = ({ onSelectOption, onHome }) => {
  const [currentLight, setCurrentLight] = React.useState(0);
  const [lightOpacity, setLightOpacity] = React.useState(0);

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

  React.useEffect(() => {
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

  const menuOptions = [
    {
      id: 'issue',
      title: 'Issue Certificate',
      description: 'Upload and register your certificates on the blockchain for tamper-proof verification',
      icon: faCertificate,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'verify',
      title: 'Verify Certificate',
      description: 'Check the authenticity of certificates by comparing them against blockchain records',
      icon: faSearch,
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

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
              opacity: index === currentLight ? lightOpacity * 0.3 : 0,
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
              onClick={() => onHome()}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://i.postimg.cc/CL1bSS6P/Certi-Fy-logo-white.png" 
                alt="CertiFy Logo" 
                className="h-12 w-auto object-contain"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose what you want to do
            </h2>
            <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto">
              Choose how you'd like to manage your certificates on the Cardano blockchain
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
            {menuOptions.map((option, index) => (
              <div
                key={option.id}
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <button
                  onClick={() => onSelectOption(option.id)}
                  className="w-full h-full p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                >
                  {/* Icon */}
                  <div className="text-6xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={option.icon} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">
                    {option.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Action Icon */}
                  <div className="flex items-center justify-center text-white group-hover:text-blue-100 transition-colors">
                    <span className="mr-2 font-medium">Get Started</span>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-white text-opacity-70 text-sm max-w-2xl mx-auto">
              All operations use real Cardano blockchain transactions on the testnet. 
              Make sure you have your Blockfrost API key configured and a Cardano wallet connected.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainMenu;