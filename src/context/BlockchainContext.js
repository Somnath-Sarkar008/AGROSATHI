import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { AgriTrackerABI, AgriTrackerAddress } from '../contracts/AgriTracker';

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
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [produceItems, setProduceItems] = useState([]);
  const [ipfs, setIpfs] = useState(null);
  const [events, setEvents] = useState([]);
  const SEPOLIA_CHAIN_ID = 11155111;
  const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
  
  // Initialize IPFS client
  useEffect(() => {
    try {
      // Connect to a public IPFS gateway
      const ipfsClient = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: process.env.REACT_APP_INFURA_PROJECT_ID && process.env.REACT_APP_INFURA_API_SECRET ? 
            'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_API_SECRET).toString('base64') : ''
        }
      });
      setIpfs(ipfsClient);
      console.log('IPFS client initialized');
    } catch (error) {
      console.error('IPFS initialization error:', error);
      // Continue without IPFS if initialization fails
      console.log('Continuing without IPFS functionality');
    }
  }, []);

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
        
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let network = await provider.getNetwork();

        // Ensure we are on Sepolia
        if (network.chainId !== SEPOLIA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
            });
          } catch (switchError) {
            // If the chain has not been added to MetaMask
            if (switchError && switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: SEPOLIA_CHAIN_ID_HEX,
                    chainName: 'Sepolia',
                    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                  }]
                });
              } catch (addError) {
                console.error('Failed to add Sepolia network:', addError);
                throw addError;
              }
            } else {
              console.error('Failed to switch to Sepolia:', switchError);
              throw switchError;
            }
          }
          // Recreate provider after switching
          provider = new ethers.providers.Web3Provider(window.ethereum);
          network = await provider.getNetwork();
        }

        const signer = provider.getSigner();
        
        // Initialize contract
        const agriContract = new ethers.Contract(
          AgriTrackerAddress,
          AgriTrackerABI,
          signer
        );
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setContract(agriContract);
        setIsConnected(true);
        
        // Set up event listeners
        setupEventListeners(agriContract);
        
        return accounts[0];
      } else {
        alert('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };
  
  const setupEventListeners = (contract) => {
    // Listen for ItemUploaded events
    contract.on('ItemUploaded', (itemId, owner) => {
      console.log('Item uploaded:', itemId.toString(), owner);
      setEvents(prev => [...prev, {
        type: 'item_uploaded',
        itemId: itemId.toString(),
        owner,
        timestamp: new Date().toISOString()
      }]);
    });
    
    // Listen for ItemHistoryUpdated events
    contract.on('ItemHistoryUpdated', (itemId, status) => {
      console.log('Item history updated:', itemId.toString(), status);
      setEvents(prev => [...prev, {
        type: 'item_history_updated',
        itemId: itemId.toString(),
        status,
        timestamp: new Date().toISOString()
      }]);
    });
    
    // Listen for OwnershipTransferred events
    contract.on('OwnershipTransferred', (itemId, from, to) => {
      console.log('Ownership transferred:', itemId.toString(), from, to);
      setEvents(prev => [...prev, {
        type: 'ownership_transferred',
        itemId: itemId.toString(),
        from,
        to,
        timestamp: new Date().toISOString()
      }]);
    });
    
    // Listen for ItemBought events
    contract.on('ItemBought', (itemId, buyer, price) => {
      console.log('Item bought:', itemId.toString(), buyer, price.toString());
      setEvents(prev => [...prev, {
        type: 'item_bought',
        itemId: itemId.toString(),
        buyer,
        price: price.toString(),
        timestamp: new Date().toISOString()
      }]);
    });
    
    // Listen for GasFeeRebated events
    contract.on('GasFeeRebated', (user, amount) => {
      console.log('Gas fee rebated:', user, amount.toString());
      setEvents(prev => [...prev, {
        type: 'gas_fee_rebated',
        user,
        amount: amount.toString(),
        timestamp: new Date().toISOString()
      }]);
    });
  };

  // Upload image to IPFS
  const uploadToIPFS = async (file) => {
    try {
      if (!ipfs) {
        console.warn('IPFS client not initialized, using mock image URL');
        // Return a mock image URL if IPFS is not available
        return 'https://via.placeholder.com/300';
      }
      
      const added = await ipfs.add(file, {
        progress: (prog) => console.log(`Upload progress: ${prog}`)
      });
      
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('File uploaded to IPFS:', url);
      return url;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      // Return a placeholder image if there's an error
      return 'https://via.placeholder.com/300?text=Upload+Failed';
    }
  };
  
  // Store hashed price on IPFS
  const storeHashedPrice = async (price, itemId) => {
    try {
      if (!ipfs) {
        console.warn('IPFS client not initialized, using mock hash');
        // Return a mock hash if IPFS is not available
        return `ipfs-mock-hash-${Date.now()}`;
      }
      
      // Create a simple JSON object with the price data
      const priceData = JSON.stringify({
        price,
        itemId,
        timestamp: Date.now()
      });
      
      const added = await ipfs.add(Buffer.from(priceData));
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('Price data stored on IPFS:', url);
      return url;
    } catch (error) {
      console.error('Error storing price on IPFS:', error);
      // Return a mock hash if there's an error
      return `ipfs-error-hash-${Date.now()}`;
    }
  };

  const addProduceItem = async (produceData) => {
    try {
      console.log('Adding produce item:', produceData);
      
      // Upload image to IPFS if available
      let imageUrl = null;
      try {
        if (produceData.image) {
          imageUrl = await uploadToIPFS(produceData.image);
        }
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        imageUrl = 'https://via.placeholder.com/300?text=Upload+Failed';
      }
      
      // Store hashed price on IPFS
      const itemId = Date.now().toString();
      let priceHash;
      try {
        priceHash = await storeHashedPrice(produceData.price, itemId);
      } catch (priceHashError) {
        console.error('Price hash error:', priceHashError);
        priceHash = `mock-price-hash-${Date.now()}`;
      }
      
      // Interact with smart contract if connected
      let blockchainHash = '';
      let blockchainSuccess = false;
      
      if (contract && window.ethereum) {
        try {
          // Check if account is connected
          if (!account) {
            console.warn('No account connected, attempting to connect');
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            });
            if (accounts && accounts.length > 0) {
              console.log('Connected to account:', accounts[0]);
            } else {
              throw new Error('No accounts found');
            }
          }
          
          // Convert price to wei (assuming price is in ETH)
          const priceInWei = ethers.utils.parseEther(produceData.price.toString());
          const quantity = ethers.BigNumber.from(produceData.quantity || '1');
          
          console.log('Calling smart contract with params:', {
            name: produceData.name,
            location: produceData.location,
            price: priceInWei.toString(),
            quantity: quantity.toString(),
            unit: produceData.unit || 'kg',
            imageUrl: imageUrl || '',
            priceHash: priceHash
          });
          
          // Call smart contract to add produce item
          const tx = await contract.addProduceItem(
            produceData.name,
            produceData.location,
            priceInWei,
            quantity,
            produceData.unit || 'kg',
            imageUrl || '',
            priceHash
          );
          
          console.log('Transaction sent:', tx.hash);
          
          // Wait for transaction to be mined
          const receipt = await tx.wait();
          blockchainHash = receipt.transactionHash;
          blockchainSuccess = true;
          console.log('Transaction confirmed:', blockchainHash);
          
          // Get the item ID from the event
          const event = receipt.events.find(e => e.event === 'ItemUploaded');
          if (event) {
            const newItemId = event.args.itemId.toString();
            console.log('New item ID from blockchain:', newItemId);
          }
        } catch (error) {
          console.error('Smart contract interaction error:', error);
          // Continue with mock data if contract interaction fails
        }
      } else {
        console.warn('Contract or Ethereum provider not available, using mock data');
      }
      
      // Create item object (either from blockchain or mock)
      const newItem = {
        id: itemId,
        ...produceData,
        status: blockchainSuccess ? 'Registered on Blockchain' : 'Harvested', // Add default status
        blockchainHash: blockchainHash || `0x${Math.random().toString(16).substr(2, 8)}...`,
        qrCode: `https://example.com/qr/${Date.now()}`,
        imageUrl: imageUrl,
        priceHash: priceHash,
        history: [
          {
            action: blockchainSuccess ? 'Added to Blockchain' : 'Created (Pending Blockchain)',
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
      
      return { success: true, item: newItem };
      
      return newItem;
    } catch (error) {
      console.error('Error adding produce item:', error);
      throw error;
    }
  };

  const updateProduceStatus = async (itemId, newStatus, location) => {
    try {
      // Update status on blockchain if connected
      if (contract) {
        try {
          const tx = await contract.updateItemStatus(itemId, newStatus, location || '');
          await tx.wait();
          console.log('Status updated on blockchain');
        } catch (error) {
          console.error('Smart contract interaction error:', error);
          // Continue with local update if contract interaction fails
        }
      }
      
      // Update local state
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
  
  const transferOwnership = async (itemId, newOwner) => {
    try {
      if (!contract) {
        throw new Error('Blockchain not connected');
      }
      
      const tx = await contract.transferOwnership(itemId, newOwner);
      await tx.wait();
      console.log('Ownership transferred on blockchain');
      
      // Update local state
      setProduceItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            owner: newOwner,
            history: [
              ...item.history,
              {
                action: 'Ownership Transferred',
                timestamp: new Date().toISOString(),
                details: `New owner: ${newOwner}`
              }
            ]
          };
        }
        return item;
      }));
      
      return true;
    } catch (error) {
      console.error('Error transferring ownership:', error);
      throw error;
    }
  };
  
  const buyItem = async (itemId, price) => {
    try {
      if (!contract) {
        throw new Error('Blockchain not connected');
      }
      
      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(price.toString());
      
      const tx = await contract.buyItem(itemId, { value: priceInWei });
      await tx.wait();
      console.log('Item purchased on blockchain');
      
      // Update local state
      setProduceItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            owner: account, // Current user becomes the owner
            status: 'Sold',
            history: [
              ...item.history,
              {
                action: 'Purchased',
                timestamp: new Date().toISOString(),
                details: `Purchased for ${price} Sepolia ETH`
              }
            ]
          };
        }
        return item;
      }));
      
      return true;
    } catch (error) {
      console.error('Error buying item:', error);
      throw error;
    }
  };
  
  const rebateGasFees = async () => {
    try {
      if (!contract) {
        throw new Error('Blockchain not connected');
      }
      
      const tx = await contract.rebateGasFees();
      await tx.wait();
      console.log('Gas fees rebated');
      
      return true;
    } catch (error) {
      console.error('Error rebating gas fees:', error);
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
    contract,
    isConnected,
    produceItems,
    events,
    connectWallet,
    addProduceItem,
    updateProduceStatus,
    getProduceHistory,
    uploadToIPFS,
    storeHashedPrice,
    transferOwnership,
    buyItem,
    rebateGasFees,
    ipfs
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
