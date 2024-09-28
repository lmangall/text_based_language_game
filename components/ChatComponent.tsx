"use client";

import { useState } from "react";
import { Mistral } from "@mistralai/mistralai";

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English");
  const [languageLevel, setLanguageLevel] = useState<string>("A1");
  const [turns, setTurns] = useState<number>(5); // Default number of turns
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<number>(1); // Track the current turn

  const role = "investor"; // Future-proofing for dynamic role changes

  // Handle initial investor sentence based on language selection
  const getInitialSentence = () => {
    if (language === "German") {
      return "Hallo, schön dich zu treffen! Kannst du mir etwas über dein Produkt erzählen?";
    } else {
      return "Hello, it's great to meet you! Can you tell me about your product?";
    }
  };

  const handleStartGame = async () => {
    setLoading(true);
    setGameStarted(true); // Allow message input after Play is clicked

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    // Investor starts the conversation based on selected language
    const initialPrompt = `
      You are a ${role}, and I am a developer seeking investment for my product.
      We will exchange sentences in ${language} at an ${languageLevel} level, over ${turns} turns.
      At the last turn, you will decide if I get the investment. 

      Your responses should be formatted as JSON without any additional fields:
      {
        "answer": "string",
        "decision": "string"
      }

      Until the final turn, "decision" should always be null. On the last turn, "decision" can be either "winning" or "losing."

      Let's start:
      ${role}: "${getInitialSentence()}"
    `;

    setConversationHistory(initialPrompt); // Set the initial conversation history

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: initialPrompt }],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        const responseContent = chatResponse.choices[0].message.content || "No content in the response.";
        setResponse(responseContent); // Set the initial response from the investor
        setConversationHistory(initialPrompt + `\n${role}: "${responseContent}"`); // Update conversation history
      } else {
        setResponse("No response from the AI.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (currentTurn > turns) {
      setResponse("Game Over. You have reached the maximum number of turns.");
      return;
    }

    setLoading(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    const updatedHistory = conversationHistory + `\nUser: "${message}"`;

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: updatedHistory }, // Pass conversation history
          { role: "user", content: message }, // User's latest input
        ],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        const responseContent = chatResponse.choices[0].message.content || "No content in the response.";
        setResponse(responseContent); // Set response from the investor
        setConversationHistory(updatedHistory + `\nInvestor: "${responseContent}"`); // Update history
        setCurrentTurn(currentTurn + 1); // Move to the next turn
      } else {
        setResponse("No response from the AI.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Investor-Developer Dialogue Simulation</h1>

      {/* Language, Level, and Number of Turns selection (shown only before the game starts) */}
      {!gameStarted && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="English">English</option>
              <option value="German">German</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Language Level</label>
            <select
              value={languageLevel}
              onChange={(e) => setLanguageLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="A1">A1 (Beginner)</option>
              <option value="A2">A2 (Elementary)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper Intermediate)</option>
              <option value="C1">C1 (Advanced)</option>
              <option value="C2">C2 (Proficient)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Number of Turns</label>
            <input
              type="number"
              value={turns}
              onChange={(e) => setTurns(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              min="1"
              max="20"
            />
          </div>

          {/* Play button to start the game */}
          <button
            onClick={handleStartGame}
            disabled={loading}
            className={`w-full bg-green-500 text-white py-2 rounded-lg font-semibold ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600"
            }`}
          >
            {loading ? "Starting..." : "Play"}
          </button>
        </>
      )}

      {/* After game starts, display the conversation and enable the input field */}
      {gameStarted && (
        <>
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
            <h2 className="text-lg font-semibold text-gray-800">Investor&#39;s Response:</h2>
            <p className="mt-2 text-gray-700">{response}</p>
            <p className="mt-2 text-gray-500">
              Turn {currentTurn}/{turns}
            </p>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response here..."
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            disabled={loading || currentTurn > turns}
          />

          <button
            onClick={handleSendMessage}
            disabled={loading || !message || currentTurn > turns}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold ${
              loading || !message || currentTurn > turns ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Sending..." : currentTurn > turns ? "Game Over" : "Send"}
          </button>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
