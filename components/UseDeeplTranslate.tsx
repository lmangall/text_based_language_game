import { useState } from "react";

const useDeeplTranslate = () => {
  const [translations, setTranslations] = useState<string[]>([]);
  const [translationError, setTranslationError] = useState<string>("");

  const translateText = async (text: string, targetLang: string = "EN-US") => {
    try {
      const response = await fetch("/api/deepl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, targetLang }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedTranslation = `<strong>${text}</strong>: ${data.translatedText}`;
      setTranslations((prev) => [...prev, formattedTranslation]);
    } catch (error) {
      console.error("Failed to fetch DeepL response:", error);
      setTranslationError("Failed to fetch translation.");
    }
  };

  return {
    translateText,
    translations,
    translationError,
  };
};

export default useDeeplTranslate;
