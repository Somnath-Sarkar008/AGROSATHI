import React from 'react';
import { Link } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { 
  Leaf, 
  Shield, 
  TrendingUp, 
  Users, 
  Globe, 
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { isConnected } = useBlockchain();

  const features = [
    {
      icon: Shield,
      title: 'Transparent Tracking',
      description: 'Every step of your produce journey is recorded on the blockchain, ensuring complete transparency and traceability.'
    },
    {
      icon: TrendingUp,
      title: 'Fair Pricing',
      description: 'Eliminate middlemen exploitation with direct blockchain-based pricing that benefits both farmers and consumers.'
    },
    {
      icon: Users,
      title: 'Stakeholder Verification',
      description: 'Farmers, distributors, and retailers can verify transactions and maintain trust throughout the supply chain.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access produce information from anywhere in the world with our decentralized platform.'
    }
  ];

  const stats = [
    { label: 'Produce Items Tracked', value: '1,234+' },
    { label: 'Farmers Registered', value: '567+' },
    { label: 'Countries Served', value: '25+' },
    { label: 'Transactions Verified', value: '89,012+' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <Leaf className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Farm to Consumer
            <span className="text-primary-600 block">Blockchain Tracking</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionize agricultural supply chains with transparent, secure, and fair blockchain-based tracking. 
            From harvest to your table, every step is verified and recorded.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <Link to="/add-produce" className="btn-primary text-lg px-8 py-3">
                Start Tracking Produce
              </Link>
            ) : (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            )}
            <Link to="/track" className="btn-secondary text-lg px-8 py-3">
              Track Existing Produce
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AgriBlock?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain solution provides unprecedented transparency and security in agricultural supply chains.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple steps to transparent produce tracking
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Register Produce</h3>
            <p className="text-gray-600">Farmers add produce details to the blockchain with location, quality, and pricing information.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Journey</h3>
            <p className="text-gray-600">Monitor produce movement through the supply chain with real-time updates and verification.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consumer Access</h3>
            <p className="text-gray-600">Consumers scan QR codes to access complete produce history and verify authenticity.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-primary-100 text-lg">
            Join thousands of farmers and consumers already using AgriBlock
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gray-50 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Supply Chain?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join the blockchain revolution in agriculture. Ensure transparency, 
          reduce fraud, and build trust with consumers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/add-produce" className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2">
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/track" className="btn-secondary text-lg px-8 py-3">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
