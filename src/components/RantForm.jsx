// src/components/RantForm.jsx
import { useState, useEffect, useRef } from "react";
import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "../config/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateRant } from "../rants/rants"; // ensure this is correct
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

export default function RantForm({ user, editingRant, onPosted, onCancel }) {
  const [content, setContent] = useState(editingRant?.content || "");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef();

  // Update content when editingRant changes
  useEffect(() => {
    setContent(editingRant?.content || "");
  }, [editingRant]);

  // Close emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      let result;

      if (editingRant) {
        // Update existing rant
        result = await updateRant(editingRant.$id, content);
        // Preserve userId and username if not returned by Appwrite
        result = { ...editingRant, ...result, content };
      } else {
        // Create new rant
        if (!user) throw new Error("You must be logged in to post a rant.");

        result = await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          "unique()",
          {
            content,
            userId: user.$id,
            username: user.name || user.email,
          }
        );
      }

      setContent("");
      setShowEmojiPicker(false);
      onPosted?.(result);
    } catch (err) {
      console.error("Error saving rant:", err);
      alert(err.message || "Failed to save rant");
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (emoji) => {
    setContent((prev) => prev + emoji.native);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 relative">
      <Textarea
        placeholder="Write your rant..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      {/* Emoji Picker Toggle */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
      >
        😀 Add Emoji
      </Button>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 shadow-lg"
          style={{ maxWidth: "300px" }}
        >
          <Picker data={emojiData} onEmojiSelect={addEmoji} />
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>
          {editingRant ? "Update" : loading ? "Posting..." : "Post"}
        </Button>
        {editingRant && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
