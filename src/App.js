import React, { useState, useEffect } from "react";
import "./App.css";
import { Card } from "./components";

const suits = ["crab_black", "crab_red", "succ_red", "succ_black"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateScore = (hand) => {
  let score = 0;
  let aceCount = 0;
  
  hand.forEach(({ value }) => {
    if (value === "A") {
      aceCount += 1;
      score += 11;
    } else if (["J", "Q", "K"].includes(value)) {
      score += 10;
    } else {
      score += parseInt(value);
    }
  });

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }
  return score;
};

function App() {
  const [deck, setDeck] = useState([]);
  const [isHit, setIsHit] = useState(false);
  const [isStand, setIsStand] = useState(false);

  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(50);

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const dealInitialCards = () => {
    setBalance(balance - bet);
    setGameOver(false);
    setIsHit(false);
    setIsStand(false);
    setShowOverlay(false);
    let newDeck = [...deck];
    setPlayerHand([newDeck.pop(), newDeck.pop()]);
    setDealerHand([newDeck.pop(), newDeck.pop()]);
    setDeck(newDeck);
  };

  const hit = () => {
    setIsHit(true);
    if (!gameOver && deck.length > 0) {
      const delay =  500; // 500 мс
      let newDeck = [...deck];
      let newHand = [...playerHand];
      
      const drawCard = () => {
        if (newDeck.length === 0) return; // Проверяем, есть ли карты в колоде
  
        const nextCard = newDeck.pop();
        if (!nextCard) return; // Еще одна проверка безопасности
        newHand.push(nextCard);
        setPlayerHand([...newHand]);
        setDeck(newDeck);
        if (calculateScore(newHand) > 21) {
          setTimeout(() => {
            setGameOver(true);
            setShowOverlay(true);
          }
          , delay);
        }
      };
      drawCard();
  
    }
  };
  useEffect(() => {
    if (gameOver) {
      const playerScore = calculateScore(playerHand);
      const dealerScore = calculateScore(dealerHand);
      if (
        playerScore === 21 && dealerScore !== 21 || 
        dealerScore > 21 || 
        (playerScore > dealerScore && dealerScore <= 16)
      ) {
        setBalance(balance + bet * 2);
      } else if (playerScore === dealerScore) {
        setBalance(balance + bet);
      }else if (playerScore > 21) {
      }
    }
  }, [gameOver]);
  
  

  const stand = () => {
    setIsStand(true);
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    let dealerScore = calculateScore(newDealerHand);
    
    // Дилер берет только одну карту, если у него меньше 17 после двух карт
    if (dealerScore < 17) { 
        newDealerHand.push(newDeck.pop());
        setDealerHand([...newDealerHand]);
        setDeck(newDeck);
        dealerScore = calculateScore(newDealerHand);
    }

    // Завершаем игру после того, как дилер сделал ход
    setGameOver(true);
    setShowOverlay(true);
};

  
  

  const buttonText = playerHand.length === 0 ? "Start Game" : "Restart Game";
  const buttonClass = playerHand.length === 0 ? "start-button start" : "start-button restart";

  return (
    <div className="App">
      {showOverlay && (
        <div className="overlay">
          <h1 className="result-text">
            {playerHand.length === 0 ? "Welcome to Succinct Blackjack!" :
              calculateScore(playerHand) === 21 && calculateScore(dealerHand) !== 21 ? "Player Wins!" :
              calculateScore(playerHand) > 21 ? "Player Busts! Dealer Wins!" :
              calculateScore(dealerHand) > 21 ? "Player Wins!" :
              calculateScore(playerHand) === calculateScore(dealerHand) && calculateScore(playerHand) < 21 ? "It's a Tie!" :
              calculateScore(playerHand) > calculateScore(dealerHand) && calculateScore(dealerHand) <= 16 ? "Player Wins!" :
              "Dealer Wins!"}
          </h1>

          <div className="balance-container">
              
              <button className="balance-button decrease-button" onClick={() => setBet(Math.max(bet - 10, 10))}>-</button>
              <p className="balance-text">Bet: ${bet}</p>
              <button className="balance-button increase-button" onClick={() => setBet(Math.min(bet + 10, balance))}>+</button>
            </div>
            <button className={buttonClass} onClick={dealInitialCards}>
              {buttonText}
            </button>
        </div>
      )}
      <div className="balance-wrapper">
        <p className="balance-text">💰 Balance: ${balance}</p>
      </div>
      <div className="header-container">
        <h1 className="header">Succinct Blackjack</h1>
      </div>
      {playerHand.length !== 0 && (
        <div className="background">
          <h2>Dealer: {calculateScore(dealerHand)}</h2>
          <div>
            {dealerHand.map((card, index) => (
              <Card key={index} value={card.value} suit={card.suit} index={index} />
            ))}
          </div>
          <div> </div>
          <h2>Player: {calculateScore(playerHand)}</h2>
          <div>
            {playerHand.map((card, index) => (
              <Card key={index} value={card.value} suit={card.suit} index={index} />
            ))}
          </div>
          <div className="button-container-upper"> 
            {!gameOver && (
              <div className="button-container">
                <button className="game-button hit-button" onClick={hit} disabled={gameOver}>
                  <p className="button-text">Hit</p>
                  <img src="/images/hand.svg" className="button-img" />
                </button>

                <button className="game-button stand-button" onClick={stand} disabled={gameOver}> 
                  <p className="button-text">Stand</p>
                  <img src="/images/hold.svg" className="button-img" />
                </button>


              </div>
            )}

            {/* { !isHit &&
              (
                <button className="game-button" onClick={dealInitialCards} disabled={gameOver}>Restart</button>
              )
            } */}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;