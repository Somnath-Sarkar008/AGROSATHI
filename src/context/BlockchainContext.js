import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [produceItems, setProduceItems] = useState([]);

  // Mock data for demonstration
  const mockProduceItems = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      farmer: 'John Smith',
      location: 'California, USA',
      harvestDate: '2024-01-15',
      price: '2.50',
      quality: 'Premium',
      status: 'Harvested',
      blockchainHash: '0x1234...5678',
      qrCode: 'https://example.com/qr/1',
      history: [
        { action: 'Harvested', timestamp: '2024-01-15T10:00:00Z', location: 'Farm' },
        { action: 'Packaged', timestamp: '2024-01-16T14:00:00Z', location: 'Packaging Facility' },
        { action: 'Shipped', timestamp: '2024-01-17T09:00:00Z', location: 'Distribution Center' }
      ]
    },
    {
      id: '2',
      name: 'Fresh Lettuce',
      farmer: 'Maria Garcia',
      location: 'Texas, USA',
      harvestDate: '2024-01-14',
      price: '1.80',
      quality: 'Standard',
      status: 'In Transit',
      blockchainHash: '0x8765...4321',
      qrCode: 'https://example.com/qr/2',
      history: [
        { action: 'Harvested', timestamp: '2024-01-14T08:00:00Z', location: 'Farm' },
        { action: 'Packaged', timestamp: '2024-01-15T12:00:00Z', location: 'Packaging Facility' }
      ]
    }
  ];

  useEffect(() => {
    setProduceItems(mockProduceItems);
  }, []); // Remove mockProduceItems dependency to prevent infinite re-renders

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
        
        return accounts[0];
      } else {
        alert('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const addProduceItem = async (produceData) => {
    try {
      console.log('Adding produce item:', produceData);
      
      // In a real app, this would interact with smart contracts
      const newItem = {
        id: Date.now().toString(),
        ...produceData,
        status: 'Harvested', // Add default status
        blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        qrCode: `https://example.com/qr/${Date.now()}`,
        history: [
          {
            action: 'Added to Blockchain',
            timestamp: new Date().toISOString(),
            location: produceData.location
          }
        ]
      };
      
      console.log('New item created:', newItem);
      
      setProduceItems(prev => {
        const updated = [...prev, newItem];
        console.log('Updated produce items:', updated);
        return updated;
      });
      
      return newItem;
    } catch (error) {
      console.error('Error adding produce item:', error);
      throw error;
    }
  };

  const updateProduceStatus = async (itemId, newStatus, location) => {
    try {
      setProduceItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            history: [
              ...item.history,
              {
                action: newStatus,
                timestamp: new Date().toISOString(),
                location: location
              }
            ]
          };
        }
        return item;
      }));
    } catch (error) {
      console.error('Error updating produce status:', error);
      throw error;
    }
  };

  const getProduceHistory = (itemId) => {
    const item = produceItems.find(item => item.id === itemId);
    return item ? item.history : [];
  };

  const value = {
    account,
    provider,
    signer,
    isConnected,
    produceItems,
    connectWallet,
    addProduceItem,
    updateProduceStatus,
    getProduceHistory
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
