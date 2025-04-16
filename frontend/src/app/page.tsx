// app/page.tsx
"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    // Check authentication status on page load
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
      } else {
        router.push("/auth/login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchItems();
    }
  }, [currentUser]);

  const fetchItems = async () => {
    if (!currentUser) return;
    console.log(currentUser.uid);
    const q = query(
      collection(db, "items"),
      where("createdBy", "==", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string }),
    }));
    setItems(docs);
  };

  const addItem = async () => {
    if (!newName) return;
    await addDoc(collection(db, "items"), {
      name: newName,
      createdBy: currentUser.uid,
    });
    setNewName("");
    fetchItems();
  };

  const updateItem = async () => {
    if (!editId || !editName) return;
    await updateDoc(doc(db, "items", editId), { name: editName });
    setEditId(null);
    setEditName("");
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
    fetchItems();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Firestore CRUD Demo</h1>
      {/* Current user */}
      <div className="flex justify-between items-center bg-blue-950 p-3 rounded">
        {currentUser?.email ? (
          <>
            <h1 className="font-black">Welcome, {currentUser.email}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* Add item */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New item name"
          className="border px-2 py-1 w-full"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* Edit item */}
      {editId && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Edit name"
            className="border px-2 py-1 w-full"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button
            onClick={updateItem}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      )}

      {/* Item list */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-blue-950 p-2 rounded"
          >
            <span className="font-black">{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditId(item.id);
                  setEditName(item.name);
                }}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
