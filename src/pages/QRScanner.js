import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import QrScanner from 'qr-scanner';
import QRCode from 'qrcode.react';
import { 
  Camera, 
  QrCode as QrCodeIcon, 
  Search, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';

const QRScanner = () => {
  const navigate = useNavigate();
  const { produceItems } = useBlockchain();
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [error, setError] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Request camera permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            console.log('QR Code detected:', result.data);
            handleQRCodeScanned(result.data);
          },
          {
            onDecodeError: (error) => {
              // Ignore decode errors, they're common during scanning
              console.log('Decode error (normal during scanning):', error);
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment',
            maxScansPerSecond: 5,
          }
        );
        
        await qrScannerRef.current.start();
        console.log('QR Scanner started successfully');
      }
      
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      let errorMessage = 'Camera access denied. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions in your browser settings and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this device.';
      } else {
        errorMessage += 'Please try again or use manual search instead.';
      }
      
      setError(errorMessage);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const handleQRCodeScanned = (data) => {
    console.log('Processing QR code data:', data);
    stopScanning();
    
    // Find the produce item based on QR code data
    const item = produceItems.find(item => 
      item.qrCode === data || 
      item.id === data || 
      item.blockchainHash.includes(data)
    );
    
    if (item) {
      console.log('Found matching item:', item);
      setScannedItem(item);
      setError(null);
    } else {
      console.log('No matching item found for QR data:', data);
      setError(`QR code not recognized: "${data}". Please try a different code or use manual search.`);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      // Search for produce by name, ID, or blockchain hash
      const item = produceItems.find(item => 
        item.id === manualInput ||
        item.name.toLowerCase().includes(manualInput.toLowerCase()) ||
        item.blockchainHash.includes(manualInput)
      );
      
      if (item) {
        setScannedItem(item);
        setError(null);
      } else {
        setError('No produce item found with the provided information.');
      }
    }
  };

  const resetScanner = () => {
    setScannedItem(null);
    setError(null);
    setManualInput('');
    stopScanning();
  };

  const downloadQRCode = () => {
    if (scannedItem) {
      // In a real app, you'd generate and download the QR code
      alert('QR code download feature would be implemented here');
    }
  };

  const shareProduceInfo = () => {
    if (scannedItem && navigator.share) {
      navigator.share({
        title: `Track ${scannedItem.name}`,
        text: `Check out this ${scannedItem.name} from ${scannedItem.farmer}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Track ${scannedItem.name} from ${scannedItem.farmer} at ${window.location.href}`
      );
      alert('Produce information copied to clipboard!');
    }
  };

  if (scannedItem) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={resetScanner}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Scan Another Code
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">Produce Found!</h1>
            <p className="text-gray-600">QR Code successfully scanned</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">QR Code Scanned Successfully</h3>
              <p className="text-green-700">
                Produce information retrieved from the blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Produce Information */}
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{scannedItem.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {scannedItem.status}
                </span>
                <span className="text-gray-500">•</span>
                <span>{scannedItem.quality}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">${scannedItem.price}</div>
              <div className="text-sm text-gray-500">per unit</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Farmer</div>
                  <div className="text-sm text-gray-600">{scannedItem.farmer}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Location</div>
                  <div className="text-sm text-gray-600">{scannedItem.location}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Harvest Date</div>
                  <div className="text-sm text-gray-600">
                    {new Date(scannedItem.harvestDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Blockchain Hash</div>
                  <div className="text-sm text-gray-600 font-mono">{scannedItem.blockchainHash}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">QR Code</div>
                  <div className="text-sm text-gray-600">{scannedItem.qrCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/track?id=${scannedItem.id}`)}
              className="btn-primary flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              View Full Details
            </button>
            <button
              onClick={downloadQRCode}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </button>
            <button
              onClick={shareProduceInfo}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCodeIcon className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">
          Scan QR codes to instantly access produce information from the blockchain
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Scanner</h3>
            
            {!scanning ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Click the button below to start scanning QR codes
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Make sure to allow camera permissions when prompted
                </p>
                <button
                  onClick={startScanning}
                  className="btn-primary flex items-center mx-auto"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </button>
                <div className="mt-4 text-xs text-gray-400">
                  💡 If camera doesn't work, use the test buttons or manual search below
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-white border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
                      <QrCodeIcon className="h-12 w-12 text-white opacity-50" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={stopScanning}
                  className="btn-secondary w-full"
                >
                  Stop Scanning
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <span className="text-red-700 font-medium">Error:</span>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    <p className="text-red-600 text-xs mt-2">
                      💡 Try using the "Test Scan" buttons above or manual search instead.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {scanning && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700">Scanning for QR codes... Point camera at a QR code</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual Input Section */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Search</h3>
            <p className="text-gray-600 mb-4">
              Can't scan? Enter produce details manually to find information
            </p>
            
            <form onSubmit={handleManualSearch} className="space-y-4">
              <div>
                <label htmlFor="manualInput" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by ID, Name, or Hash
                </label>
                <input
                  type="text"
                  id="manualInput"
                  placeholder="e.g., 1, Tomatoes, 0x1234..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Search Produce
              </button>
            </form>
          </div>

          {/* Test QR Codes */}
          <div className="card bg-green-50 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Test QR Codes</h3>
            <p className="text-sm text-green-800 mb-4">
              Use these test QR codes to try the scanner:
            </p>
            <div className="space-y-3">
              {produceItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <QRCode value={item.qrCode} size={40} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.id}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQRCodeScanned(item.qrCode)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 border border-green-300 rounded hover:bg-green-50"
                  >
                    Test Scan
                  </button>
                </div>
              ))}
            </div>
            
            {/* Large QR Code for Real Scanning */}
            <div className="mt-6 p-4 bg-white rounded border text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Scan This QR Code with Camera</h4>
              <div className="flex justify-center">
                <QRCode value={produceItems[0]?.qrCode || 'https://example.com/qr/1'} size={150} />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Point your camera at this QR code to test real scanning
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                <span>Point your camera at a QR code on produce packaging</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                <span>Or manually search using produce details</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                <span>Use the test buttons above to try the scanner</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Scan QR Codes?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Instant access to produce information</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Verify authenticity and origin</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Track supply chain journey</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Ensure fair pricing transparency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
