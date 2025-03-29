import React, { useEffect, useState } from "react";
import { json, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import './Success.css'

const Success = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams()
  const info = search.get("data")

  let decodedInfo = atob(info)
  let newInfo =   JSON .parse(decodedInfo)
  console.log(newInfo)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="success-container">
  <Confetti width={windowSize.width} height={windowSize.height} />

  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="success-message"
  >
    <motion.h1
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7 }}
    >
      ✅ Payment Successful!
    </motion.h1>

    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.7 }}
    >
      Thank you for your payment. Your transaction was successful.
    </motion.p>

    <motion.button
      onClick={() => navigate("/")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="success-button"
    >
      Go to Home 🏠
    </motion.button>
    <motion.button
      onClick={() => navigate("/myorders")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="order-button"
    >
      Check Your Order 🛍️
    </motion.button>
  </motion.div>
</div>

  );
};

export default Success;
