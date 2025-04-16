import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
} as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAdmin = admin; // full admin SDK
export const firebaseAuth = admin.auth(); // auth manager
export const firebase_db = admin.firestore(); // firestore db
