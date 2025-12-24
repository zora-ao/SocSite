import { useEffect, useState } from "react";
import MusicSearch from "./searchSongs";
import { submitDailySong, hasSubmittedToday } from "./dailySongs";
import { Button } from "@/components/ui/button";

export default function DailySongSubmit({ user, onSubmitted }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    hasSubmittedToday(user.$id).then(setDisabled);
  }, [user]);

  if (disabled) {
    return (
      <p className="text-center text-gray-500">
        You already submitted a song today 🎧
      </p>
    );
  }

  const handleSubmit = async () => {
    await submitDailySong(user, selectedSong);
    setDisabled(true);
    onSubmitted?.();
  };

  return (
    <div className="space-y-4">
      {!selectedSong ? (
        <MusicSearch onSelect={setSelectedSong} />
      ) : (
        <div className="border p-3 rounded space-y-2">
          <img src={selectedSong.artworkUrl} className="w-32 rounded mx-auto" />
          <p className="text-center font-medium">{selectedSong.trackName}</p>
          <p className="text-center text-sm text-gray-500">
            {selectedSong.artistName}
          </p>
          <audio controls src={selectedSong.previewUrl} className="w-full" />
          <Button className="w-full" onClick={handleSubmit}>
            Submit Song of the Day
          </Button>
        </div>
      )}
    </div>
  );
}
