// src/pages/MemoriesPage.jsx
import { useEffect, useState } from "react";
import { addMemory, getMemories, deleteMemory } from "../memories/memories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "../auth/auth";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";
import { motion, AnimatePresence } from "framer-motion";

export default function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // for modal

  useEffect(() => {
    getCurrentUser().then(setUser);
    loadMemories();
  }, []);

  const loadMemories = async () => {
    const data = await getMemories();
    setMemories(data);
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    await addMemory(file, caption, user.$id);
    setFile(null);
    setCaption("");
    loadMemories();
  };

  const handleDelete = async (id, fileId) => {
    await deleteMemory(id, fileId);
    setMemories((prev) => prev.filter((m) => m.$id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl pacifico font-bold text-center">Memories</h1>

      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button className="bg-[#5D866C]" onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <AnimatePresence>
          {memories.map((m) => (
            <motion.div
              key={m.$id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer rounded overflow-hidden shadow-lg"
            >
              {/* Caption on top */}
              {m.caption && (
                <div className="absolute top-0 left-0 w-full bg-black/50 text-white text-sm p-1 z-10">
                  {m.caption}
                </div>
              )}

              {/* Delete X button */}
              {m.userId === user?.$id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.$id, m.fileId);
                  }}
                  className="absolute top-1 right-1 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 text-xs font-bold"
                >
                  ×
                </button>
              )}

              {/* Image */}
              <img
                src={storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, m.fileId).toString()}
                alt="memory"
                className="w-full h-60 object-cover"
                onClick={() => setSelectedImage(m)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, selectedImage.fileId).toString()}
              alt="memory"
              className="max-h-[80vh] max-w-[80vw] rounded shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
