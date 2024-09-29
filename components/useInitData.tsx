import { useState, useEffect } from "react";
import { initInitData, InitData } from "@telegram-apps/sdk";

export function useInitData() {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = () => {
      try {
        const data = initInitData();
        if (data) {
          setInitData(data);
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
            first_name: "John",
            last_name: "Doe",
            username: "johndoe",
            language_code: "en",
          },
          hash: "mock_hash",
          auth_date: "mock_auth_date",
          start_param: "mock_start_param",
          chat_type: "mock_chat_type",
          chat_instance: "mock_chat_instance",
        });
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  return { initData, error, loading };
}
