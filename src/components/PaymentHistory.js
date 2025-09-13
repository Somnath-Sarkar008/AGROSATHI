import React from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import { useTheme } from '../context/ThemeContext';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  IndianRupee,
  Hash
} from 'lucide-react';

const PaymentHistory = () => {
  const { paymentHistory } = usePayment();
  const { isDark } = useTheme();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (paymentHistory.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Payment History
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your payment transactions will appear here once you register produce items.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment History
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {paymentHistory.length} transaction{paymentHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {paymentHistory.map((payment, index) => (
          <motion.div
            key={payment.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 ${
              isDark ? 'hover:border-slate-600' : 'hover:border-gray-300'
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(payment.status)}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {payment.produceData.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {payment.produceData.farmer} • {payment.produceData.location}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ₹{payment.amount.toFixed(2)}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Payment ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {payment.id}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {payment.orderId}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(payment.timestamp)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Currency:</span>
                  <span className="text-gray-900 dark:text-white">
                    {payment.currency}
                  </span>
                </div>
                
                {payment.blockchainHash && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Hash className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Blockchain Hash:</span>
                    <span className="font-mono text-green-600 text-xs">
                      {payment.blockchainHash.slice(0, 10)}...{payment.blockchainHash.slice(-8)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                  <span className="text-gray-900 dark:text-white">
                    {payment.produceData.quantity} {payment.produceData.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Produce Details */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Produce Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Quality:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {payment.produceData.quality}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Price/Unit:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    ₹{payment.produceData.price}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Harvest Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(payment.produceData.harvestDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="ml-2 text-green-600 font-medium">
                    Paid & Registered
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              {payment.blockchainHash && (
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200"
                  onClick={() => {
                    // In a real app, this would open blockchain explorer
                    alert(`Blockchain Hash: ${payment.blockchainHash}`);
                  }}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  View on Blockchain
                </button>
              )}
              
              <button
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                onClick={() => {
                  // In a real app, this would download receipt
                  alert('Receipt download feature coming soon!');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PaymentHistory;
