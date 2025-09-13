import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProduceTracking from './pages/ProduceTracking';
import AddProduce from './pages/AddProduce';
import QRScanner from './pages/QRScanner';
import { BlockchainProvider } from './context/BlockchainContext';

function App() {
  return (
    <BlockchainProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/track" element={<ProduceTracking />} />
              <Route path="/add-produce" element={<AddProduce />} />
              <Route path="/scan" element={<QRScanner />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BlockchainProvider>
  );
}

export default App;
