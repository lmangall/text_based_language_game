"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatComponent from "@/components/ChatComponent";
import useDeeplTranslate from "@/components/UseDeeplTranslate";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const handlePlayClick = () => {
    setShowChat(true);
  };

  const { translateText, translations, translationError } = useDeeplTranslate(); // Use the hook here

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString()) {
      return;
    }

    const text = selection.toString();

    try {
      await translateText(text); // Translate selected text
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {showChat ? (
            <ChatComponent />
          ) : (
            <Button variant="outline" onClick={handlePlayClick}>
              Play
            </Button>
          )}
          <div
            className="bg-white w-full h-full max-h-80 bg-opacity-40 p-4 text-base font-normal border-2 border-gray-300 rounded-lg shadow-sm resize-none overflow-auto"
            aria-readonly="true"
            onMouseUp={handleTextSelection}
          >
            Un peu de texte pour tester la traduction (text to translate)
          </div>
          {translations.length > 0 && (
            <ul>
              {translations.map((translation, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: translation }}
                />
              ))}
            </ul>
          )}
          {translationError && (
            <p className="text-red-500">{translationError}</p>
          )}
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
    </div>
  );
}
