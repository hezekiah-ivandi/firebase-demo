import { Router } from "express";
import { firebase_db } from "../config/firebase";

const router = Router();

// Create item
router.post("/items", async (req, res) => {
  try {
    const data = req.body;
    const ref = await firebase_db.collection("items").add(data);
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

//Read all items
router.get("/items", async (_req, res) => {
  try {
    const snapshot = await firebase_db.collection("items").get();
    const items = snapshot.docs.map(
      (doc: FirebaseFirestore.DocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

//Update item
router.put("/items/:id", async (req, res) => {
  try {
    await firebase_db.collection("items").doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

//Delete item
router.delete("/items/:id", async (req, res) => {
  try {
    await firebase_db.collection("items").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
