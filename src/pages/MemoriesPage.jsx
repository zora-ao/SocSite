import { useEffect, useState } from "react";
import { addMemory, getMemories, deleteMemory } from "../memories/memories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "../auth/auth";
import { storage } from "../lib/appwrite";
import { APPWRITE_MEMORIES_BUCKET_ID } from "../config/config";

export default function MemoriesPage() {
    const [memories, setMemories] = useState([]);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser().then(setUser);
        loadMemories();
    }, []);

    const loadMemories = async () => {
        const data = await getMemories();
        setMemories(data);
    };

    const handleUpload = async () => {
        if (!file) return;
        await addMemory(file, caption, user.$id);
        setFile(null);
        setCaption("");
        loadMemories();
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-2xl font-bold">Memories</h1>

        <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <Input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <Button onClick={handleUpload}>Upload Memory</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
            {memories.map((m) => (
            <div key={m.$id} className="border rounded overflow-hidden">
                <img
                src={storage.getFileView(APPWRITE_MEMORIES_BUCKET_ID, m.fileId).toString()}
                alt="memory"
                className="w-full h-48 object-cover"
                />
                <div className="p-2 flex justify-between items-center">
                <p className="text-sm">{m.caption}</p>
                {m.userId === user?.$id && (
                    <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMemory(m.$id, m.fileId)}
                    >
                    Delete
                    </Button>
                )}
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
