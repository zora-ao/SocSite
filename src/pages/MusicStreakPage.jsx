// src/pages/MusicStreakPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  getSongOfTheDay,
  submitDailySong,
  getUserSubmissions,
} from "../music/dailySongs";
import { searchSongs } from "../music/searchSongs";
import { getProfile } from "../profile/profile";
import playlist from "../assets/playlist1.png";

export default function MusicStreakPage({ user }) {
  const navigate = useNavigate();
  const [songOfTheDay, setSongOfTheDay] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Helper: calculate streak from submissions
  // ---------------------------
  const calculateStreak = (submissions) => {
    if (!submissions || submissions.length === 0) return 0;

    submissions.sort((a, b) => new Date(b.date) - new Date(a.date));

    let streakCount = 1;
    let previousDate = new Date(submissions[0].date);

    for (let i = 1; i < submissions.length; i++) {
      const currentDate = new Date(submissions[i].date);
      const diffDays = Math.floor(
        (previousDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streakCount++;
        previousDate = currentDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streakCount;
  };

  // ---------------------------
  // Load initial data
  // ---------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      const p = await getProfile(user.$id);
      setProfile(p);

      const todaySong = await getSongOfTheDay();
      setSongOfTheDay(todaySong);

      // Check if user already submitted today (or if someone else submitted)
      const submissions = await getUserSubmissions(user.$id);
      const today = new Date();
      const submittedToday = submissions.some((s) => {
        const d = new Date(s.date);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });
      setAlreadySubmitted(submittedToday || !!todaySong);

      // Calculate streak
      setStreak(calculateStreak(submissions));
    }

    load();
  }, [user]);

  // ---------------------------
  // Search songs
  // ---------------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const songs = await searchSongs(query);
    setResults(songs);
    setLoading(false);
  };

  // ---------------------------
  // Select a song
  // ---------------------------
  const handleSelectSong = async (song) => {
    try {
      const todaySong = await getSongOfTheDay();

      if (todaySong) {
        alert(
          `Sorry! Today's song has already been picked by ${todaySong.username}: "${todaySong.trackName}" by ${todaySong.artistName}`
        );
        setSongOfTheDay(todaySong);
        setAlreadySubmitted(true);
        return;
      }

      // Submit the song
      const saved = await submitDailySong(user, song);

      // Lock it for everyone
      setSongOfTheDay(saved);
      setAlreadySubmitted(true);
      setResults([]);
      setQuery("");

      // Update streak
      const submissions = await getUserSubmissions(user.$id);
      setStreak(calculateStreak(submissions));
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to submit song");
    }
  };

  if (!user || !profile)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative max-w-xl mx-auto mt-6 sm:px-6 inter">
      <img
        className="absolute h-26 -right-6 -top-10 rotate-12"
        src={playlist}
        alt="playlist"
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">🎵 Music Streak</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Search one song per day. First pick wins.
        </p>
      </motion.div>

      {/* Streak */}
      <Card className="mt-4">
        <CardContent className="p-4 flex justify-between">
          <span>🔥 Your Streak</span>
          <span className="font-bold">{streak} days</span>
        </CardContent>
      </Card>

      {/* Song of the Day */}
      {songOfTheDay && (
        <Card className="mt-4 bg-black text-white">
          <CardContent className="px-4 space-y-3">
            <h2 className="font-bold text-lg sm:text-xl">🏆 Song of the Day</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={songOfTheDay.artworkUrl}
                className="w-full sm:w-24 h-36 rounded object-cover"
              />
              <div>
                <p className="font-semibold text-sm sm:text-base">
                  {songOfTheDay.trackName}
                </p>
                <p className="text-xs sm:text-sm">{songOfTheDay.artistName}</p>
                <p className="text-xs">Picked by {songOfTheDay.username}</p>
                <audio
                  controls
                  src={songOfTheDay.previewUrl}
                  className="w-full sm:w-64 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Section */}
      {!alreadySubmitted && (
        <Card className="mt-4">
          <CardContent className="p-4 space-y-3">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                placeholder="Search a song..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>

            <div className="space-y-2 mt-2">
              {results.map((song, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col sm:flex-row gap-3 items-center border p-2 rounded cursor-pointer"
                  onClick={() => handleSelectSong(song)}
                >
                  <img
                    src={song.artworkUrl}
                    className="w-24 h-24 sm:w-14 sm:h-14 rounded object-cover"
                    alt={song.trackName}
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-semibold text-sm sm:text-base">
                      {song.trackName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {song.artistName}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alreadySubmitted && !songOfTheDay && (
        <p className="text-center text-gray-500 mt-4">
          Someone already submitted today 🎧
        </p>
      )}
    </div>
  );
}
