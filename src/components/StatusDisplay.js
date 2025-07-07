import React from 'react';

const StatusDisplay = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Status</h2>
        <div className="text-blue-100 italic">
          Select a certificate file and perform an action to see status updates here.
        </div>
      </div>
    );
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      default: return '📝';
    }
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500 bg-opacity-20 border-green-200 border-opacity-30 text-green-100';
      case 'error': return 'bg-red-500 bg-opacity-20 border-red-200 border-opacity-30 text-red-100';
      case 'info': return 'bg-blue-500 bg-opacity-20 border-blue-200 border-opacity-30 text-blue-100';
      case 'warning': return 'bg-yellow-500 bg-opacity-20 border-yellow-200 border-opacity-30 text-yellow-100';
      default: return 'bg-gray-500 bg-opacity-20 border-gray-200 border-opacity-30 text-gray-100';
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Status & Activity Log</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 backdrop-blur-sm ${getMessageStyle(message.type)}`}
          >
            <div className="flex items-start">
              <span className="text-lg mr-2 flex-shrink-0">
                {getMessageIcon(message.type)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium break-words">
                  {message.message}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp}
                </p>
                {message.details && (
                  <div className="mt-2 text-xs bg-white bg-opacity-10 rounded p-2 border border-white border-opacity-20 backdrop-blur-sm">
                    {message.details.txHash && (
                      <div><strong>Transaction:</strong> {message.details.txHash}</div>
                    )}
                    {message.details.fileHash && (
                      <div><strong>File Hash:</strong> {message.details.fileHash.substring(0, 16)}...</div>
                    )}
                    {message.details.fileName && (
                      <div><strong>File:</strong> {message.details.fileName}</div>
                    )}
                    {message.details.fileSize && (
                      <div><strong>Size:</strong> {message.details.fileSize}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {messages.length > 5 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-blue-100">
            Showing last {messages.length} messages. Scroll up to see older messages.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;
