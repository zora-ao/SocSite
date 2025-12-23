import { storage, ID } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";

export async function uploadAvatar(file) {
  const res = await storage.createFile(
    APPWRITE_MEMORIES_BUCKET_ID,
    ID.unique(),
    file
  );

  return res.$id;
}
