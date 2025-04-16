"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { signInWithCustomToken } from "firebase/auth";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const router = useRouter();

  const handleRegister = async () => {
    const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
    try {
      const response = await fetch(`${BACKEND_URI}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      // Use the Firebase custom token to sign in
      await signInWithCustomToken(auth, data.token);

      router.push("/");
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">Register</h1>

      <input
        className="border p-2 mb-2 w-full max-w-sm"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full max-w-sm"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* <select
        className="border p-2 mb-4 w-full max-w-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select> */}

      <div className="flex gap-2">
        <button
          onClick={handleRegister}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Account
        </button>
        <p>
          or{" "}
          <a href="/auth/login" className="underline">
            login
          </a>
        </p>
      </div>
    </div>
  );
}
