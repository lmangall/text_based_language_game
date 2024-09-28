import { NextRequest, NextResponse } from "next/server";
import * as deepl from "deepl-node";

export async function POST(req: NextRequest) {
  const { text, targetLang = "EN-US" } = await req.json();

  console.log("Received text:", text); // Log the received text
  console.log("Target language:", targetLang); // Log the target language

  const apiKey = process.env.DEEPL;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPL environment variable not defined" },
      { status: 500 }
    );
  }

  const serverUrl = process.env.DEEPL_SERVER_URL;
  const translator = new deepl.Translator(
    apiKey,
    serverUrl ? { serverUrl } : undefined
  );

  try {
    const result = await translator.translateText(text, null, targetLang);

    const translatedText = Array.isArray(result)
      ? result.map((r) => r.text).join(", ")
      : result.text;

    return NextResponse.json({ translatedText });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Translation error:", error); // Log the entire error object
      return NextResponse.json(
        { error: "Translation failed.", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "Translation failed.", details: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
