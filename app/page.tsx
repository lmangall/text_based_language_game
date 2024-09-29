"use client";

import { useCallback } from "react";
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
import { useInitData } from "@/components/useInitData";
import { useState } from "react";

type GameComponent = "chat" | "paris" | "terminal";

interface GameCard {
  emoji: string;
  title: string;
  description: string;
  buttonText: string;
  tags: string[];
  component: GameComponent;
}

const cards: GameCard[] = [
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
    description: "Experience coding challenges in a terminal-like environment.",
    buttonText: "Hello World",
    tags: ["B1", "EN", "Bot"],
    component: "terminal",
  },
];

export default function Home() {
  const { initData, error, loading } = useInitData();
  const [currentComponent, setCurrentComponent] =
    useState<GameComponent | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const renderComponent = useCallback(() => {
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
  }, [currentComponent]);

  const nextCard = useCallback(() => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  }, []);

  const prevCard = useCallback(() => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error initializing app:", error);
  }

  console.log("InitData in Home:", initData); // Debugging statement

  return (
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
          <h2 className="text-2xl font-bold text-center">
            Welcome {initData?.user?.firstName || "User"}!
          </h2>
          <p className="text-center text-gray-600 max-w-md mb-6">
            Choose a game to play and improve your language skills.
          </p>

          <div className="relative w-full max-w-sm flex justify-center items-center">
            <Card className="w-full" style={{ width: "80%" }}>
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
                    setCurrentComponent(cards[currentCardIndex].component)
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
          <p className="flex space-x-4">
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
