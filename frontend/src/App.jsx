import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Navbar from "./components/Navbar/Navbar";
import Payment from "./components/Payment/Payment";
import Success from "./components/Payment/Success";
import Failure from "./components/Payment/Failure";
import MyOrders from "./pages/MyOrders/MyOrders";


const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const isCartPage = location.pathname === '/cart';
  
  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {!isCartPage && <Navbar setShowLogin={setShowLogin} />}

      <div className="App">
        <Routes>
          <Route path="/" element={<Home setShowLogin={setShowLogin} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/myorders" element={<MyOrders/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
