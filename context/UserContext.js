import { createContext, useState, useEffect } from "react";
import { useInitData } from "@/components/useInitData";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { initData, error, loading } = useInitData();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [interests, setInterests] = useState([]);
  const [preferencesSet, setPreferencesSet] = useState(false);

  useEffect(() => {
    if (initData) {
      setUserData(initData.user);
    }
  }, [initData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error initializing app:", error);
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        name,
        setName,
        city,
        setCity,
        gender,
        setGender,
        targetLanguage,
        setTargetLanguage,
        languageLevel,
        setLanguageLevel,
        interests,
        setInterests,
        preferencesSet,
        setPreferencesSet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
