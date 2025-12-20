import { useEffect, useState } from "react";
import { getWishlist, addWishlistItem, updateWishlistItem, deleteWishlistItem } from "../wishlist/wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [ownerToken, setOwnerToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("wishlistToken");
    if (!token) {
      token = uuidv4();
      localStorage.setItem("wishlistToken", token);
    }
    setOwnerToken(token);
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getWishlist();
    setItems(data);
  };

  const handleAddOrEdit = async () => {
    if (!title.trim()) return;

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

  const handleEdit = (item) => {
    if (item.ownerToken !== ownerToken) return alert("You can only edit your own items");
    setEditingId(item.$id);
    setTitle(item.title);
    setDescription(item.description);
  };

  const handleDelete = async (item) => {
    if (item.ownerToken !== ownerToken) return alert("You can only delete your own items");
    await deleteWishlistItem(item.$id);
    loadItems();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Anonymous Wishlist / Bucket List</h1>

      {/* Form */}
      <div className="space-y-2">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleAddOrEdit}>{editingId ? "Update Item" : "Add Item"}</Button>
      </div>

      {/* Wishlist items */}
      <div className="space-y-2 mt-6">
        {items.length === 0 && <p>No items yet.</p>}
        {items.map((item) => (
          <div key={item.$id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{item.title}</p>
              <small>{item.description}</small>
            </div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
