import { databases, storage, ID } from "../lib/appwrite";
import {
    APPWRITE_DATABASE_ID,
    APPWRITE_MEMORIES_COLLECTION_ID,
    APPWRITE_MEMORIES_BUCKET_ID,
    } from "../config/config";

    // Upload memory
    export async function addMemory(file, caption, userId) {
    const uploadedFile = await storage.createFile(
        APPWRITE_MEMORIES_BUCKET_ID,
        ID.unique(),
        file
    );

    return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_MEMORIES_COLLECTION_ID,
        ID.unique(),
        {
        fileId: uploadedFile.$id,
        caption,
        userId,
        }
    );
    }

    // Get memories
    export async function getMemories() {
    const res = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_MEMORIES_COLLECTION_ID
    );
    return res.documents;
    }

    // Delete memory
    export async function deleteMemory(docId, fileId) {
    await storage.deleteFile(APPWRITE_MEMORIES_BUCKET_ID, fileId);
    await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_MEMORIES_COLLECTION_ID,
        docId
    );
}
