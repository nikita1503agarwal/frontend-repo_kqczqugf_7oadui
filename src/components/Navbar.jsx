import { ShoppingCart, Search, User } from "lucide-react";
import { useState } from "react";

export default function Navbar({ onSearch, cartCount, onAuthClick }) {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <a href="#" className="text-2xl font-bold text-white">Amazons</a>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-2xl relative">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==='Enter') onSearch(q) }}
              placeholder="Search products..."
              className="w-full bg-slate-800 text-white rounded-md pl-10 pr-3 py-2 outline-none border border-slate-700 focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <button onClick={onAuthClick} className="text-slate-200 hover:text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="hidden sm:block">Sign in</span>
        </button>
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-white" />
          {cartCount>0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1">{cartCount}</span>
          )}
        </div>
      </div>
    </header>
  );
}
