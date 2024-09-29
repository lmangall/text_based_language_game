"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatComponent from "@/components/ChatComponent";
import DayInParis from "@/components/DayInParis";
import ChatComponentTerminal from "@/components/ChatComponentTerminal";
import { ChevronLeftIcon, ChevronRightIcon, MenuIcon } from "lucide-react";
import { GitHubLogoIcon, MagicWandIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState<"chat" | "paris" | "terminal" | null>(null);
  const { translateText, translations, translationError } = useDeeplTranslate();

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
  const [currentComponent, setCurrentComponent] = useState<
    "chat" | "paris" | "terminal" | null
  >(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cards = [
    {
      emoji: "🗼",
      title: "Go for a weekend in Paris",
      description:
        "You will land in Paris and have a fixed budget to spend your dream weekend. See the Eiffel tower, eat some macarons... ?",
      buttonText: "Ratatouille",
      tags: ["A1", "FR", "Bot"],
      component: "paris",
    },
    {
      emoji: "💼",
      title: "Get your tech company funded",
      description: "You're in the Berlin tech scene, hustling at hackathons.",
      buttonText: "Start Pitching",
      tags: ["A2", "DE", "Bot"],
      component: "chat",
    },
    {
      emoji: "💻",
      title: "Code in the Terminal",
      description:
        "Experience coding challenges in a terminal-like environment.",
      buttonText: "Hello World",
      tags: ["B1", "EN", "Bot"],
      component: "terminal",
    },
  ];

  const renderComponent = () => {
    switch (currentComponent) {
      case "chat":
        return <ChatComponent />;
      case "paris":
        return <DayInParis />;
      case "terminal":
        return <ChatComponentTerminal />;
      default:
        return null;
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentComponent("chat")}>
              ChatComponent
            </Button>
            <Button variant="outline" onClick={() => setCurrentComponent("paris")}>
              DayInParis
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-primary text-primary-foreground">
        <h1 className="text-xl font-bold">Game & languages</h1>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </header>

      {currentComponent ? (
        <div className="flex-grow flex items-center justify-center p-4">
          {renderComponent()}
        </div>
      ) : (
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-center">Welcome User!</h2>
          <p className="text-center text-gray-600 max-w-md mb-6 ">
            Choose a game to play and improve your language skills.
          </p>

          <div className="relative w-full max-w-sm">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="text-4xl mr-2">
                    {cards[currentCardIndex].emoji}
                  </span>
                  {cards[currentCardIndex].title}
                </CardTitle>
                <CardDescription>
                  {cards[currentCardIndex].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cards[currentCardIndex].tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    setCurrentComponent(
                      cards[currentCardIndex].component as
                        | "chat"
                        | "paris"
                        | "terminal"
                    )
                  }
                >
                  {cards[currentCardIndex].buttonText}
                </Button>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 text-center">
                Explore and learn with LangGenie
              </CardFooter>
            </Card>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full"
              onClick={prevCard}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentComponent("terminal")}>
              ChatComponentTerminal
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full"
              onClick={nextCard}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
        </main>
      )}
      <footer className="w-full mt-10 py-4 px-4">
        <div className="flex flex-col items-center justify-center space-y-2 text-grey-600">
          <p className="flex space-x-4 ">
            <a
              href="https://github.com/lmangall/text_based_language_game"
              className="font-bold text-xs text-gray-600 hover:text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran"
              className="font-bold text-xs text-gray-600 hover:text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MagicWandIcon className="h-4 w-4" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
