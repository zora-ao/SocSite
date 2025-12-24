// src/components/RantForm.jsx
import { useState, useEffect } from "react";
import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "../config/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateRant } from "../rants/rants"; // make sure this is correct

export default function RantForm({ user, editingRant, onPosted, onCancel }) {
  const [content, setContent] = useState(editingRant?.content || "");
  const [loading, setLoading] = useState(false);

  // Update content when editingRant changes
  useEffect(() => {
    setContent(editingRant?.content || "");
  }, [editingRant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      let result;

      if (editingRant) {
        // Update existing rant
        result = await updateRant(editingRant.$id, content);

        // Make sure userId and username are preserved if not returned by Appwrite
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
      onPosted?.(result);
    } catch (err) {
      console.error("Error saving rant:", err);
      alert(err.message || "Failed to save rant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Write your rant..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
      <div className="flex gap-2">
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
