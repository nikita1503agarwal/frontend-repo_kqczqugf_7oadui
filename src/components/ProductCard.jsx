export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      {product.image && (
        <img src={`${product.image}?auto=format&fit=crop&w=600&q=60`} alt={product.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-2 min-h-[3rem]">{product.title}</h3>
        <p className="text-slate-300 text-sm line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-blue-400 font-bold">${product.price.toFixed(2)}</span>
          <button onClick={() => onAdd(product)} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
