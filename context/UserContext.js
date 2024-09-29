import { createContext, useState, useEffect } from "react";
import { useInitData } from "@/components/useInitData";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { initData, error, loading } = useInitData();
  const [userData, setUserData] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("FR"); // Hardcoded for now
  const [level, setLevel] = useState("A1"); // Hardcoded for now
  const [name, setName] = useState("John Doe"); // Hardcoded for now

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
        targetLanguage,
        setTargetLanguage,
        level,
        setLevel,
        name,
        setName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
