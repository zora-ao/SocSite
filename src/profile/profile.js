import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PROFILES_COLLECTION_ID,
} from "../config/config";

import { databases, Query, ID } from "../lib/appwrite"; // <-- import Query

// ---------------------------
// Get profile by userId
// ---------------------------
export async function getProfile(userId) {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return res.documents[0] || null;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}

// ---------------------------
// Get all profiles
// ---------------------------
export async function getAllProfiles() {
  try {
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID
    );
    return res.documents || [];
  } catch (err) {
    console.error("Failed to fetch all profiles:", err);
    return [];
  }
}

// ---------------------------
// Create profile (first login)
// ---------------------------
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
      birthday: "", // make sure birthday field exists
    }
  );
}

// ---------------------------
// Update profile
// ---------------------------
export async function updateProfile(profileId, data) {
  return await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_PROFILES_COLLECTION_ID,
    profileId,
    data
  );
}
