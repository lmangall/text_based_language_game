import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  name: string;
  setName: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  targetLanguage: string;
  setTargetLanguage: (value: string) => void;
  languageLevel: string;
  setLanguageLevel: (value: string) => void;
  interests: string[];
  setInterests: (value: string[]) => void;
  preferencesSet: boolean;
  setPreferencesSet: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [preferencesSet, setPreferencesSet] = useState(false);

  return (
    <UserContext.Provider
      value={{
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

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
