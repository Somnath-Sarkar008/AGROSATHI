import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProduceTracking from './pages/ProduceTracking';
import AddProduce from './pages/AddProduce';
import QRScanner from './pages/QRScanner';
import PaymentHistory from './pages/PaymentHistory';
import ItemDetails from './pages/ItemDetails';
import { BlockchainProvider } from './context/BlockchainContext';
import { PaymentProvider } from './context/PaymentContext';

function App() {
  return (
    <BlockchainProvider>
      <PaymentProvider>
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
                <Route path="/payments" element={<PaymentHistory />} />
                <Route path="/item/:id" element={<ItemDetails />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PaymentProvider>
    </BlockchainProvider>
  );
}

export default App;
