import React, { useState, useEffect, KeyboardEvent } from "react";

interface CommandHistory {
  command: string;
  result: string;
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle key events for terminal
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      // Simulate a command result (e.g., fake command execution)
      setHistory([...history, { command: input, result: `Executed: ${input}` }]);
      setInput(""); // Clear input after submission
    } else if (e.key === "Backspace") {
      setInput(input.slice(0, -1));
    } else if (e.key.length === 1) {
      setInput(input + e.key); // Append the key to the input
    }
  };

  return (
    <div
      className="bg-gray-900 text-green-400 font-mono h-96 w-full p-4 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0} // Ensure the div is focusable to capture key presses
    >
      <div className="space-y-2">
        {/* Render history */}
        {history.map((item, idx) => (
          <div key={idx}>
            <div className="flex">
              <span className="text-green-500">$</span>&nbsp;{item.command}
            </div>
            <div className="text-gray-400 pl-4">{item.result}</div>
          </div>
        ))}

        {/* Current input */}
        <div className="flex">
          <span className="text-green-500">$</span>&nbsp;
          <span>{input}</span>
          {/* Blinking cursor */}
          {cursorVisible && <span className="ml-1 animate-blink">█</span>}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
