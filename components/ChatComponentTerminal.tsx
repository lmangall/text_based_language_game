"use client";

import { useState, useRef, useEffect } from "react";
import { Mistral } from "@mistralai/mistralai";

export default function Component() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [fullJson, setFullJson] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English");
  const [languageLevel, setLanguageLevel] = useState<string>("A1");
  const [turns, setTurns] = useState<number>(5);
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userRole = "developer";
  const aiRole = "investor";
  const context = "seeking investment for my product";

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [response, conversationHistory]);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  const getInitialSentence = () => {
    return language === "German"
      ? "Hallo, schön dich zu treffen! Kannst du mir etwas über dein Produkt erzählen?"
      : "Hello, it's great to meet you! Can you tell me about your product?";
  };

  const handleStartGame = async () => {
    setLoading(true);
    setGameStarted(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    const initialPrompt = `
You are playing the role of a ${aiRole}, and I am a ${userRole} ${context}.
We will exchange sentences in ${language} at an ${languageLevel} level, over ${turns} turns.
At the last turn, you will decide if I get the investment. 

Your first message should ask about the ${userRole}'s product.

Your responses should be formatted as JSON without any additional fields:
{
  "answer": "string",
  "decision": "string"
}

Until the final turn, "decision" should always be null. On the last turn, "decision" can be either "winning" or "losing."

Let's start:
You, as the ${aiRole}: "${getInitialSentence()}"
`;

    setConversationHistory(initialPrompt);

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: initialPrompt }],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        let fullJsonResponse = chatResponse.choices[0]?.message?.content || "";
        setFullJson(fullJsonResponse);
        fullJsonResponse = fullJsonResponse.replace(/```json|```/g, "").trim();

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(fullJsonResponse);
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          setResponse("Error parsing the AI response.");
          return;
        }
        const responseContent = parsedResponse?.answer || "No content in the response.";
        setResponse(responseContent);
        setConversationHistory(initialPrompt + `\n${aiRole}: "${responseContent}"`);
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
          { role: "system", content: updatedHistory },
          { role: "user", content: message },
        ],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        let fullJsonResponse = chatResponse.choices[0]?.message?.content || "";
        fullJsonResponse = fullJsonResponse.replace(/```json|```/g, "").trim();
        setFullJson(fullJsonResponse);

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(fullJsonResponse);
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          setResponse("Error parsing the AI response.");
          return;
        }

        const responseContent = parsedResponse?.answer || "No content in the response.";
        setResponse(responseContent);
        setConversationHistory(updatedHistory + `\nInvestor: "${responseContent}"`);
        setCurrentTurn(currentTurn + 1);
      } else {
        setResponse("No response from the AI.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-green-400 font-mono rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Investor-Developer Dialogue Simulation</h1>

      {!gameStarted && (
        <>
          <div className="mb-4">
            <label htmlFor="language" className="block font-bold mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 bg-black border border-green-400 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="English">English</option>
              <option value="German">German</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="languageLevel" className="block font-bold mb-2">
              Language Level
            </label>
            <select
              id="languageLevel"
              value={languageLevel}
              onChange={(e) => setLanguageLevel(e.target.value)}
              className="w-full p-2 bg-black border border-green-400 rounded-lg focus:outline-none focus:border-green-500"
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
            <label htmlFor="turns" className="block font-bold mb-2">
              Number of Turns
            </label>
            <input
              id="turns"
              type="number"
              value={turns}
              onChange={(e) => setTurns(Number(e.target.value))}
              className="w-full p-2 bg-black border border-green-400 rounded-lg focus:outline-none focus:border-green-500"
              min="1"
              max="20"
            />
          </div>

          <button
            onClick={handleStartGame}
            disabled={loading}
            className={`w-full bg-green-600 text-black py-2 rounded-lg font-semibold ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-green-500"
            }`}
          >
            {loading ? "Starting..." : "Play"}
          </button>
        </>
      )}

      {gameStarted && (
        <>
          <div
            ref={terminalRef}
            className="mt-6 p-4 border border-green-400 rounded-lg bg-black h-64 overflow-y-auto"
            aria-live="polite"
          >
            <pre className="whitespace-pre-wrap">{conversationHistory}</pre>
          </div>

          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response here..."
            rows={4}
            className="w-full p-4 bg-black border border-green-400 rounded-lg focus:outline-none focus:border-green-500 mb-4 mt-4"
            disabled={loading || currentTurn > turns}
          />

          <button
            onClick={handleSendMessage}
            disabled={loading || !message || currentTurn > turns}
            className={`w-full bg-green-600 text-black py-2 rounded-lg font-semibold ${
              loading || !message || currentTurn > turns ? "cursor-not-allowed opacity-50" : "hover:bg-green-500"
            }`}
          >
            {loading ? "Sending..." : currentTurn > turns ? "Game Over" : "Send"}
          </button>

          <div className="mt-6">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-500"
            >
              {debugMode ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>

          {debugMode && (
            <div className="mt-6 p-4 border border-green-400 rounded-lg bg-black">
              <h2 className="text-lg font-semibold text-red-400">Full JSON Response (Debug):</h2>
              <pre className="mt-2 whitespace-pre-wrap break-words">{fullJson}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
