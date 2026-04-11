import { useState, useEffect } from "react";

export type CivicProfile = {
  borough: string;
  income: string;
  housing: string;
  age: string;
  issues: string[];
  demographics: string[];
};

export function useProfile() {
  const [profile, setProfile] = useState<CivicProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFromStorage = () => {
      const saved = localStorage.getItem("civic_profile");
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse civic_profile", e);
        }
      } else {
        setProfile(null);
      }
      setIsLoaded(true);
    };

    loadFromStorage();
    window.addEventListener("profile_updated", loadFromStorage);
    return () => window.removeEventListener("profile_updated", loadFromStorage);
  }, []);

  const saveProfile = (data: CivicProfile) => {
    localStorage.setItem("civic_profile", JSON.stringify(data));
    setProfile(data);
    window.dispatchEvent(new Event("profile_updated"));
  };

  const clearProfile = () => {
    localStorage.removeItem("civic_profile");
    setProfile(null);
    window.dispatchEvent(new Event("profile_updated"));
  };

  return { profile, isLoaded, saveProfile, clearProfile };
}
