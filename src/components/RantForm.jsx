import { useState, useEffect } from "react";
import { databases } from "../lib/appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "../config/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateRant } from "../rants/rants"; // make sure this is imported

export default function RantForm({ user, onPosted, editingRant, onCancel }) {
  const [content, setContent] = useState(editingRant?.content || "");
  const [loading, setLoading] = useState(false);

  // If the editingRant changes, update the content
  useEffect(() => {
    setContent(editingRant?.content || "");
  }, [editingRant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      if (editingRant) {
        await updateRant(editingRant.$id, content); // Update existing rant
      } else {
        await databases.createDocument(
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
      onPosted();
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
