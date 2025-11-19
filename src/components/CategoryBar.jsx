export default function CategoryBar({ categories, onSelect }) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-2 flex gap-4 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => onSelect(c.name)}
            className="text-slate-200 hover:text-white hover:bg-slate-700/60 px-3 py-1 rounded-md whitespace-nowrap"
          >
            {c.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
