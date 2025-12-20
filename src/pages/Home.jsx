import { useEffect, useState } from "react";
import RantForm from "../components/RantForm";
import { getRants, deleteRant } from "../rants/rants";
import { Button } from "@/components/ui/button";

export default function Home({ user }) {
  const [rants, setRants] = useState([]);
  const [showRantForm, setShowRantForm] = useState(false);
  const [editingRant, setEditingRant] = useState(null);

  const loadRants = async () => {
    const data = await getRants();
    setRants(data);
  };

  useEffect(() => {
    loadRants();
  }, []);

  const handleDelete = async (rant) => {
    if (rant.userId !== user.$id) {
      return alert("You can only delete your own rants.");
    }
    await deleteRant(rant.$id);
    loadRants();
  };

  const handleEdit = (rant) => {
    if (rant.userId !== user.$id) {
      return alert("You can only edit your own rants.");
    }
    setEditingRant(rant);
    setShowRantForm(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <h1 className="text-2xl font-bold">Welcome, {user.name || user.email}</h1>

      {/* Button to toggle rant form */}
      <Button onClick={() => {
        setEditingRant(null);
        setShowRantForm((prev) => !prev);
      }}>
        {showRantForm ? "Cancel" : "Post a Rant"}
      </Button>

      {/* Rant form */}
      {showRantForm && (
        <RantForm
          user={user}
          editingRant={editingRant}
          onPosted={() => {
            loadRants();
            setShowRantForm(false);
          }}
        />
      )}

      {/* Rants list */}
      <div className="space-y-4">
        {rants.length === 0 && <p>No rants yet.</p>}
        {rants.map((rant) => (
          <div key={rant.$id} className="border p-3 rounded flex justify-between items-start">
            <div>
              <p>{rant.content}</p>
              <small>— {rant.username}</small>
            </div>
            {rant.userId === user.$id && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(rant)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(rant)}>X</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
