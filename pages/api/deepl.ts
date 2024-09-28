import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;

  const apiKey = process.env.DEEPL;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "DEEPL environment variable not defined" });
  }

  const targetLang = "EN"; // Hardcoded language for the translation

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
    res.status(200).json(data);
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Failed to fetch translation." });
  }
}
