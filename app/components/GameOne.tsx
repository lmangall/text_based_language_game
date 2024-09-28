"use client";

import { useState } from "react";

export default function GameOne() {
  const [gameState, setGameState] = useState("initial");

  const handleChoice = (choice: number) => {
    if (choice === 1) {
      setGameState("win");
    } else {
      setGameState("lose");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      {gameState === "initial" && (
        <>
          <p className="text-xl">Initial situation</p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleChoice(1)}
            >
              Choice 1
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleChoice(2)}
            >
              Choice 2
            </button>
          </div>
        </>
      )}

      {gameState === "win" && (
        <p className="text-2xl font-bold text-green-500">You win!</p>
      )}

      {gameState === "lose" && (
        <p className="text-2xl font-bold text-red-500">You lose!</p>
      )}

      {gameState !== "initial" && (
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
