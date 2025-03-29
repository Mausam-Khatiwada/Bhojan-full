import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import './Failure.css'

const Failure = () => {
  const navigate = useNavigate();
  return (
    <div className="failure-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="failure-message"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="failure-header"
        >
          ❌ Payment Failed!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="failure-description"
        >
          Something went wrong. Please try again or contact support.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/")}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="failure-button"
        >
          Return to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Failure;
