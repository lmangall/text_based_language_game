import React, { useState } from "react";
import useDeeplTranslate from "@/components/UseDeeplTranslate";

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
        nextStep: "askAboutBus",
      },
      {
        emoji: "🚕",
        text: `Take a taxi: "Taxi! Les Champs Élysées, s'il vous plaît!"`,
        nextStep: "taxi",
      },
    ],
  },
  askAboutBus: {
    description: `Il va à Paris, ici c'est Beauvais, Paris est à une heure de route, 80km.\n\nWhat do you want to do next?`,
    options: [
      {
        emoji: "🚌",
        text: `Take the bus to Paris`,
        nextStep: "busTicket",
      },
      {
        emoji: "🚕",
        text: `Take a taxi: "Taxi! Les Champs Élysées, s'il vous plaît!"`,
        nextStep: "taxi",
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
  taxi: {
    description: `You took a taxi and paid €120 for the ride to Paris, ouch. Did you know it's 80km? Anyway now you have arrived.\n\nWhat do you do next?`,
    options: [
      {
        emoji: "🥖",
        text: `Je vais dans une boulangerie`,
        nextStep: "bakery",
      },
      {
        emoji: "🌳",
        text: `Je vais aux Champs Élysées`,
        nextStep: "metroChampsElysees",
      },
      { emoji: "🖼️", text: `Je vais au Louvre`, nextStep: "metroLouvre" },
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
    description: `You exit the station
En sortant de la station de métro Champs Elysées Clémenceau, vous voyez une grande avenue avec beaucoup de magasins et de restaurants. Les arbres bordent la rue et il y a beaucoup de gens qui marchent. Vous voyez aussi des voitures et des bus qui passent. L'avenue est très belle et animée.`,
    options: [],
  },
  metroLouvre: {
    description: `You ask someone for directions. They explain: "Prenez la ligne 13 direction Chatillon-Montrouge, changez à Champs Elysées Clémenceau et prenez la ligne 1 direction Vincennes, descendez à Louvre Rivoli."`,
    options: [
      { emoji: "✔️", text: `Follow their advice`, nextStep: "arriveLouvre" },
      {
        emoji: "🛑",
        text: `You think he’s wrong and at Champs Elysées Clémenceau you go direction La Défense to go out at Louvre Rivoli.`,
      },
    ],
  },
  arriveLouvre: {
    description: `You do as he says, En sortant de la station de métro Louvre-Rivoli, vous voyez une grande place avec beaucoup de touristes. Il y a des magasins et des cafés autour de la place. Vous voyez aussi des bâtiments historiques et des statues. Les gens prennent des photos et admirent les monuments. La place est très belle et animée.`,
    options: [],
  },
  loseForWrongDirection: {
    description: `Sorry, you had to go direction Vincennes in order to go out at Louvre Rivoli, you lost the game. You better not go to Paris if you can’t navigate the metro`,
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
  const { translateText, translations, translationError } = useDeeplTranslate();

  const handleOptionClick = (option: GameOption) => {
    if (option.lose) {
      setCurrentStep("lose");
    } else if (option.nextStep) {
      setCurrentStep(option.nextStep);
    }
  };

  const handleRestart = () => {
    setCurrentStep("start");
  };

  const renderOptions = (options: GameOption[]) => {
    return options.map((option, index) => (
      <div key={index} className="flex items-center my-2">
        <button
          onClick={() => handleOptionClick(option)}
          className="text-left bg-transparent border-none cursor-pointer text-xl mr-3"
        >
          {option.emoji}
        </button>
        <span className="italic" onMouseUp={handleTextSelection}>
          {option.text}
        </span>
      </div>
    ));
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString()) {
      return;
    }

    const text = selection.toString().trim();
    if (text.length === 0) return;

    try {
      await translateText(text);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const renderDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <p key={index} className="my-4" onMouseUp={handleTextSelection}>
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
        <div>
          <p className="text-lg">Game Over</p>
          <button
            onClick={handleRestart}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Restart Game
          </button>
        </div>
      )}
      {/* Render translations here */}
      {translations.length > 0 && (
        <div className="mt-4 w-full">
          <h2 className="font-bold">Translations:</h2>
          <ul className="list-disc pl-5">
            {translations.map((translation, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{ __html: translation }}
              />
            ))}
          </ul>
          {translationError && (
            <p className="text-red-500">{translationError}</p>
          )}
        </div>
      )}
      {translationError && <p className="text-red-500">{translationError}</p>}
    </div>
  );
};

export default DayInParis;
