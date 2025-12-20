import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_WISHLIST_COLLECTION_ID } from "../config/config";

// Fetch all wishlist items
export async function getWishlist() {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID
  );
  return res.documents;
}

// Add new item
export async function addWishlistItem(title, description, ownerToken) {
  return await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    "unique()",
    { title, description, ownerToken }
  );
}

// Update item
export async function updateWishlistItem(itemId, title, description) {
  return await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    itemId,
    { title, description }
  );
}

// Delete item
export async function deleteWishlistItem(itemId) {
  return await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    itemId
  );
}
