# Razorpay Payment Gateway Setup

This guide will help you set up the Razorpay payment gateway integration with your AgriBlock application.

## 🚀 **Quick Setup**

### 1. **Get Razorpay API Keys**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Navigate to **Settings** → **API Keys**
4. Generate a new key pair
5. Copy your **Key ID** and **Key Secret**

### 2. **Environment Configuration**

Create a `.env` file in your project root:

```bash
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
REACT_APP_RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET

# For Production, use live keys:
# REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
# REACT_APP_RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
```

### 3. **Test Mode vs Production**

- **Test Mode**: Use `rzp_test_` keys for development and testing
- **Production Mode**: Use `rzp_live_` keys for live transactions

## 💳 **Payment Flow**

### **1. User Journey**
```
Fill Form → Validate Data → Show Payment → Razorpay Gateway → Payment Success → Blockchain Registration
```

### **2. Payment Process**
1. **Form Submission**: User fills produce details
2. **Payment Calculation**: System calculates total amount (base + fees + GST)
3. **Razorpay Integration**: Opens secure payment modal
4. **Payment Processing**: User completes payment via UPI/cards/net banking
5. **Success Handling**: Payment verified and produce added to blockchain
6. **Blockchain Record**: Transaction hash generated and stored

### **3. Fee Structure**
- **Base Amount**: Price × Quantity
- **Processing Fee**: 2% of base amount
- **GST**: 18% of (base + processing fee)
- **Total**: Base + Processing Fee + GST

## 🔧 **Technical Implementation**

### **Components Created**
- `PaymentContext.js` - Payment state management
- `PaymentSection.js` - Payment UI and flow
- `PaymentHistory.js` - Transaction history display

### **Key Features**
- **Secure Payment**: End-to-end encryption via Razorpay
- **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets
- **Blockchain Integration**: Automatic registration after payment
- **Transaction History**: Complete payment records with blockchain hashes
- **Receipt Generation**: Downloadable payment receipts

### **Payment Context Methods**
```javascript
const {
  processPayment,           // Initiate payment
  getPaymentHistory,        // Get transaction history
  verifyPayment,           // Verify payment signature
  calculateTotalAmount,    // Calculate fees and total
  isLoading,               // Payment processing state
  paymentHistory           // Array of all transactions
} = usePayment();
```

## 🛡️ **Security Features**

### **1. Payment Security**
- **PCI DSS Compliant**: Razorpay handles sensitive card data
- **Encrypted Communication**: All API calls use HTTPS
- **Signature Verification**: Payment authenticity verification
- **Fraud Detection**: Built-in fraud prevention systems

### **2. Blockchain Security**
- **Immutable Records**: Payment data permanently stored
- **Hash Verification**: Cryptographic proof of transactions
- **Transparent Audit**: All stakeholders can verify payments
- **No Data Tampering**: Blockchain prevents modification

## 📱 **User Experience**

### **1. Payment Interface**
- **Clean Design**: Modern, intuitive payment flow
- **Real-time Updates**: Live payment status updates
- **Error Handling**: Clear error messages and recovery
- **Mobile Optimized**: Responsive design for all devices

### **2. Payment Methods**
- **UPI**: Instant bank transfers
- **Credit/Debit Cards**: All major card networks
- **Net Banking**: 50+ Indian banks
- **Digital Wallets**: Paytm, PhonePe, etc.

## 🔍 **Testing**

### **1. Test Cards**
Use these test card numbers for development:

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

### **2. Test UPI**
```
UPI ID: success@razorpay
Amount: Any amount
```

### **3. Test Scenarios**
- Successful payment
- Failed payment
- Cancelled payment
- Network errors
- Invalid amounts

## 📊 **Monitoring & Analytics**

### **1. Razorpay Dashboard**
- **Transaction History**: All payment attempts
- **Success Rates**: Payment completion statistics
- **Revenue Analytics**: Detailed financial reports
- **Customer Insights**: Payment behavior analysis

### **2. Blockchain Explorer**
- **Transaction Hashes**: Verify blockchain records
- **Payment Proof**: Immutable transaction evidence
- **Audit Trail**: Complete payment history
- **Stakeholder Access**: Transparent verification

## 🚨 **Common Issues & Solutions**

### **1. Payment Failed**
- Check API key configuration
- Verify amount format (paise for Razorpay)
- Ensure proper error handling
- Check network connectivity

### **2. Blockchain Registration Failed**
- Verify payment success callback
- Check blockchain network status
- Ensure proper error recovery
- Monitor transaction gas fees

### **3. UI Not Loading**
- Check Razorpay script loading
- Verify component imports
- Check for JavaScript errors
- Ensure proper state management

## 🔮 **Future Enhancements**

### **1. Advanced Features**
- **Recurring Payments**: Subscription-based registration
- **Bulk Payments**: Multiple produce items
- **Payment Plans**: Installment options
- **International Payments**: Multi-currency support

### **2. Integration Options**
- **Webhook Support**: Real-time payment notifications
- **API Endpoints**: Custom payment flows
- **Mobile SDK**: Native app integration
- **Analytics API**: Custom reporting

## 📞 **Support**

### **1. Razorpay Support**
- **Documentation**: [docs.razorpay.com](https://docs.razorpay.com/)
- **Support Email**: support@razorpay.com
- **Developer Community**: [GitHub](https://github.com/razorpay)

### **2. AgriBlock Support**
- **Documentation**: Check project README
- **Issues**: GitHub Issues page
- **Community**: Project discussions

---

**Note**: This integration is for demonstration purposes. For production use, ensure proper security measures, webhook verification, and compliance with financial regulations.
