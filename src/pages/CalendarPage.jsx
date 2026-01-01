import { useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";
import { Query } from "appwrite";
import { APPWRITE_DATABASE_ID, COLLECTION_ID } from "../config/config";

export default function CalendarPage({ user }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // current date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based index
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // last day of month

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    if (!user) return;

    try {
      const res = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      setEvents(res.documents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  function openModal(date) {
    setSelectedDate(date);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setTitle("");
    setTime("");
    setDescription("");
  }

  async function saveSchedule() {
    if (!title || !time) return;

    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          title,
          time,
          date: selectedDate,
          description
        }
      );

      closeModal();
      fetchEvents();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h1>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const dayEvents = events.filter(e => e.date === date);

          return (
            <div
              key={day}
              onClick={() => openModal(date)}
              className={`bg-white border rounded-xl p-3 min-h-[100px] cursor-pointer hover:bg-gray-50 ${
                date === today.toISOString().split("T")[0] ? "border-purple-600" : ""
              }`}
            >
              <p className="text-sm font-medium mb-1">{day}</p>

              {dayEvents.map(event => (
                <div
                  key={event.$id}
                  className="text-xs bg-purple-100 text-purple-700 rounded px-2 py-1 mt-1 truncate"
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Add schedule – {selectedDate}
            </h2>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Occasion / Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="time"
              className="w-full border rounded px-3 py-2 mb-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 rounded bg-purple-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
