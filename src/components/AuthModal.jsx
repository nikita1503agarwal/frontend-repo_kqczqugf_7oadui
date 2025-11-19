import { useState } from "react";

export default function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;
  const backend = import.meta.env.VITE_BACKEND_URL || "";

  const submit = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        const res = await fetch(`${backend}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, phone: phone || undefined, password, name })
        });
        if (!res.ok) throw new Error(await res.text());
        await res.json();
      }
      const res2 = await fetch(`${backend}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username || undefined, phone: phone || undefined, password })
      });
      if (!res2.ok) throw new Error(await res2.text());
      const data = await res2.json();
      onAuthed(data);
      onClose();
    } catch (e) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-3">
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full bg-slate-800 text-white rounded-md px-3 py-2 border border-slate-700" />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (+15551234567)" className="w-full bg-slate-800 text-white rounded-md px-3 py-2 border border-slate-700" />
          {mode === 'signup' && (
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full bg-slate-800 text-white rounded-md px-3 py-2 border border-slate-700" />
          )}
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-800 text-white rounded-md px-3 py-2 border border-slate-700" />
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex items-center justify-between mt-4">
          <button onClick={()=>setMode(mode==='login'?'signup':'login')} className="text-slate-300 hover:text-white text-sm">
            {mode==='login' ? 'Create an account' : 'Have an account? Sign in'}
          </button>
          <button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-md">
            {loading? 'Please wait...' : mode==='login' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
