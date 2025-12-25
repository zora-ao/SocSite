import { useEffect, useState, useRef } from "react";
import { getAllProfiles } from "../profile/profile";
import { storage } from "../lib/appwrite";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";
import sound from './happy_birthday.mp3';
import confetti from "canvas-confetti";

export default function Birthdays() {
  const [birthdays, setBirthdays] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    async function loadBirthdays() {
      const allProfiles = await getAllProfiles();
      const today = new Date();

      const todayBirthdays = allProfiles.filter((p) => {
        if (!p.birthday) return false;
        const b = new Date(p.birthday);
        return b.getDate() === today.getDate() && b.getMonth() === today.getMonth();
      });

      setBirthdays(todayBirthdays);

      // Play birthday sound and trigger confetti if there are birthdays
      if (todayBirthdays.length > 0) {
        // Confetti effect
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Auto-play audio safely after a short delay
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              console.log("Autoplay prevented by browser, user gesture required.");
            });
          }
        }, 500);
      }
    }

    loadBirthdays();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 text-center relative">
      {/* Audio element */}
      <audio ref={audioRef}>
        <source src={sound} type="audio/mpeg" />
      </audio>

      {birthdays.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">🎉 Happy Birthday! 🎉</h1>
        </>
      )}

      <h2 className="text-2xl font-bold mb-4">Today's Birthdays</h2>

      {birthdays.length === 0 && <p>No birthdays today.</p>}

      {birthdays.map((p) => (
        <div key={p.$id} className="flex items-center gap-4 border p-3 rounded shadow-sm mb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                p.avatarId
                  ? storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, p.avatarId)
                  : undefined
              }
            />
            <AvatarFallback>{p.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{p.username}</p>
            <p className="text-sm text-gray-500">{p.course}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
