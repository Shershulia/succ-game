import React from "react";
import { motion } from "framer-motion";
import "./Card.css";

const Card = ({ value, suit, index }) => {
  const suitImageUrl = `/images/${suit}.png`; // Путь к картинке в public/images
  const textColor = suit.includes("red") ? "#fe2bcc" : "black";

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
    >
      <span className="card-value" style={{ color: textColor }}>{value}</span>
      <img src={suitImageUrl} alt={suit} className="card-suit" />
    </motion.div>
  );
};

export default Card;
