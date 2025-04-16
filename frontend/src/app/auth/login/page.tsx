"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
    try {
      console.log(BACKEND_URI);
      const response = await fetch(`${BACKEND_URI}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      // Use the Firebase custom token to sign in
      await signInWithCustomToken(auth, data.token);

      router.push("/");
    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        className="border p-2 mb-2 w-full max-w-sm"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-4 w-full max-w-sm"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
        <p>
          or{" "}
          <a href="/auth/register" className="underline">
            register
          </a>
        </p>
      </div>
    </div>
  );
}
