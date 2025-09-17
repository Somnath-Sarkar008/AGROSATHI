# AgriBlock - Blockchain-Based Agricultural Produce Tracking System

A decentralized platform that enables transparent tracking of agricultural produce from farm to consumer using blockchain technology. This solution reduces fraud, ensures fair pricing, and provides complete supply chain transparency.

## 🌟 Features

### Core Functionality
- **Blockchain Integration**: Ethereum wallet connection for secure transactions
- **Produce Registration**: Farmers can add new produce items to the blockchain
- **Real-time Tracking**: Monitor produce movement through the supply chain
- **QR Code Generation**: Unique QR codes for each produce item
- **QR Code Scanner**: Mobile-friendly camera-based QR code scanning
- **Supply Chain History**: Complete audit trail of produce journey
- **Search & Filter**: Advanced search capabilities for produce items

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **Real-time Updates**: Live data updates and status changes
- **Interactive Dashboard**: Comprehensive overview with statistics and quick actions

### Security & Transparency
- **Immutable Records**: All data is permanently stored on the blockchain
- **Verifiable Transactions**: Every step is cryptographically verified
- **Stakeholder Access**: Farmers, distributors, and consumers can verify information
- **Audit Trail**: Complete history of all supply chain activities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with MetaMask extension (for blockchain features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agri-blockchain-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 📱 Usage

### For Farmers

1. **Connect Wallet**: Click "Connect Wallet" to link your Ethereum wallet
2. **Add Produce**: Navigate to "Add Produce" to register new agricultural items
3. **Fill Details**: Enter produce information including name, location, quality, and price
4. **Submit to Blockchain**: Confirm details and add to the blockchain
5. **Track Progress**: Monitor your produce through the supply chain

### For Consumers

1. **Scan QR Codes**: Use the QR scanner to access produce information
2. **Search Produce**: Manually search for specific produce items
3. **View Details**: Access complete supply chain history and verification
4. **Verify Authenticity**: Check blockchain hashes and farmer information

### For Distributors/Retailers

1. **Update Status**: Mark produce as packaged, in transit, or delivered
2. **Add Location**: Record current location and handling details
3. **Maintain Chain**: Ensure proper documentation of supply chain steps

## 🏗️ Architecture

### Frontend Technologies
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for single-page application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Beautiful, customizable icons
- **QRCode.react**: QR code generation and display

### Blockchain Integration
- **Ethers.js**: Ethereum library for blockchain interactions
- **MetaMask**: Web3 wallet integration
- **Smart Contracts**: Ready for Ethereum smart contract deployment

### State Management
- **React Context**: Global state management for blockchain data
- **Local Storage**: Persistent data storage for offline functionality
- **Real-time Updates**: Live data synchronization

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_CHAIN_ID=11155111
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
REACT_APP_CONTRACT_ADDRESS=YOUR_SEPOLIA_CONTRACT_ADDRESS
```

### Customization
- **Colors**: Modify `tailwind.config.js` for brand colors
- **Icons**: Replace Lucide icons with custom icon sets
- **Styling**: Customize CSS components in `src/index.css`

## 📊 Data Structure

### Produce Item Schema
```javascript
{
  id: "unique-identifier",
  name: "Produce Name",
  farmer: "Farmer Name",
  location: "Farm Location",
  harvestDate: "2024-01-15",
  price: "2.50",
  quality: "Premium|Standard|Basic",
  status: "Harvested|Packaged|In Transit|Delivered",
  blockchainHash: "0x...",
  qrCode: "https://...",
  history: [
    {
      action: "Harvested",
      timestamp: "2024-01-15T10:00:00Z",
      location: "Farm"
    }
  ]
}
```

## 🚀 Deployment

### Cloud Deployment
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Drag-and-drop deployment with form handling
- **AWS S3**: Static website hosting with CloudFront
- **Firebase**: Google's hosting platform with global CDN

### Low-Cost Hardware
- **Raspberry Pi**: Local deployment for small communities
- **Docker**: Containerized deployment for easy scaling
- **Nginx**: Lightweight web server for production use

## 🔒 Security Features

- **Wallet Authentication**: Secure blockchain wallet connection
- **Data Integrity**: Immutable blockchain records
- **Access Control**: Role-based permissions for different stakeholders
- **Audit Logging**: Complete transaction history tracking

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Community**: Join our community discussions and forums

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **IoT Integration**: Sensor data integration for real-time monitoring
- **AI Analytics**: Machine learning for supply chain optimization
- **Multi-chain Support**: Support for multiple blockchain networks
- **Advanced Analytics**: Comprehensive reporting and insights
- **API Integration**: RESTful API for third-party integrations

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: [your.email@example.com]
- **Website**: [https://your-website.com]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with ❤️ for transparent and fair agricultural supply chains**
