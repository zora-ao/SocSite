import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PROFILES_COLLECTION_ID,
} from "../config/config";

import { databases, Query, ID } from "../lib/appwrite"; // <-- import Query

export async function getProfile(userId) {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Return first document or null
    return res.documents[0] || null;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}


// Create profile (first login)
export async function createProfile(user) {
  return await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_PROFILES_COLLECTION_ID,
    ID.unique(),
    {
      userId: user.$id,
      username: user.name || user.email,
      bio: "",
      course: "",
      avatarId: "",
    }
  );
}

// Update profile
export async function updateProfile(profileId, data) {
  return await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_PROFILES_COLLECTION_ID,
    profileId,
    data
  );
}
