import React, { useState } from "react";

interface GameOption {
  emoji: string;
  text: string;
  nextStep?: string;
  lose?: boolean;
}

interface GameStep {
  description: string;
  options: GameOption[];
}

const steps: { [key: string]: GameStep } = {
  start: {
    description: `You land in Paris Beauvais, it’s 08:15. You have the full day and need to be back at 12:00 for your flight. You notice that many people are "going to Paris" with a bus. What do you do?`,
    options: [
      {
        emoji: "🚌",
        text: `Go to the bus driver: "Bonjour, un billet pour Paris, s'il vous plait"`,
        nextStep: "busTicket",
      },
      {
        emoji: "❓",
        text: `Ask somebody: "Excusez-moi, où va le bus ?"`,
        lose: true,
      },
      {
        emoji: "🚕",
        text: `Take a taxi: "Taxi! Les Champs Élysées, s'il vous plaît!"`,
        lose: true,
      },
    ],
  },
  busTicket: {
    description: `The Driver says “Et voila” as he hands you the ticket. “Quinze euros s’il vous plaît”.\n\n90 minutes later (at 10:00), you arrive at Université Saint Denis. What do you do?`,
    options: [
      {
        emoji: "🥖",
        text: `Aller à la première boulangerie`,
        nextStep: "bakery",
      },
      {
        emoji: "🌳",
        text: `Aller aux Champs Élysées`,
        nextStep: "metroChampsElysees",
      },
      { emoji: "🖼️", text: `Aller au Louvre`, nextStep: "metroLouvre" },
    ],
  },
  bakery: {
    description: `You decide to go to the first bakery you see. You notice a charming little boulangerie called "La Baguette Dorée".\n\nThe baker greets you warmly: "Bonjour Monsieur/Madame! Qu'est-ce que je peux vous offrir aujourd'hui?"`,
    options: [
      {
        emoji: "🥐",
        text: `"Bonjour, je voudrais un croissant et un café au lait, s'il vous plaît."`,
        nextStep: "bakeryOrder1",
      },
      {
        emoji: "🤷‍♂️",
        text: `"Euhhh, je ne parle pas français"`,
        nextStep: "bakeryOrder2",
      },
      {
        emoji: "🍪",
        text: `"Bonjour, un café et un macaron s'il vous plaît."`,
        nextStep: "bakeryOrder3",
      },
    ],
  },
  bakeryOrder1: {
    description: `Le boulanger répond avec un sourire, "Bien sûr, Monsieur/Madame. Ça fera trois euros cinquante, s'il vous plaît."`,
    options: [
      {
        emoji: "🌳",
        text: `Payer et aller aux Champs Elysées`,
        nextStep: "metroChampsElysees",
      },
      {
        emoji: "🖼️",
        text: `Payer et aller au Louvre`,
        nextStep: "metroLouvre",
      },
      { emoji: "🚶", text: `Sortir sans payer`, nextStep: "loseForStealing" },
    ],
  },
  bakeryOrder2: {
    description: `The clerk answers: "café? croissant?"`,
    options: [
      { emoji: "🥐", text: `"One croissant please"`, nextStep: "bakeryOrder1" },
      {
        emoji: "📘",
        text: `Try to order in French with the help of the boulangère`,
        nextStep: "bakeryOrder1",
      },
    ],
  },
  bakeryOrder3: {
    description: `Le boulanger répond, "Bien sûr, Monsieur/Madame. Ça fera quatre euros, s'il vous plaît."`,
    options: [
      {
        emoji: "🌳",
        text: `Payer et aller aux Champs Elysées`,
        nextStep: "metroChampsElysees",
      },
      {
        emoji: "🖼️",
        text: `Payer et aller au Louvre`,
        nextStep: "metroLouvre",
      },
      { emoji: "🚶", text: `Sortir sans payer`, nextStep: "loseForStealing" },
    ],
  },
  metroChampsElysees: {
    description: `You enter the metro at Saint Denis Université. Which direction do you take?`,
    options: [
      {
        emoji: "🛑",
        text: `Take the line 13 direction Chatillon-Montrouge, change at Saint Lazare, and take the line 9 to Trocadéro`,
        lose: true,
      },
      {
        emoji: "✔️",
        text: `Take the line 13 direction Chatillon-Montrouge, and exit at Champs Elysées Clémenceau`,
        nextStep: "arriveChampsElysees",
      },
    ],
  },
  arriveChampsElysees: {
    description: `You exit the station and find yourself on a beautiful, lively avenue with many shops and restaurants.`,
    options: [],
  },
  metroLouvre: {
    description: `You ask someone for directions. They explain: "Prenez la ligne 13 direction Chatillon-Montrouge, changez à Champs Elysées Clémenceau et prenez la ligne 1 direction Vincennes, descendez à Louvre Rivoli."`,
    options: [
      { emoji: "✔️", text: `Follow their advice`, nextStep: "arriveLouvre" },
      {
        emoji: "🛑",
        text: `Ignore their advice and go the wrong way`,
        lose: true,
      },
    ],
  },
  arriveLouvre: {
    description: `You arrive at a beautiful square filled with tourists, historic buildings, and monuments.`,
    options: [],
  },
  loseForStealing: {
    description: `You lost the game. In Saint Denis, stealing from bakers is common, but they know you're a tourist and are fed up with it.`,
    options: [],
  },
  lose: {
    description: `Sorry, you lost the game.`,
    options: [],
  },
};

const DayInParis: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("start");

  const handleOptionClick = (option: GameOption) => {
    if (option.lose) {
      setCurrentStep("lose");
    } else if (option.nextStep) {
      setCurrentStep(option.nextStep);
    }
  };

  const renderOptions = (options: GameOption[]) => {
    return options.map((option, index) => (
      <button
        key={index}
        onClick={() => handleOptionClick(option)}
        className="text-left my-2 p-2 bg-transparent border-none cursor-pointer"
      >
        {option.emoji} <span className="italic">{option.text}</span>
      </button>
    ));
  };

  const renderDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <p key={index} className="my-4">
        {line}
      </p>
    ));
  };

  return (
    <div className="font-sans p-5">
      {renderDescription(steps[currentStep].description)}
      {steps[currentStep].options.length > 0 ? (
        <div>{renderOptions(steps[currentStep].options)}</div>
      ) : (
        <p className="text-lg">Game Over</p>
      )}
    </div>
  );
};

export default DayInParis;
