import { databases, ID } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_WISHLIST_COLLECTION_ID } from "../config/config";

// Add new item with ownerToken
export async function addWishlistItem(title, description, ownerToken) {
  return await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    ID.unique(),
    { title, description, ownerToken },
    // permissions: optional
    []
  );
}

// Update item — frontend only allows owner
export async function updateWishlistItem(itemId, title, description) {
  return await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    itemId,
    { title, description }
  );
}

// Delete item — frontend only allows owner
export async function deleteWishlistItem(itemId) {
  return await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID,
    itemId
  );
}

// Get all items
export async function getWishlist() {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_WISHLIST_COLLECTION_ID
  );
  return res.documents;
}
