"use client";

import { useState } from "react";
import { Mistral } from "@mistralai/mistralai";
import { marked } from "marked"; // Import marked

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [fullJson, setFullJson] = useState<string>(""); // Full JSON for debugging

  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("English");
  const [languageLevel, setLanguageLevel] = useState<string>("A1");
  const [turns, setTurns] = useState<number>(5); // Default number of turns
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<number>(1); // Track the current turn
  const [debugMode, setDebugMode] = useState<boolean>(false); // To toggle debug window

  //    Define roles and context
  const userRole = "developer"; // User's role
  const aiRole = "investor"; // AI's role
  const context = "seeking investment for my product"; // The user's context or aim
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

    // Updated prompt to use variables for roles and context
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

    setConversationHistory(initialPrompt); // Set the initial conversation history

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: initialPrompt }],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        let fullJsonResponse = chatResponse.choices[0]?.message?.content || ""; // Ensure it is a string
        setFullJson(fullJsonResponse); // Set full JSON for debugging
        console.log("Raw AI Response:", fullJsonResponse); // Log the raw response for debugging
        // Remove markdown-like tags if present (```json or similar)
        fullJsonResponse = fullJsonResponse.replace(/```json|```/g, "").trim();

        console.log("Cleaned AI Response:", fullJsonResponse); // Log cleaned response

        setFullJson(fullJsonResponse); // Set full JSON for debugging
        // Try to parse the cleaned JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(fullJsonResponse); // Parse the string as JSON
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          setResponse("Error parsing the AI response.");
          return;
        }
        // Extract only the 'answer' from the parsed JSON
        const responseContent = parsedResponse?.answer || "No content in the response.";
        setResponse(responseContent); // Set the initial response from the AI
        setConversationHistory(initialPrompt + `\n${aiRole}: "${responseContent}"`); // Update conversation history
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
        let fullJsonResponse = chatResponse.choices[0]?.message?.content || ""; // Ensure it's a string

        console.log("Raw AI Response (Turn " + currentTurn + "):", fullJsonResponse); // Log the raw response for each turn

        // Clean any markdown tags like ```json
        fullJsonResponse = fullJsonResponse.replace(/```json|```/g, "").trim();

        console.log("Cleaned AI Response (Turn " + currentTurn + "):", fullJsonResponse); // Log cleaned response

        setFullJson(fullJsonResponse); // Set full JSON for debugging

        // Try to parse the cleaned JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(fullJsonResponse); // Parse the string as JSON
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          setResponse("Error parsing the AI response.");
          return;
        }
        // Log the parsed response content
        console.log("Parsed AI Response (Turn " + currentTurn + "):", parsedResponse);

        // Extract only the 'answer' from the parsed JSON
        const responseContent = parsedResponse?.answer || "No content in the response.";

        // Correctly set the response so only the 'answer' is displayed, not the whole JSON
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

  const handleRequestFeedback = async () => {
    setLoading(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    const feedbackPrompt = `
	Please assess the following conversation between a ${userRole} and an ${aiRole}, focusing solely on the ${userRole}'s responses.
	Analyze the ${userRole}'s responses for grammar, sentence structure, and vocabulary usage, and provide suggestions on how they can improve their language skills.
  
	Only provide feedback on the responses of the ${userRole}.
  
	Conversation history:
	${conversationHistory}
  `;

    try {
      const feedbackResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: feedbackPrompt }],
      });

      if (feedbackResponse && feedbackResponse.choices && feedbackResponse.choices.length > 0) {
        const markdownContent = feedbackResponse.choices[0].message.content || "No feedback available.";

        // Use await if marked is asynchronous
        const htmlContent = await marked(markdownContent); // Await for Promise resolution

        // Set the HTML content in the response state
        setResponse(htmlContent);
      } else {
        setResponse("<p>No feedback available.</p>");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setResponse("<p>Something went wrong. Please try again.</p>");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {`${aiRole.charAt(0).toUpperCase()}${aiRole.slice(1)}`} -{" "}
        {`${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}`} Dialogue Simulation
      </h1>

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
            {/* Render the HTML response safely */}
            <div
              className="mt-2 text-gray-700"
              dangerouslySetInnerHTML={{ __html: response }} // Here is the fix to render HTML content
            />
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

          {/* If game is over, show Request Feedback button */}
          {currentTurn > turns ? (
            <button
              onClick={handleRequestFeedback}
              disabled={loading}
              className={`w-full bg-purple-500 text-white py-2 rounded-lg font-semibold ${
                loading ? "cursor-not-allowed opacity-50" : "hover:bg-purple-600"
              }`}
            >
              {loading ? "Requesting Feedback..." : "Request Feedback"}
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={loading || !message || currentTurn > turns}
              className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold ${
                loading || !message || currentTurn > turns ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          )}

          {/* Toggle Debug Mode Button */}
          <div className="mt-6">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
            >
              {debugMode ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>

          {/* Debug Mode - Show Full JSON */}
          {debugMode && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
              <h2 className="text-lg font-semibold text-red-800">Full JSON Response (Debug):</h2>
              <pre className="mt-2 text-gray-700 whitespace-pre-wrap break-words">{fullJson}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatComponent;
