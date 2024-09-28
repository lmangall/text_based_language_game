// import GameOne from "./components/GameOne";
// import ChatComponent from "./components/ChatComponent";
// import GameTwo from "./components/GameTwo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatComponent from "@/components/ChatComponent";

export default function Home() {


  const [showChat, setShowChat] = useState(false);
  const handlePlayClick = () => { setShowChat(true); };


]  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {/* <ChatComponent /> */}
        {/* <GameOne /> */}
        {showChat ? <ChatComponent /> : (
          <Button variant="outline" onClick={handlePlayClick}>Play</Button>
        )}
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            // href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            // target="_blank"
            // rel="noopener noreferrer"
          >
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
    </div>
  );
}
