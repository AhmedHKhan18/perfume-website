'use client'
import { Star, Heart, ShoppingCart, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/Appcontext";

export default function Card({ products, index }) {
  const { user, loading, addToCart, toggleWishlist, isInWishlist } = useContext(AppContext);
  const wished    = isInWishlist(products.id);
  const isLoggedIn = !loading && !!user;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id:     products.id,
      name:   products.name,
      price:  Number(products.price),
      image:  products.imageUrl || products.image || '/placeholder.svg',
      volume: products.volume || '30ml',
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id:       products.id,
      name:     products.name,
      price:    Number(products.price),
      imageUrl: products.imageUrl || products.image || '/placeholder.svg',
      volume:   products.volume || '30ml',
      rating:   products.rating,
      reviews:  products.reviews,
    });
  };

  return (
    <Link href={`/Product-Details/${products.id}`} className="block group card-shine">
      <div className="bg-[#111] border border-[#1e1e1e] group-hover:border-[#C9A96E]/30 transition-all duration-400">

        {/* Image area */}
        <div className="relative aspect-[4/5] bg-[#131313] overflow-hidden">
          <Image
            src={products.imageUrl || products.image || '/placeholder.svg'}
            alt={products.name}
            fill
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            title={isLoggedIn ? (wished ? 'Remove from wishlist' : 'Add to wishlist') : 'Sign in to save'}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center border transition-all duration-200 ${
              wished
                ? 'bg-[#C9A96E] border-[#C9A96E] text-[#0a0a0a]'
                : 'bg-[#0a0a0a]/80 border-[#2a2a2a] text-[#666] hover:border-[#C9A96E]/60 hover:text-[#C9A96E]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-current' : ''}`} />
          </button>

          {/* Add to cart — slides up */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              title={isLoggedIn ? 'Add to cart' : 'Sign in to add to cart'}
              className={`w-full py-3 text-[12px] font-semibold tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-colors ${
                isLoggedIn
                  ? 'bg-[#C9A96E] hover:bg-[#E2C68A] text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] hover:bg-[#222] text-[#888]'
              }`}
            >
              {isLoggedIn
                ? <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
                : <><Lock className="w-3.5 h-3.5" /> Sign In to Buy</>
              }
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4 border-t border-[#1a1a1a]">
          {/* Stars */}
          {products.rating > 0 && (
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < (products.rating || 0) ? 'fill-[#C9A96E] text-[#C9A96E]' : 'fill-[#2a2a2a] text-[#2a2a2a]'}`} />
              ))}
              {products.reviews > 0 && (
                <span className="text-[10px] text-[#555] ml-1.5">({products.reviews})</span>
              )}
            </div>
          )}

          <h3 className="text-[13px] font-medium text-[#e0e0e0] truncate leading-snug mb-1">
            {products.name}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <span className="font-playfair text-[#C9A96E] font-semibold text-[15px]">
              Rs {Number(products.price).toLocaleString()}
            </span>
            <span className="text-[11px] text-[#444]">{products.volume || '30ml'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
