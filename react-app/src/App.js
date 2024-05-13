import React from 'react';
import { Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar'
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import SizeChartPage from "./pages/SizeChartPage";
import ContactPage from "./pages/ContactPage";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
import OrderPage from "./pages/OrderPage";
function App() {
  return (
      <div className="App">
        <NavBar/>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/shop/:page" element={<ShopPage />} />
            <Route path="/profile" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/sizes" element={<SizeChartPage />} />
            <Route path="/contacts" element={<ContactPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/orders" element={<OrderPage />} />
        </Routes>


      </div>
  );
}

export default App;
