"use client";

import { useState, useEffect } from "react";
import { Mistral } from "@mistralai/mistralai";
import { marked } from "marked";

interface ChatComponentProps {
  targetLanguage: string;
  languageLevel: string;
  turnNumbers: number;
  userLanguage: string;
  aiRole: string;
  userRole: string;
  context: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  targetLanguage,
  languageLevel,
  turnNumbers,
  userLanguage,
  aiRole,
  userRole,
  context,
}) => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [fullJson, setFullJson] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const [debugMode, setDebugMode] = useState<boolean>(false);

  console.log(userLanguage); // Just to avoid the unused variable warning.

  const initialSentences: { [key in "german" | "english"]: string } = {
    german: "Hallo, schön dich zu treffen! Kannst du mir etwas über dein Produkt erzählen?",
    english: "Hello, it's great to meet you! Can you tell me about your product?",
  };

  const getInitialSentence = () => {
    const languageKey = targetLanguage.toLowerCase() as "german" | "english";
    return initialSentences[languageKey] || initialSentences["english"];
  };

  const client = new Mistral({
    apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
  });

  const handleApiResponse = async (messages: Message[]) => {
    setLoading(true);
    let retryCount = 0;
    const maxRetries = 3;

    const fetchResponse = async () => {
      try {
        const chatResponse = await client.chat.complete({
          model: "mistral-large-latest",
          messages: messages,
        });

        if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
          const fullJsonResponse = chatResponse.choices[0]?.message?.content || "";
          const trimmedFullJsonResponse = fullJsonResponse.replace(/```json|```/g, "").trim();
          setFullJson(trimmedFullJsonResponse);

          let parsedResponse;
          try {
            parsedResponse = JSON.parse(trimmedFullJsonResponse);
          } catch (error) {
            console.error("Failed to parse response as JSON:", error);
            throw new Error("Error parsing the AI response.");
          }

          const responseContent = parsedResponse?.answer || "No content in the response.";
          setResponse(responseContent);
          setConversationHistory((prevHistory) => `${prevHistory}\n${aiRole}: "${responseContent}"`);
        } else {
          throw new Error("No response from AI");
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying... Attempt ${retryCount}`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay between retries
          await fetchResponse();
        } else {
          setResponse("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    await fetchResponse();
  };

  // Start the game when the component mounts
  useEffect(() => {
    handleStartGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiRole, userRole, turnNumbers, targetLanguage, languageLevel, context]);

  const handleStartGame = async () => {
    setLoading(true);

    const initialPrompt = `
      You are playing the role of a ${aiRole}, and I am a ${userRole} ${context}.
      We will exchange sentences in ${targetLanguage} at an ${languageLevel} level, over ${turnNumbers} turns.
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
    await handleApiResponse([{ role: "system", content: initialPrompt }]);
  };

  const handleUserAnswer = async () => {
    if (currentTurn > turnNumbers) {
      setResponse("Game Over. You have reached the maximum number of turns.");
      return;
    }

    setLoading(true);

    const updatedHistory = conversationHistory + `\nUser: "${message}"`;
    setConversationHistory(updatedHistory);

    setCurrentTurn((prevTurn) => prevTurn + 1);

    if (currentTurn === turnNumbers - 1) {
      // Last turn, ask for the final decision
      const finalTurnPrompt = `
		This is the final turn. Please decide whether to invest or not based on the conversation.
		
		Your response should include a final decision in this format:
		{
		  "answer": "string",
		  "decision": "string"  // "investing" or "not investing"
		}`;

      await handleApiResponse([
        { role: "system", content: updatedHistory },
        { role: "user", content: message },
        { role: "system", content: finalTurnPrompt },
      ]);
    } else {
      await handleApiResponse([
        { role: "system", content: updatedHistory },
        { role: "user", content: message },
        { role: "system", content: `Current turn: ${currentTurn}` },
      ]);
    }
    setLoading(false);
    setMessage(""); // Clear input after sending
  };
  // Define the allowed roles using string literals
  type Role = "system" | "user" | "assistant" | "tool";

  // Update the Message interface to use specific roles
  interface Message {
    role: Role;
    content: string;
  }

  const handleRequestFeedback = async () => {
    setLoading(true);

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
        const htmlContent = await marked(markdownContent);
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
      <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Investor&apos;s Response:</h2>
        <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: response }} />
        <p className="mt-2 text-gray-500">
          Turn {currentTurn}/{turnNumbers}
        </p>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your response here..."
        rows={4}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
        disabled={loading || currentTurn > turnNumbers}
      />
      {currentTurn > turnNumbers ? (
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
          onClick={handleUserAnswer}
          disabled={loading || !message || currentTurn > turnNumbers}
          className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold ${
            loading || !message || currentTurn > turnNumbers ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      )}

      <div className="mt-6">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
        >
          {debugMode ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>

      {debugMode && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
          <h2 className="text-lg font-semibold text-red-800">Full JSON Response (Debug):</h2>
          <pre className="mt-2 text-gray-700 whitespace-pre-wrap break-words">{fullJson}</pre>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
