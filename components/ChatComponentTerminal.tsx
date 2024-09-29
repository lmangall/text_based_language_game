"use client";

import { useState } from "react";
import { Mistral } from "@mistralai/mistralai";
import { marked } from "marked"; // Import for feedback

const ChatTerminalComponent: React.FC = () => {
  const [input, setInput] = useState<string>(""); // User input
  const [response, setResponse] = useState<string>(""); // AI response
  const [history, setHistory] = useState<string[]>([]); // Command history
  const [loading, setLoading] = useState<boolean>(false); // Track if the AI is processing

  const [language, setLanguage] = useState<string>(""); // User's selected language
  const [languageLevel, setLanguageLevel] = useState<string>(""); // User's selected level
  const [turns, setTurns] = useState<number | null>(null); // Number of interactions
  const [currentTurn, setCurrentTurn] = useState<number>(0); // Track the current turn
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Track if the quest has started
  const [feedback, setFeedback] = useState<string>(""); // AI feedback on the user's language

  // Task context (this can be expanded or randomized later)
  const initialTask = `
  There is a tree structure in the directory 'project':
  
  \`\`\`bash
  /project
    /docs
      README.md
    /src
      app.js
      config.js
      /data
        file1.txt
        file2.txt
  \`\`\`
  
  Your task is to:
  1. Read the contents of 'file1.txt' in '/src/data/'.
  2. Copy the contents of 'file1.txt' to 'file3.txt' in the same directory.
  3. List the contents of the '/src/data/' folder after copying the file.
  `;

  // Mistral setup
  const client = new Mistral({
    apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
  });

  const handleUserInput = async (aiRole: string, userRole: string) => {
    // Add the user's input to the history with the userRole label
    setHistory((prevHistory) => [...prevHistory, `${userRole}: $ ${input}`]);

    // Ensure we are still in the settings phase (language, level, turns)
    if (!language) {
      if (input.toLowerCase() === "english" || input.toLowerCase() === "deutsch") {
        setLanguage(input);
        setHistory((prevHistory) => [
          ...prevHistory,
          `${aiRole}: Language set to ${input}.`,
          `${aiRole}: What is your level of knowledge? (A1, A2, B1, B2, C1, C2)`,
        ]);
      } else {
        setHistory((prevHistory) => [...prevHistory, `${aiRole}: Please choose either English or Deutsch.`]);
      }
    } else if (!languageLevel) {
      if (["a1", "a2", "b1", "b2", "c1", "c2"].includes(input.toLowerCase())) {
        setLanguageLevel(input.toUpperCase());
        setHistory((prevHistory) => [
          ...prevHistory,
          `${aiRole}: Knowledge level set to ${input.toUpperCase()}.`,
          `${aiRole}: How many interactions would you like to have? (1-20)`,
        ]);
      } else {
        setHistory((prevHistory) => [...prevHistory, `${aiRole}: Please choose a level between A1 and C2.`]);
      }
    } else if (!turns) {
      const numTurns = parseInt(input, 10);
      if (!isNaN(numTurns) && numTurns >= 1 && numTurns <= 20) {
        setTurns(numTurns);
        setHistory((prevHistory) => [
          ...prevHistory,
          `${aiRole}: Number of interactions set to ${numTurns}.`,
          `${aiRole}: Starting your quest...`,
        ]);
        startQuest(aiRole, userRole); // Pass roles to startQuest for consistent labeling
      } else {
        setHistory((prevHistory) => [...prevHistory, `${aiRole}: Please choose a number between 1 and 20.`]);
      }
    }

    // Clear the input after handling it
    setInput("");
  };

  // Handle starting the game
  const startQuest = async (aiRole: string, userRole: string) => {
    setLoading(true);
    setGameStarted(true); // Allow input after the game starts
    setCurrentTurn(1); // Reset turns

    const initialPrompt = `
    You are playing the role of a ${aiRole}, and I am a ${userRole}. 
    Our task is to complete the following over ${turns} turns, in ${language} at an ${languageLevel} level.
    
    Task: 
    ${initialTask}
    
    Provide terminal-like responses in the following format:
    \`\`\`bash
    $ command
    command output
    \`\`\`
    
    Let's begin! 
    `;

    // Add the initial prompt to the history
    setHistory([initialPrompt]);

    // Fetch the first response from the AI
    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: initialPrompt }],
      });

      const aiResponse = chatResponse.choices?.[0]?.message?.content?.trim() || "";
      setResponse(aiResponse); // Display the AI's response (simulating terminal)
      setHistory((prevHistory) => [...prevHistory, `Terminal: ${aiResponse}`]); // Append to history
    } catch (error) {
      console.error("Error starting the game:", error);
      setHistory((prevHistory) => [...prevHistory, "Error starting the game. Please try again."]);
    }

    setLoading(false);
  };

  // Handle sending user input (command)
  const handleSendMessage = async () => {
    if (currentTurn > turns!) {
      setHistory((prevHistory) => [...prevHistory, "Game Over. You have reached the maximum number of turns."]);
      return;
    }

    setLoading(true);

    const updatedHistory = history.join("\n") + `\n$ ${input}`; // Include user input in history
    setHistory((prevHistory) => [...prevHistory, `$ ${input}`]); // Append input to history

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: updatedHistory }],
      });

      const aiResponse = chatResponse.choices?.[0]?.message?.content?.trim() || "";
      setResponse(aiResponse); // Display AI response (terminal output)
      setHistory((prevHistory) => [...prevHistory, `Terminal: ${aiResponse}`]); // Append to history
      setCurrentTurn(currentTurn + 1); // Proceed to the next turn
    } catch (error) {
      console.error("Error processing the turn:", error);
      setHistory((prevHistory) => [...prevHistory, "Error processing the turn. Please try again."]);
    }

    setLoading(false);
    setInput(""); // Clear the input field
  };

  // Handle feedback request at the end
  const handleRequestFeedback = async () => {
    setLoading(true);

    const feedbackPrompt = `
Please assess the following conversation between a ${languageLevel} ${language} learner and a terminal.
Analyze the user's responses for grammar, sentence structure, and vocabulary usage, and provide suggestions for improvement.

Conversation history:
${history.join("\n")}
    `;

    try {
      const feedbackResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: feedbackPrompt }],
      });

      const markdownContent = feedbackResponse.choices?.[0]?.message?.content || "No feedback available.";
      const htmlContent = await marked(markdownContent); // Convert feedback to HTML
      setFeedback(htmlContent); // Set feedback
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback("<p>Something went wrong. Please try again.</p>");
    }

    setLoading(false);
  };
  return (
    <div className="bg-gray-900 text-green-400 font-mono h-screen w-full p-4 overflow-y-auto" tabIndex={0}>
      <div className="space-y-2">
        {/* Display history */}
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}

        {/* Display AI response */}
        {response && (
          <div className="text-green-500">
            <p>Terminal:</p>
            <pre>{response}</pre>
          </div>
        )}

        {/* User input area */}
        {!gameStarted && !turns && (
          <div className="flex">
            <span className="text-green-500">$</span>&nbsp;
            <input
              className="bg-transparent outline-none text-green-400 w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput("Terminal", "Developer")}
              disabled={loading}
              autoFocus
            />
          </div>
        )}

        {gameStarted && currentTurn <= turns! && (
          <div className="flex">
            <span className="text-green-500">$</span>&nbsp;
            <input
              className="bg-transparent outline-none text-green-400 w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading || currentTurn > turns!}
              autoFocus
            />
          </div>
        )}

        {/* Display feedback when game ends */}
        {feedback && (
          <div className="mt-4 p-4 bg-gray-800 text-green-300 rounded-lg">
            <h3 className="text-lg font-bold">Feedback on your language usage:</h3>
            <p dangerouslySetInnerHTML={{ __html: feedback }} />
          </div>
        )}

        {/* Start or feedback button */}
        {currentTurn > turns! && (
          <button
            onClick={handleRequestFeedback} // Explicitly calling the feedback function
            disabled={loading}
            className={`bg-purple-500 text-white py-2 px-4 rounded-lg font-semibold ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-purple-600"
            }`}
          >
            {loading ? "Requesting Feedback..." : "Request Feedback"}
          </button>
        )}
      </div>

      {loading && <p className="text-yellow-500 mt-4">Processing...</p>}
    </div>
  );
};

export default ChatTerminalComponent;
