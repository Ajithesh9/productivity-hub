import React, { useState, useEffect } from "react";
import "./Quotes.css";

const quotesList = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
];

function Quotes() {
  const [quote, setQuote] = useState("");
  const [animate, setAnimate] = useState(false);

  const getNewQuote = () => {
    setAnimate(true);
    setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
    setTimeout(() => setAnimate(false), 500);
  };

  useEffect(() => {
    getNewQuote();
  }, []);

  return (
    <div className={`quotes ${animate ? "animate" : ""}`}>
      <p>{quote}</p>
      <button onClick={getNewQuote}>New Quote</button>
    </div>
  );
}

export default Quotes;
