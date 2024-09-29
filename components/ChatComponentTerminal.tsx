"use client";

import { useState, useEffect } from "react";
import { Mistral } from "@mistralai/mistralai";

const ChatTerminalComponent: React.FC = () => {
  const [input, setInput] = useState<string>(""); // User input
  const [history, setHistory] = useState<string[]>([]); // Command history
  const [currentStep, setCurrentStep] = useState<number>(0); // Track the current step (language, level, etc.)
  const [language, setLanguage] = useState<string>(""); // User's selected language
  const [languageLevel, setLanguageLevel] = useState<string>(""); // User's selected level
  const [turns, setTurns] = useState<number | null>(null); // Number of interactions
  const [currentTurn, setCurrentTurn] = useState<number>(0); // Track the current turn
  const [loading, setLoading] = useState<boolean>(false); // Track if the AI is processing
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Track if the quest has started
  const [questEnded, setQuestEnded] = useState<boolean>(false); // Track if the quest has ended
  const [feedback, setFeedback] = useState<string>(""); // AI feedback on the user's language

  useEffect(() => {
    setHistory((prevHistory) => [...prevHistory, "Which language would you like to learn? (English or Deutsch)"]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleUserInput(input.trim());
      setInput(""); // Clear input after submission
    }
  };

  const handleUserInput = async (userInput: string) => {
    setHistory((prevHistory) => [...prevHistory, `$ ${userInput}`]);

    if (questEnded) {
      setHistory((prevHistory) => [...prevHistory, "The game is over. Please restart if you want to play again."]);
      return;
    }

    if (currentStep === 0) {
      // Language selection step
      if (userInput.toLowerCase() === "english" || userInput.toLowerCase() === "deutsch") {
        setLanguage(userInput);
        setCurrentStep(1);
        setHistory((prevHistory) => [
          ...prevHistory,
          `Language set to ${userInput}.`,
          "What is your level of knowledge? (A1, A2, B1, B2, C1, C2)",
        ]);
      } else {
        setHistory((prevHistory) => ["Invalid input. Please choose either English or Deutsch."]);
      }
    } else if (currentStep === 1) {
      // Language level selection step
      if (["a1", "a2", "b1", "b2", "c1", "c2"].includes(userInput.toLowerCase())) {
        setLanguageLevel(userInput.toUpperCase());
        setCurrentStep(2);
        setHistory((prevHistory) => [
          ...prevHistory,
          `Knowledge level set to ${userInput.toUpperCase()}.`,
          "How many interactions would you like to have? (1-20)",
        ]);
      } else {
        setHistory((prevHistory) => ["Invalid input. Please choose a level between A1 and C2."]);
      }
    } else if (currentStep === 2) {
      // Number of interactions selection step
      const numTurns = parseInt(userInput, 10);
      if (!isNaN(numTurns) && numTurns >= 1 && numTurns <= 20) {
        setTurns(numTurns);
        setHistory((prevHistory) => [
          ...prevHistory,
          `Number of interactions set to ${numTurns}.`,
          "Starting your quest...",
        ]);
        setGameStarted(true);
        startQuest(); // Start the quest after all choices are made
      } else {
        setHistory((prevHistory) => ["Invalid input. Please choose a number between 1 and 20."]);
      }
    } else if (gameStarted && currentTurn < turns!) {
      // Handle the quest interactions
      await processTurn(userInput);
    }
  };

  const startQuest = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      `Your task is to read the contents of a file or solve a task in the terminal environment. Let me know what you'd like to do.`,
    ]);
    setCurrentTurn(1);
  };

  const processTurn = async (userInput: string) => {
    setLoading(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    const conversationHistory = history.join("\n");

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: conversationHistory },
          { role: "user", content: userInput },
        ],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        // const aiResponse = chatResponse.choices[0].message.content.trim();
        const aiResponse = chatResponse.choices?.[0]?.message?.content?.trim() || "";

        setHistory((prevHistory) => [...prevHistory, `Terminal: ${aiResponse}`]);
        setCurrentTurn((prevTurn) => prevTurn + 1);

        if (currentTurn >= turns! - 1) {
          endQuest(); // End the quest after all turns
        }
      } else {
        setHistory((prevHistory) => [...prevHistory, "No response from the terminal."]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setHistory((prevHistory) => [...prevHistory, "Error processing the turn. Please try again."]);
    }

    setLoading(false);
  };

  const endQuest = async () => {
    // Determine success or failure (random for demo purposes)
    const success = Math.random() > 0.5;
    const resultMessage = success ? "You have succeeded!" : "You have failed.";

    setHistory((prevHistory) => [...prevHistory, resultMessage]);
    setQuestEnded(true);

    // Request language feedback
    await requestFeedback();
  };

  const requestFeedback = async () => {
    setLoading(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    const feedbackPrompt = `
Please assess the following conversation between a ${languageLevel} ${language} learner and a terminal.
Analyze the user's language usage and provide feedback on grammar, sentence structure, and vocabulary.

Conversation history:
${history.join("\n")}
    `;

    try {
      const feedbackResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: feedbackPrompt }],
      });

      if (feedbackResponse && feedbackResponse.choices && feedbackResponse.choices.length > 0) {
        // const feedbackText = feedbackResponse.choices[0].message.content.trim();
        const feedbackText = feedbackResponse.choices?.[0]?.message?.content?.trim() || "";
        setFeedback(feedbackText);
        setHistory((prevHistory) => [...prevHistory, "Feedback on your language usage:", feedbackText]);
      } else {
        setHistory((prevHistory) => [...prevHistory, "No feedback available."]);
      }
      // } catch () {
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setHistory((prevHistory) => [...prevHistory, "Error fetching feedback."]);
    }

    setLoading(false);
  };

  return (
    <div
      className="bg-gray-900 text-green-400 font-mono h-screen w-full p-4 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="space-y-2">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div className="flex">
          <span className="text-green-500">$</span>&nbsp;
          <input
            className="bg-transparent outline-none text-green-400 w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || questEnded}
            autoFocus
          />
        </div>
      </div>
      {loading && <p className="text-yellow-500 mt-4">Processing...</p>}

      {questEnded && feedback && (
        <div className="mt-4 p-4 bg-gray-800 text-green-300 rounded-lg">
          <h3 className="text-lg font-bold">Feedback on your language usage:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ChatTerminalComponent;
