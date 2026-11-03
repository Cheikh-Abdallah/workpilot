"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity } from "@/types/activity";
import {
  initializeDatabase,
  saveActivity,
  removeActivity,
} from "@/lib/database";
import { demoActivities } from "@/lib/demo-data";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await initializeDatabase(demoActivities);
    setActivities(data);
  }, []);

  useEffect(() => {
    refresh()
      .catch((error) => {
        console.error("Erreur de chargement :", error);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  const addActivity = async (activity: Activity) => {
    await saveActivity(activity);
    await refresh();
  };

  const updateActivity = async (activity: Activity) => {
    await saveActivity(activity);
    await refresh();
  };

  const deleteActivity = async (id: string) => {
    await removeActivity(id);
    await refresh();
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    refresh,
  };
}