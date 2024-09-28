import { NextRequest, NextResponse } from "next/server";
import * as deepl from "deepl-node";

export async function POST(req: NextRequest) {
  const { text, targetLang = "EN-US" } = await req.json();

  const apiKey = process.env.DEEPL;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPL_API_KEY environment variable not defined" },
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
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed." }, { status: 500 });
  }
}
