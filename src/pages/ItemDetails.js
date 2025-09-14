import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { usePayment } from '../context/PaymentContext';
import { Calendar, MapPin, User, Tag, Clock, ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode.react';
import { ethers } from 'ethers';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { produceItems, contract, account } = useBlockchain();
  const { processPayment, getItemPaymentHistory } = usePayment();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        // Find item in local state
        const foundItem = produceItems.find(item => item.id === id);
        
        if (!foundItem) {
          setError('Item not found');
          setLoading(false);
          return;
        }
        
        setItem(foundItem);
        
        // Get payment history for this item
        const history = getItemPaymentHistory(id);
        setPaymentHistory(history);
        
        // Verify on blockchain if contract is available
        if (contract) {
          try {
            const onChainData = await contract.getItemDetails(id);
            const verified = onChainData && onChainData.blockchainHash === foundItem.blockchainHash;
            setVerificationStatus({
              verified,
              onChainOwner: onChainData ? onChainData.owner : null,
              onChainStatus: onChainData ? onChainData.status : null
            });
          } catch (error) {
            console.error('Error verifying on blockchain:', error);
            setVerificationStatus({
              verified: false,
              error: 'Could not verify on blockchain'
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('Error loading item details');
        setLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [id, produceItems, contract, getItemPaymentHistory]);

  const handleBuyItem = async () => {
    if (!item) return;
    
    try {
      await processPayment(item, item.price);
      
      // If payment successful and contract is available, buy the item on blockchain
      if (contract && account) {
        try {
          await contract.buyItem(item.id, { value: ethers.utils.parseEther(item.price) });
          alert('Item purchased successfully!');
          // Update local state
          setItem(prev => ({
            ...prev,
            status: 'Sold',
            owner: account
          }));
        } catch (error) {
          console.error('Error buying item on blockchain:', error);
          alert('Payment processed but blockchain transaction failed. Please contact support.');
        }
      } else {
        alert('Item purchased successfully!');
        // Update local state
        setItem(prev => ({
          ...prev,
          status: 'Sold'
        }));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Item Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
              
              {verificationStatus && (
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {verificationStatus.verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified on Blockchain
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Not Verified
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Item Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Farmer</p>
                    <p className="text-gray-800">{item.farmer}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800">{item.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Harvest Date</p>
                    <p className="text-gray-800">{formatDate(item.harvestDate || new Date())}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Quality</p>
                    <p className="text-gray-800">{item.quality || 'Premium'}</p>
                  </div>
                </div>
              </div>
              
              {item.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Item History</h3>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-800">
                            <span className="font-medium">Payment</span> - {formatDate(payment.timestamp)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Amount: ₹{payment.amount} | Transaction ID: {payment.paymentId?.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No transaction history available</p>
                )}
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-gray-800">₹{item.price}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`text-lg font-semibold ${item.status === 'Available' ? 'text-green-600' : 'text-gray-600'}`}>
                    {item.status || 'Available'}
                  </p>
                </div>
                
                {item.status !== 'Sold' && (
                  <button
                    onClick={handleBuyItem}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now
                  </button>
                )}
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Verification QR Code</p>
                  <div className="bg-white p-4 rounded-lg flex justify-center">
                    <QRCode 
                      value={JSON.stringify({
                        id: item.id,
                        name: item.name,
                        farmer: item.farmer,
                        blockchainHash: item.blockchainHash,
                        timestamp: new Date().toISOString(),
                        verified: verificationStatus?.verified || false
                      })} 
                      size={150} 
                      level="H" 
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Scan to verify authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;