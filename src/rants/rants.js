// src/rants/rants.js
import { databases, ID } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "../config/config";

// Create a rant
export async function createRant({ user, profile, content }) {
  return await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID,
    ID.unique(), // generate unique ID
    {
      content,
      userId: user.$id,
      username: profile.username,
      avatarId: profile.avatarId,
      createdAt: new Date().toISOString(),
    }
  );
}

// Get all rants
export async function getRants() {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID
  );
  return res.documents;
}

// Update a rant
export async function updateRant(rantId, updatedText) {
  return await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID,
    rantId,
    { content: updatedText }
  );
}

// Delete a rant
export async function deleteRant(rantId) {
  return await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_COLLECTION_ID,
    rantId
  );
}
