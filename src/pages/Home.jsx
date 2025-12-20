import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

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
    <div className="w-2/3 mx-auto space-y-6 mt-10">
      <div className="flex justify-between"> 
        <h1 className="text-2xl font-bold">Welcome, {user.name || user.email}</h1>

        {/* Button to toggle rant form */}
        <Button onClick={() => {
          setEditingRant(null);
          setShowRantForm((prev) => !prev);
        }}>
          {showRantForm ? "Cancel" : "Post a Rant"}
        </Button>
      </div>

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
          <div
              key={rant.$id}
              className="border p-4 rounded space-y-2"
            >
              {/* Header: avatar + name + menu */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rant.avatarUrl} />
                    <AvatarFallback>
                      {rant.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <p className="font-semibold text-sm">
                    {rant.username}
                  </p>
                </div>

                {rant.userId === user.$id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(rant)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(rant)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Content */}
              <p className="text-sm whitespace-pre-wrap">
                {rant.content}
              </p>
            </div>

        ))}
      </div>
    </div>
  );
}
