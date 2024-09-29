import { useState, useEffect } from "react";
import { initInitData, InitData } from "@telegram-apps/sdk";

export function useInitData() {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = () => {
      try {
        console.log("Attempting to initialize app...");
        const data = initInitData();
        console.log("Initial Data:", data); // Debugging statement

        // Check if the data has a nested initData property
        if (data && data.initData) {
          setInitData(data.initData);
        } else {
          throw new Error("InitData is undefined");
        }
      } catch (err) {
        console.error("Error initializing app:", err);
        setError(
          "Unable to initialize app. Please ensure you're running this in Telegram."
        );
        // Set mock data for development
        setInitData({
          user: {
            id: 12345,
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            languageCode: "en",
            isPremium: false,
            allowsWriteToPm: true,
          },
          hash: "mock_hash",
          authDate: new Date(),
          startParam: "mock_start_param",
          chatType: "mock_chat_type",
          chatInstance: "mock_chat_instance",
          queryId: "mock_query_id",
        });
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  return { initData, error, loading };
}
