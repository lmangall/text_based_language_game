"use client"; // Ensure this component runs on the client

import { useState } from "react";

export default function GameTwo() {
  const [gameState, setGameState] = useState("initial");
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    const lowerCaseInput = userInput.toLowerCase();

    if (gameState === "initial") {
      if (lowerCaseInput === "choice one") {
        setGameState("situation-one");
      } else if (lowerCaseInput === "choice two") {
        setGameState("situation-two");
      }
    } else if (gameState === "situation-one" || gameState === "situation-two") {
      if (lowerCaseInput === "win") {
        setGameState("win");
      } else if (lowerCaseInput === "lose") {
        setGameState("lose");
      }
    }

    // Clear the input after submission
    setUserInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      {gameState === "initial" && (
        <>
          <p className="text-xl">
            Initial situation. Type choice one or choice two.
          </p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter your choice..."
            className="px-4 py-2 border rounded"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </>
      )}

      {gameState === "situation-one" && (
        <>
          <p className="text-xl">Situation One Type win or lose.</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter win or lose..."
            className="px-4 py-2 border rounded"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </>
      )}

      {gameState === "situation-two" && (
        <>
          <p className="text-xl">Situation Two Type win or lose.</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter win or lose..."
            className="px-4 py-2 border rounded"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </>
      )}

      {gameState === "win" && (
        <p className="text-2xl font-bold text-green-500">
          You win! Congratulations.
        </p>
      )}

      {gameState === "lose" && (
        <p className="text-2xl font-bold text-red-500">
          You lose! Better luck next time.
        </p>
      )}

      {(gameState === "win" || gameState === "lose") && (
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => setGameState("initial")}
        >
          Play Again
        </button>
      )}
    </div>
  );
}
