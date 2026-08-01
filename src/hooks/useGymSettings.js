import { useEffect, useState } from "react";
import { getGymSettings } from "../services/settings";

export function useGymSettings() {
  const [settings, setSettings] = useState({
    gym_name: "Malkia Fitness",
    phone: "",
    email: "",
    address: "",
    opening_time: "",
    closing_time: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await getGymSettings();

    if (!error && data) {
      setSettings(data);
    }

    setLoading(false);
  }

  return {
    settings,
    loading,
    reload: load,
  };
}