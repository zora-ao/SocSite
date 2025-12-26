import { databases, ID, Query } from "../lib/appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_DAILY_SONGS_COLLECTION_ID,
  APPWRITE_USER_STREAKS_COLLECTION_ID,
} from "../config/config";
import { getProfile } from "../profile/profile";

const today = () => new Date().toISOString().split("T")[0];
const yesterday = () =>
  new Date(Date.now() - 86400000).toISOString().split("T")[0];

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

  // Fetch latest username from profile
  let profile = await getProfile(user.$id);
  const username = profile?.username || user.email;

  // Save song
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_DAILY_SONGS_COLLECTION_ID,
    ID.unique(),
    {
      userId: user.$id,
      username,
      trackName: song.trackName,
      artistName: song.artistName,
      artworkUrl: song.artworkUrl,
      previewUrl: song.previewUrl,
      date: today(),
      isWinner,
    }
  );

  // Update streak if user is the winner
  if (isWinner) {
    await updateStreak(user.$id);
  }

  return doc;
}

// ---------------------------
// Update streak (consecutive days)

async function updateStreak(userId) {
  // Fetch existing streak doc
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_USER_STREAKS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.limit(1)]
  );

  const todayDate = today();

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
  const lastDate = streakDoc.lastSubmittedDate;

  // Calculate new streak
  const last = new Date(lastDate);
  const diff = Math.floor(
    (new Date(todayDate) - last) / (1000 * 60 * 60 * 24)
  );

  const newStreak = diff === 1 ? streakDoc.currentStreak + 1 : 1;

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

// ---------------------------
// Optional: get all submissions by user (for streak calculation)
export async function getUserSubmissions(userId) {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_DAILY_SONGS_COLLECTION_ID,
    [Query.equal("userId", userId)]
  );
  return res.documents.map((doc) => ({ date: doc.date }));
}
