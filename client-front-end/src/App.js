import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/Login';
import ProductManager from './Pages/ProductManager';

function App() {
  return (
    // <div>
    //   <ProductList />
    // </div>
     <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/products" element={<ProductManager />} />
      </Routes>
    </Router>
  );
}

export default App;
