// components/ChatComponent.tsx

"use client";

import { useState } from "react";
import { Mistral } from "@mistralai/mistralai";

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    setLoading(true);

    const client = new Mistral({
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string,
    });

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: message }],
      });

      if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) {
        const responseContent = chatResponse.choices[0].message.content || "No content in the response.";
        setResponse(responseContent); // Ensure response is always a string
      } else {
        setResponse("No response from the AI.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Chat with Mistral AI</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
      />
      <button
        onClick={handleSendMessage}
        disabled={loading}
        className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold ${
          loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {response && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Assistant&#39;s Response:</h2>
          <p className="mt-2 text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
};

// const ChatComponent: React.FC = () => {
//   const [message, setMessage] = useState<string>("");
//   const [response, setResponse] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSendMessage = async () => {
//     setLoading(true);

//     // Initialize Mistral client
//     const client = new Mistral({
//       apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY as string, // Safe cast API key to string
//     });

//     try {
//       const chatResponse = await client.chat.complete({
//         model: "mistral-large-latest",
//         messages: [{ role: "user", content: message }],
//       });

//       setResponse(chatResponse.choices[0].message.content);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setResponse("Something went wrong. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Chat with Mistral AI</h1>
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message here..."
//         rows={4}
//         cols={50}
//       />
//       <br />
//       <button onClick={handleSendMessage} disabled={loading}>
//         {loading ? "Sending..." : "Send"}
//       </button>
//       {response && (
//         <div>
//           <h2>Assistant's Response:</h2>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };

export default ChatComponent;
