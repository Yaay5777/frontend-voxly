// src/Auth.tsx
import React, { useState } from "react";
import { login, register } from "./api";

export default function Auth({ onAuth }: { onAuth: () => void }) {
  const [tab, setTab] = useState<"login"|"register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = tab === "login"
        ? await login(username, password)
        : await register(username, password, username + '@example.com', 'true');
      const token = res.data?.access_token;
      if (token) {
        localStorage.setItem("voxly_token", token);
        onAuth();
      } else {
        alert("No token returned");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err.message || "Auth failed");
    }
  }

  return (
    <div className="p-4 bg-white/4 rounded">
      <div className="flex gap-2 mb-3">
        <button onClick={()=>setTab("login")} className={tab==="login"?"font-bold":""}>Login</button>
        <button onClick={()=>setTab("register")} className={tab==="register"?"font-bold":""}>Register</button>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="p-2 rounded bg-black/20"/>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="p-2 rounded bg-black/20"/>
        <button type="submit" className="mt-2 bg-indigo-600 rounded px-3 py-2">{tab==="login"?"Login":"Create account"}</button>
      </form>
    </div>
  );
}
