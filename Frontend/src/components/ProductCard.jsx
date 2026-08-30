import { Link } from 'react-router-dom';

export default function ProductCard({ product, index = 0 }) {
  const image = product.images?.[0]?.url || product.images?.[0]?.thumbnail;
  const stallNo = String((index % 48) + 1).padStart(2, '0');

  return (
    <Link
      to={`/products/${product._id}`}
      className="card overflow-hidden group flex flex-col"
    >
      <div className="aspect-square bg-pine-50 overflow-hidden relative p-4">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pine-400 font-display text-sm">
            No image
          </div>
        )}
        <span className="absolute top-2 left-2 bg-ink/80 text-paper text-[10px] font-mono px-1.5 py-0.5 rounded-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          STALL №{stallNo}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        {product.category && <span className="eyebrow">{product.category}</span>}
        <h3 className="font-display font-semibold text-ink leading-snug line-clamp-2 group-hover:text-pine-600 transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="stall-tag text-pine-600 text-[15px]">
            {product.price?.currency === 'USD' ? '$' : '₹'}
            {product.price?.amount}
          </span>
          {product.stock === 0 && (
            <span className="badge bg-rust/10 text-rust">Sold out</span>
          )}
        </div>
      </div>
    </Link>
  );
}