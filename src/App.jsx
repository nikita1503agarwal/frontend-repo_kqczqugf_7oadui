import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ProductCard from "./components/ProductCard";
import AuthModal from "./components/AuthModal";

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || "";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const cartCount = useMemo(() => cart.reduce((a, i) => a + i.quantity, 0), [cart]);

  const load = async () => {
    const [catsRes, prodsRes] = await Promise.all([
      fetch(`${backend}/categories`),
      fetch(`${backend}/products`),
    ]);
    setCategories(await catsRes.json());
    setProducts(await prodsRes.json());
  };

  const search = async (query, cat = category) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (cat) params.set("category", cat);
    const res = await fetch(`${backend}/products?${params.toString()}`);
    setProducts(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const checkout = async () => {
    if (!user) { setAuthOpen(true); return; }
    if (cart.length === 0) return;
    const items = cart.map(c => ({ product_id: c.id, title: c.title, price: c.price, quantity: c.quantity, image: c.image }));
    const address = "123 Test St, Test City";
    const res = await fetch(`${backend}/orders/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, items, address })
    });
    const data = await res.json();
    alert(`Order placed! Total $${data.total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar onSearch={(val)=>{ setQ(val); search(val); }} cartCount={cartCount} onAuthClick={()=>setAuthOpen(true)} />
      <CategoryBar categories={categories} onSelect={(c)=>{ setCategory(c); search(q, c); }} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </main>

      {/* Cart bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex gap-3 overflow-x-auto">
            {cart.map((c)=> (
              <div key={c.id} className="bg-slate-800/80 border border-slate-700 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                {c.title} × {c.quantity}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-400 font-semibold">${cart.reduce((a,i)=>a+i.price*i.quantity,0).toFixed(2)}</span>
            <button onClick={checkout} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">Checkout</button>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthed={setUser} />
    </div>
  );
}

export default App
