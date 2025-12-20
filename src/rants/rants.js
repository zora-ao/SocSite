// src/rants.js
import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "../config/config";

// Create a rant
export async function createRant(user, rantText) {
    return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        "unique()",
        {
        content: rantText,
        userId: user.$id,
        username: user.name,
        createdAt: new Date().toISOString(),
        }
    );
    }

    // Get all rants
    export async function getRants() {
    const res = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID);
    return res.documents;
    }

    // Update a rant
    export async function updateRant(rantId, updatedText) {
    return await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        rantId,
        {
        content: updatedText,
        }
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
