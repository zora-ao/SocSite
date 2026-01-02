// src/pages/CalendarPage.jsx
import { useEffect, useState } from "react";
import { databases, ID } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, COLLECTION_ID } from "../config/config";

export default function CalendarPage({ user }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // current month info
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      // Fetch all events for everyone
      const res = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTION_ID);
      setEvents(res.documents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  function openModal(date) {
    setSelectedDate(date);
    const dayEvents = events.filter((e) => e.date === date);
    if (dayEvents.length > 0) {
      setTitle(dayEvents[0].title);
      setTime(dayEvents[0].time);
      setDescription(dayEvents[0].description || "");
    } else {
      setTitle("");
      setTime("");
      setDescription("");
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setTitle("");
    setTime("");
    setDescription("");
    setSelectedDate(null);
  }

  async function saveSchedule() {
    if (!title || !time || !user) return;

    try {
      await databases.createDocument(APPWRITE_DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        title,
        time,
        date: selectedDate,
        description,
      });
      closeModal();
      fetchEvents();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  }

  const getDayEvents = (date) => {
    return events
      .filter((e) => e.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const getDayAbbrev = (day, month, year) => {
    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center md:text-left">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h1>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 md:gap-4">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
          const dayEvents = getDayEvents(date);
          const dayAbbrev = getDayAbbrev(day, month, year);

          return (
            <div
              key={day}
              onClick={() => openModal(date)}
              className="bg-white border rounded-xl p-2 md:p-3 min-h-[80px] cursor-pointer hover:bg-gray-50 flex flex-col"
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  date === today.toISOString().split("T")[0] ? "text-purple-600" : ""
                }`}
              >
                {day} {dayAbbrev}
              </p>

              <div className="flex flex-col gap-1 overflow-y-auto max-h-28 md:max-h-32">
                {dayEvents.map((event) => (
                  <div
                    key={event.$id}
                    className="text-xs bg-purple-100 text-purple-700 rounded px-2 py-1 truncate"
                  >
                    <p className="font-semibold truncate">{event.title}</p>
                    <p className="text-[10px]">{formatTime12Hour(event.time)}</p>
                    {event.description && (
                      <p className="text-[10px] text-gray-500 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">{selectedDate}</h2>

            {/* Existing events */}
            {getDayEvents(selectedDate).length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Events:</h3>
                <div className="flex flex-col gap-2">
                  {getDayEvents(selectedDate).map((event) => (
                    <div
                      key={event.$id}
                      className="border-l-2 border-purple-600 pl-2 flex justify-between items-start"
                    >
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold truncate">{event.title}</p>
                        <p className="text-xs text-gray-600">{formatTime12Hour(event.time)}</p>
                        {event.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                        )}
                      </div>

                      {/* Only creator can delete */}
                      {event.userId === user.$id && (
                        <button
                          className="text-red-600 font-bold ml-2 text-sm hover:text-red-800"
                          onClick={async () => {
                            try {
                              await databases.deleteDocument(
                                APPWRITE_DATABASE_ID,
                                COLLECTION_ID,
                                event.$id
                              );
                              fetchEvents();
                            } catch (error) {
                              console.error("Error deleting event:", error);
                            }
                          }}
                          title="Delete this event"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new event */}
            <div className="flex flex-col gap-3">
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Occasion / Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="time"
                className="w-full border rounded px-3 py-2 text-sm"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 rounded bg-purple-600 text-white w-full sm:w-auto"
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
