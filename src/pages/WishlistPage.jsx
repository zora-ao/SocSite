import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import {
  getWishlist,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from "../wishlist/wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [ownerToken, setOwnerToken] = useState("");

  // ---------------------------
  // Init owner token
  // ---------------------------
  useEffect(() => {
    let token = localStorage.getItem("wishlistToken");
    if (!token) {
      token = uuidv4();
      localStorage.setItem("wishlistToken", token);
    }
    setOwnerToken(token);
  }, []);

  // ---------------------------
  // Load items
  // ---------------------------
  useEffect(() => {
    if (!ownerToken) return; // wait until token is ready
    loadItems();
  }, [ownerToken]);

  const loadItems = async () => {
    const data = await getWishlist();
    setItems(data);
  };

  // ---------------------------
  // Add / Update
  // ---------------------------
  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (!ownerToken) return alert("Owner token not initialized yet");

    if (editingId) {
      await updateWishlistItem(editingId, title, description);
      setEditingId(null);
    } else {
      await addWishlistItem(title, description, ownerToken);
    }

    setTitle("");
    setDescription("");
    loadItems();
  };

  // ---------------------------
  // Edit / Delete
  // ---------------------------
  const handleEdit = (item) => {
    if (item.ownerToken !== ownerToken) return;
    setEditingId(item.$id);
    setTitle(item.title);
    setDescription(item.description);
  };

  const handleDelete = async (item) => {
    if (item.ownerToken !== ownerToken) return;
    await deleteWishlistItem(item.$id);
    loadItems();
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Anonymous Wishlist</h1>

      {/* Form */}
      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          {editingId ? "Update Item" : "Add Item"}
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.length === 0 && <p>No items yet.</p>}

        {items.map((item) => {
          const isOwner = item.ownerToken === ownerToken;

          return (
            <div
              key={item.$id}
              className="border p-3 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>

              {/* ONLY OWNER SEES THIS */}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
