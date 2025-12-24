import { databases, ID, Query } from "../lib/appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_DAILY_SONGS_COLLECTION_ID,
  APPWRITE_USER_STREAKS_COLLECTION_ID,
} from "../config/config";

const today = () => new Date().toISOString().split("T")[0];

// ---------------------------
// Get song of the day
// ---------------------------
export async function getSongOfTheDay() {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_DAILY_SONGS_COLLECTION_ID,
    [
      Query.equal("date", today()),
      Query.equal("isWinner", true),
      Query.limit(1),
    ]
  );

  return res.documents[0] || null;
}

// ---------------------------
// Check if user already submitted today
// ---------------------------
export async function hasSubmittedToday(userId) {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_DAILY_SONGS_COLLECTION_ID,
    [
      Query.equal("date", today()),
      Query.equal("userId", userId),
      Query.limit(1),
    ]
  );

  return res.documents.length > 0;
}

// ---------------------------
// Submit daily song
// ---------------------------
export async function submitDailySong(user, song) {
  // Check if winner already exists
  const existingWinner = await getSongOfTheDay();

  const isWinner = !existingWinner;

  // Save song
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_DAILY_SONGS_COLLECTION_ID,
    ID.unique(),
    {
      userId: user.$id,
      username: user.name || user.email,
      trackName: song.trackName,
      artistName: song.artistName,
      artworkUrl: song.artworkUrl,
      previewUrl: song.previewUrl,
      date: today(),
      isWinner,
    }
  );

  // Update streak
  await updateStreak(user.$id);

  return doc;
}

// ---------------------------
// Update streak
// ---------------------------
async function updateStreak(userId) {
  const todayDate = today();
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_USER_STREAKS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.limit(1)]
  );

  if (res.documents.length === 0) {
    // First time
    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USER_STREAKS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        currentStreak: 1,
        lastSubmittedDate: todayDate,
      }
    );
    return;
  }

  const streakDoc = res.documents[0];
  const newStreak =
    streakDoc.lastSubmittedDate === yesterday
      ? streakDoc.currentStreak + 1
      : 1;

  await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_USER_STREAKS_COLLECTION_ID,
    streakDoc.$id,
    {
      currentStreak: newStreak,
      lastSubmittedDate: todayDate,
    }
  );
}

// ---------------------------
// Get user streak
// ---------------------------
export async function getUserStreak(userId) {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_USER_STREAKS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.limit(1)]
  );

  if (res.documents.length === 0) return 0;

  return res.documents[0].currentStreak || 0;
}
