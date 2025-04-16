import { Request, Response, Router } from "express";
import { firebaseAuth } from "../config/firebase";
import { AppDataSource } from "../config/postgres-db";
import { User } from "../entity/user.entity";
import bcrypt from "bcryptjs";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Register
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Firebase user
    const fbUser = await firebaseAuth.createUser({
      email,
      password,
    });

    // Save in PostgreSQL
    const user = userRepo.create({
      email,
      password: hashedPassword,
      firebase_uid: fbUser.uid,
    });
    await userRepo.save(user);

    // Generate custom token
    const token = await firebaseAuth.createCustomToken(fbUser.uid);
    res.status(201).json({ token });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // If user has no Firebase UID, create one and sync
    if (!user.firebase_uid) {
      const fbUser = await firebaseAuth.createUser({ email, password });
      user.firebase_uid = fbUser.uid;
      await userRepo.save(user);
    }

    // Generate custom token
    const token = await firebaseAuth.createCustomToken(user.firebase_uid);
    res.status(200).json({ token });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Failed to login" });
  }
});

export default router;
