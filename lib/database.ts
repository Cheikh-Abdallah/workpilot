import { openDB, DBSchema } from "idb";
import { Activity } from "@/types/activity";

interface WorkPilotDB extends DBSchema {
  activities: {
    key: string;
    value: Activity;
  };
}

const DB_NAME = "workpilot-db";
const STORE_NAME = "activities";

async function getDatabase() {
  return openDB<WorkPilotDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    },
  });
}

export async function getAllActivities(): Promise<Activity[]> {
  const db = await getDatabase();
  return db.getAll(STORE_NAME);
}

export async function saveActivity(activity: Activity) {
  const db = await getDatabase();
  await db.put(STORE_NAME, activity);
}

export async function removeActivity(id: string) {
  const db = await getDatabase();
  await db.delete(STORE_NAME, id);
}

export async function initializeDatabase(
  demoActivities: Activity[]
) {
  const db = await getDatabase();
  const count = await db.count(STORE_NAME);

  if (count === 0) {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    for (const activity of demoActivities) {
      await transaction.store.put(activity);
    }

    await transaction.done;
  }

  return db.getAll(STORE_NAME);
}