import { useState } from "react";

const useDeeplTranslate = () => {
  const [translations, setTranslations] = useState<string[]>([]);
  const [translationError, setTranslationError] = useState<string>("");

  const apiKey = process.env.DEEPL;

  // Hardcoded German target language code
  const targetLang: deepl.TargetLanguageCode = "de";

  const translateText = async (text: string) => {
    if (!apiKey) {
      setTranslationError("DEEPL environment variable not defined");
      return;
    }

    try {
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          auth_key: apiKey,
          text: text,
          target_lang: targetLang,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translations[0].text; // Get the translated text
      const formattedTranslation = `<strong>${text}</strong>: ${translatedText}`;
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
