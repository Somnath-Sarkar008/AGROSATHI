import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { 
  Leaf, 
  Upload, 
  MapPin, 
  DollarSign, 
  Package,
  CheckCircle,
  AlertCircle,
  Image
} from 'lucide-react';

const AddProduce = () => {
  const navigate = useNavigate();
  const { addProduceItem, isConnected, uploadToIPFS } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    farmer: '',
    location: '',
    harvestDate: '',
    price: '',
    quality: 'Standard',
    description: '',
    quantity: '',
    unit: 'kg',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Wallet Not Connected</h2>
          <p className="text-yellow-700 mb-4">
            Please connect your wallet to add produce items.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await addProduceItem(formData);
      if (result && result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Failed to add produce item. Please try again.');
      }
    } catch (error) {
      console.error('Error adding produce item:', error);
      setError(error.message || 'Failed to add produce item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const qualityOptions = [
    { value: 'Premium', label: 'Premium - Highest quality, organic, certified' },
    { value: 'Standard', label: 'Standard - Good quality, conventional farming' },
    { value: 'Basic', label: 'Basic - Standard quality, mass production' }
  ];

  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'tons', label: 'Tons' },
    { value: 'pieces', label: 'Individual pieces' }
  ];

  if (showSuccess) {
    return (
      <div className="text-center py-20">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Success!</h2>
          <p className="text-green-700 mb-4">
            Your produce item has been successfully added to the blockchain.
          </p>
          <div className="text-sm text-green-600">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }
  
  // Error message display
  const ErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Produce</h1>
        <p className="text-gray-600">
          Register your agricultural produce on the blockchain for transparent tracking
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <ErrorMessage />
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={triggerFileInput}
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-48 h-48 object-cover rounded-lg mb-3" 
                  />
                  <span className="text-sm text-gray-500">Click to change image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Click to upload product image</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary-600" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Produce Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Tomatoes, Fresh Lettuce"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="farmer" className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer Name *
                </label>
                <input
                  type="text"
                  id="farmer"
                  name="farmer"
                  required
                  value={formData.farmer}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Location and Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Location & Timing
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., California, USA"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  required
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Quality and Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
              Quality & Pricing
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Grade *
                </label>
                <select
                  id="quality"
                  name="quality"
                  required
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {qualityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Unit *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quantity and Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary-600" />
              Quantity & Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min="0"
                      step="0.01"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Amount"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {unitOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about the produce..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Blockchain Registration
                </h4>
                <p className="text-sm text-blue-700">
                  Once submitted, this produce item will be permanently recorded on the blockchain. 
                  The information cannot be altered and will be accessible to all stakeholders in the supply chain.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding to Blockchain...' : 'Add to Blockchain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduce;
