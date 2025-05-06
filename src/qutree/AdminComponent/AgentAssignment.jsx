import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [scanner, setScanner] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Cleanup scanner on component unmount
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [scanner]);

  const handleScan = async (decodedText) => {
    try {
      setLoading(true);
      
      // Extract ID from URL
      const id = decodedText.split('/').pop();
      
      // First API call to get card details
      const response = await fetch(
        `http://192.168.30.243:9093/api/quicky_net/user-card-ids/${id}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch card details');
      
      const cardData = await response.json();
      const cardId = cardData.id;
      
      // Get agent ID from localStorage
      const selectedAgentId = localStorage.getItem('selectedAgentId');
      
      if (!selectedAgentId) {
        throw new Error('No agent ID found in localStorage');
      }

      // Second API call to assign card
      const assignResponse = await fetch(
        'http://192.168.30.243:9093/api/quicky_net/user-card-ids/assign',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardIds: [cardId],
            agentId: parseInt(selectedAgentId),
          }),
        }
      );

      if (!assignResponse.ok) throw new Error('Failed to assign card');

      setMessage('Card successfully assigned!');
      
      // Stop scanning after successful scan
      if (scanner) {
        await scanner.stop();
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      setMessage('');
      setLoading(true);

      const html5QrCode = new Html5Qrcode("reader");
      setScanner(html5QrCode);

      if (isMobile) {
        // Use back camera on mobile devices
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          handleScan,
          (error) => {
            console.warn(error);
          }
        );
      } else {
        // For desktop, show camera selection
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          await html5QrCode.start(
            devices[0].id,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            handleScan,
            (error) => {
              console.warn(error);
            }
          );
        } else {
          throw new Error('No camera devices found');
        }
      }
    } catch (err) {
      setMessage('Failed to start camera: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      await scanner.stop();
      setScanner(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>

      <div id="reader" className="w-full mb-4" />

      {!scanner && !loading && (
        <button 
          onClick={startScanning}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          Start Scanning
        </button>
      )}

      {scanner && (
        <button 
          onClick={stopScanning}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-4"
        >
          Stop Scanning
        </button>
      )}

      {loading && (
        <div className="text-center p-4">
          Processing...
        </div>
      )}

      {message && (
        <div className={`mt-4 p-4 rounded ${
          message.includes('success') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QRScanner;