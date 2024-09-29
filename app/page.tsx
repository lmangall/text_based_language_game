"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatComponent from "@/components/ChatComponent";
import DayInParis from "@/components/DayInParis";
import ChatComponentTerminal from "@/components/ChatComponentTerminal";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState<
    "chat" | "paris" | "terminal" | null
  >(null);

  // Function to render the selected component
  const renderComponent = () => {
    switch (currentComponent) {
      case "chat":
        return <ChatComponent />;
      case "paris":
        return <DayInParis />;
      case "terminal":
        return <ChatComponentTerminal />;
      default:
        return null; // Render nothing if no component is selected
    }
  };

  return (
    <div>
      {/* Render selected component if one is active, else show the buttons */}
      {currentComponent ? (
        <div className="flex items-center justify-center min-h-screen">
          {renderComponent()}
        </div>
      ) : (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentComponent("chat")}
              >
                ChatComponent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentComponent("paris")}
              >
                DayInParis
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentComponent("terminal")}
              >
                ChatComponentTerminal
              </Button>
            </div>
          </main>

          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <a className="flex items-center gap-2 hover:underline hover:underline-offset-4">
              Learn
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://langgenie.xyz/loveletter"
              target="_blank"
              rel="noopener noreferrer"
            >
              Loveletter →
            </a>
          </footer>
        </div>
      )}
    </div>
  );
}
