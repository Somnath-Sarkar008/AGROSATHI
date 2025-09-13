import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  IndianRupee,
  Lock,
  Zap
} from 'lucide-react';

const PaymentSection = ({ produceData, onPaymentSuccess, onPaymentFailure }) => {
  const { processPayment, calculateTotalAmount, isLoading } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const baseAmount = parseFloat(produceData.price || 0) * parseFloat(produceData.quantity || 0);
  const paymentBreakdown = calculateTotalAmount(baseAmount);

  const handlePayment = async () => {
    try {
      const result = await processPayment(produceData, paymentBreakdown.totalAmount);
      onPaymentSuccess(result);
    } catch (error) {
      onPaymentFailure(error.message);
    }
  };

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay Gateway',
      description: 'Secure payment with UPI, cards, net banking',
      icon: CreditCard,
      features: ['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Payment Method Selection */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-200 dark:border-slate-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CreditCard className="h-6 w-6 mr-2 text-green-600" />
          Payment Method
        </h3>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                paymentMethod === method.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-slate-600 hover:border-green-300'
              }`}
              onClick={() => setPaymentMethod(method.id)}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <method.icon className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {method.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Breakdown */}
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <IndianRupee className="h-6 w-6 mr-2 text-green-600" />
          Payment Breakdown
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
            <span className="text-gray-600 dark:text-gray-300">Base Amount</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ₹{paymentBreakdown.baseAmount.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
            <span className="text-gray-600 dark:text-gray-300">Processing Fee (2%)</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ₹{paymentBreakdown.processingFee.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
            <span className="text-gray-600 dark:text-gray-300">GST (18%)</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ₹{paymentBreakdown.gst.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-3">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
            <span className="text-xl font-bold text-green-600">
              ₹{paymentBreakdown.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Security & Blockchain Integration
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Secure Payment</h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                End-to-end encrypted transactions via Razorpay
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Blockchain Record</h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Payment automatically recorded on blockchain after success
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Button */}
      <motion.div
        className="text-center"
        variants={itemVariants}
      >
        <button
          onClick={handlePayment}
          disabled={isLoading || baseAmount <= 0}
          className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isLoading || baseAmount <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Pay ₹{paymentBreakdown.totalAmount.toFixed(2)}</span>
            </div>
          )}
        </button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          By proceeding, you agree to our terms and conditions
        </p>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                Payment processed successfully! Your produce is being registered on the blockchain.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentSection;
