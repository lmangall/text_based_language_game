import { useState } from "react";

const useDeeplTranslate = () => {
  const [translations, setTranslations] = useState<string[]>([]);
  const [translationError, setTranslationError] = useState<string>("");

  const translateText = async (text: string) => {
    try {
      const response = await fetch("/api/deepl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      const translatedText = data.translations[0].text; // Get the translated text
      const formattedTranslation = `<strong>${text}</strong>: ${translatedText}`;

      // Log translations to verify structure
      console.log("Setting translations:", formattedTranslation);
      setTranslations((prev) => [...prev, formattedTranslation]);
    } catch (error) {
      console.error("Translation error:", error);
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
