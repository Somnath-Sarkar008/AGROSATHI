import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { usePayment } from '../context/PaymentContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package, 
  User,
  Leaf,
  Clock,
  CheckCircle,
  Truck,
  Home,
  Factory,
  Store,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import QRCode from 'qrcode.react';

const ProduceTracking = () => {
  const [searchParams] = useSearchParams();
  const { produceItems, getProduceHistory } = useBlockchain();
  const { getItemPaymentHistory } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [itemHistory, setItemHistory] = useState([]);

  // Check if there's a specific item ID in the URL
  useEffect(() => {
    const itemId = searchParams.get('id');
    if (itemId) {
      const item = produceItems.find(item => item.id === itemId);
      if (item) {
        setSelectedItem(item);
        setSearchTerm(item.name);
        
        // Get payment history for this item
        const payments = getItemPaymentHistory(itemId);
        setPaymentHistory(payments);

        // Fetch on-chain history
        (async () => {
          try {
            const history = await getProduceHistory(itemId);
            setItemHistory(Array.isArray(history) ? history : []);
          } catch (e) {
            setItemHistory([]);
          }
        })();
      }
    }
  }, [searchParams, produceItems, getItemPaymentHistory]);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(produceItems);
    } else {
      const filtered = produceItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, produceItems]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Harvested': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'Packaged': return <Package className="h-5 w-5 text-yellow-600" />;
      case 'In Transit': return <Truck className="h-5 w-5 text-blue-600" />;
      case 'Delivered': return <CheckCircle className="h-5 w-5 text-gray-600" />;
      case 'Paid and Registered': return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'Sold': return <ShoppingCart className="h-5 w-5 text-indigo-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Harvested': return 'bg-green-100 text-green-800';
      case 'Packaged': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-gray-100 text-gray-800';
      case 'Paid and Registered': return 'bg-purple-100 text-purple-800';
      case 'Sold': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (action) => {
    if (action.includes('Farm')) return <Home className="h-4 w-4" />;
    if (action.includes('Packaging')) return <Factory className="h-4 w-4" />;
    if (action.includes('Distribution')) return <Truck className="h-4 w-4" />;
    if (action.includes('Store')) return <Store className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    
    // Get payment history for this item
    const payments = getItemPaymentHistory(item.id);
    setPaymentHistory(payments);

    // Fetch on-chain history
    (async () => {
      try {
        const history = await getProduceHistory(item.id);
        setItemHistory(Array.isArray(history) ? history : []);
      } catch (e) {
        setItemHistory([]);
      }
    })();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (filteredItems.length > 0) {
      setSelectedItem(filteredItems[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Produce</h1>
        <p className="text-gray-600">
          Search and track agricultural produce from farm to consumer
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Search and Results Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Form */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Produce</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by name, farmer, or location
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    placeholder="e.g., Tomatoes, John Smith, California"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                Search
              </button>
            </form>
          </div>

          {/* Search Results */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Results ({filteredItems.length})
            </h3>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No produce items found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      selectedItem?.id === item.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {item.farmer}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Produce Details Panel */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                        {getStatusIcon(selectedItem.status)} {selectedItem.status}
                      </span>
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {selectedItem.quality}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">${selectedItem.price}</div>
                    <div className="text-sm text-gray-500">per unit</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Farmer</div>
                        <div className="text-sm text-gray-600">{selectedItem.farmer}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{selectedItem.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Harvest Date</div>
                        <div className="text-sm text-gray-600">{formatDate(selectedItem.harvestDate)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Quality Grade</div>
                        <div className="text-sm text-gray-600">{selectedItem.quality}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Blockchain Hash</div>
                        <div className="text-sm text-gray-600 font-mono">{selectedItem.blockchainHash}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg inline-block border">
                    <QRCode value={selectedItem.qrCode || JSON.stringify({ id: selectedItem.id })} size={180} />
                  </div>
                  <div className="mt-3 mx-auto max-w-sm">
                    <div className="text-xs text-gray-600 font-mono bg-gray-50 border rounded p-2 break-all">
                      {selectedItem.qrCode || JSON.stringify({ id: selectedItem.id })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan this QR code to access produce information
                  </p>
                </div>
              </div>

              {/* Supply Chain History */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain History</h3>
                <div className="space-y-4">
                  {(itemHistory || []).map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getLocationIcon(event.action)}
                          <span className="text-sm font-medium text-gray-900">{event.action}</span>
                        </div>
                        {event.location && <div className="text-sm text-gray-600">{event.location}</div>}
                        {event.timestamp && <div className="text-xs text-gray-500">{formatDate(event.timestamp)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment History */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                {paymentHistory && paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{payment.type}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {payment.status}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                          <div className="text-sm text-gray-600">Transaction ID: {payment.transactionId}</div>
                          <div className="text-xs text-gray-500">{formatDate(payment.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No payment records found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center py-20">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Produce</h3>
              <p className="text-gray-500">
                Use the search panel to find and track agricultural produce items
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProduceTracking;
