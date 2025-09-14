import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBlockchain } from './BlockchainContext';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const { addProduceItem, updateProduceStatus, account, contract, rebateGasFees } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [razorpayKey, setRazorpayKey] = useState(process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY');

  // Initialize Razorpay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Load payment history from localStorage
    const savedHistory = localStorage.getItem('paymentHistory');
    if (savedHistory) {
      try {
        setPaymentHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing payment history:', error);
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Save payment history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  // Create payment order
  const createPaymentOrder = async (produceData, amount) => {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll create a mock order
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: orderId,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          produceName: produceData.name,
          farmerName: produceData.farmer,
          location: produceData.location,
          buyerAddress: account || '',
          blockchainHash: produceData.blockchainHash || ''
        }
      };
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order');
    }
  };

  // Process payment with Razorpay
  const processPayment = async (produceData, amount) => {
    setIsLoading(true);
    
    try {
      // Create payment order
      const order = await createPaymentOrder(produceData, amount);
      
      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'AgriChain',
        description: `Registration for ${produceData.name}`,
        order_id: order.id,
        handler: async (response) => {
          // Payment successful - add to blockchain
          await handlePaymentSuccess(response, produceData, order);
          
          // If blockchain contract is available, rebate gas fees
          if (contract && account) {
            try {
              await rebateGasFees(produceData.id, account);
            } catch (error) {
              console.error('Error rebating gas fees:', error);
            }
          }
        },
        prefill: {
          name: produceData.farmer,
          email: 'farmer@agrichain.in',
          contact: '+91XXXXXXXXXX'
        },
        theme: {
          color: '#4F46E5' // Indigo color to match UI
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
      throw new Error('Payment failed. Please try again.');
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResponse, produceData, order) => {
    try {
      // Create payment record
      const paymentRecord = {
        id: paymentResponse.razorpay_payment_id,
        orderId: order.id,
        amount: order.amount / 100, // Convert back from paise
        currency: order.currency,
        status: 'completed',
        timestamp: new Date().toISOString(),
        produceData: produceData,
        blockchainHash: null, // Will be set after blockchain transaction
        buyerAddress: account
      };

      // Add produce to blockchain
      const blockchainResult = await addProduceItem({
        ...produceData,
        paymentId: paymentRecord.id,
        orderId: order.id
      });

      // Update payment record with blockchain hash
      paymentRecord.blockchainHash = blockchainResult.blockchainHash;

      // Add to payment history
      setPaymentHistory(prev => [...prev, paymentRecord]);

      // Update produce status to 'Paid and Registered'
      await updateProduceStatus(
        blockchainResult.id, 
        'Paid and Registered', 
        produceData.location
      );

      setIsLoading(false);
      
      return {
        success: true,
        paymentId: paymentRecord.id,
        blockchainHash: paymentRecord.blockchainHash,
        message: 'Payment successful and produce registered on blockchain!'
      };

    } catch (error) {
      console.error('Error processing payment success:', error);
      setIsLoading(false);
      throw new Error('Payment successful but blockchain registration failed. Please contact support.');
    }
  };

  // Get payment history
  const getPaymentHistory = () => {
    return paymentHistory;
  };
  
  // Get payment history for a specific item
  const getItemPaymentHistory = (itemId) => {
    return paymentHistory.filter(payment => payment.produceData.id === itemId);
  };

  // Get payment history for the current user (buyer)
  const getUserPaymentHistory = () => {
    return paymentHistory.filter(payment => payment.buyerAddress === account);
  };

  // Verify payment (in real app, this would verify with Razorpay webhook)
  const verifyPayment = async (paymentId, orderId, signature) => {
    try {
      // In a real app, this would verify the payment signature
      // For demo purposes, we'll return true
      return true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  // Calculate total amount including fees
  const calculateTotalAmount = (baseAmount) => {
    const processingFee = baseAmount * 0.02; // 2% processing fee
    const gst = (baseAmount + processingFee) * 0.18; // 18% GST
    return {
      baseAmount: baseAmount,
      processingFee: processingFee,
      gst: gst,
      totalAmount: baseAmount + processingFee + gst
    };
  };

  const value = {
    isLoading,
    processPayment,
    getPaymentHistory,
    getItemPaymentHistory,
    getUserPaymentHistory,
    verifyPayment,
    calculateTotalAmount,
    paymentHistory
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
