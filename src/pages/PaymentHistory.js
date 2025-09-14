import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { useBlockchain } from '../context/BlockchainContext';
import { Calendar, CreditCard, User, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { paymentHistory, getUserPaymentHistory } = usePayment();
  const { account } = useBlockchain();
  const [userPayments, setUserPayments] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'pending'

  useEffect(() => {
    if (account) {
      const payments = getUserPaymentHistory();
      setUserPayments(payments);
    }
  }, [account, getUserPaymentHistory, paymentHistory]);

  const filteredPayments = () => {
    if (filter === 'recent') {
      // Get payments from last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return userPayments.filter(payment => new Date(payment.timestamp) >= lastWeek);
    } else if (filter === 'pending') {
      // Get payments that are pending blockchain confirmation
      return userPayments.filter(payment => !payment.blockchainConfirmed);
    }
    return userPayments;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to view your payment history.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h1>
        
        {/* Filter Controls */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            All Payments
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-lg ${filter === 'recent' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            Recent (7 days)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            Pending Confirmation
          </button>
        </div>
        
        {filteredPayments().length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Payments Found</h2>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't made any payments yet." 
                : filter === 'recent' 
                  ? "You haven't made any payments in the last 7 days." 
                  : "You don't have any pending payments."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments().map((payment, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Payment for {payment.item?.name || 'Product'}
                    </h3>
                  </div>
                  <div className="flex items-center">
                    {payment.blockchainConfirmed ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-start mb-2">
                      <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Seller</p>
                        <p className="text-gray-800">{payment.item?.farmer || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-2">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-800">{payment.item?.location || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="text-gray-800">{formatDate(payment.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start mb-2">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-2 mt-0.5">
                        <span className="text-lg font-semibold">₹</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-xl font-semibold text-gray-800">{formatCurrency(payment.amount)}</p>
                      </div>
                    </div>
                    
                    {payment.paymentId && (
                      <div className="flex items-start mb-2">
                        <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-2 mt-0.5">
                          <span className="text-xs">#</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment ID</p>
                          <p className="text-gray-800 text-sm font-mono">{payment.paymentId}</p>
                        </div>
                      </div>
                    )}
                    
                    {payment.blockchainHash && (
                      <div className="flex items-start">
                        <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-2 mt-0.5">
                          <span className="text-xs">Tx</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blockchain Hash</p>
                          <p className="text-gray-800 text-sm font-mono truncate">
                            {payment.blockchainHash.substring(0, 10)}...{payment.blockchainHash.substring(payment.blockchainHash.length - 8)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 flex justify-end">
                  <button
                    onClick={() => navigate(`/item/${payment.item?.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Item Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;