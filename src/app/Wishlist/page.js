'use client'
import { useContext } from 'react'
import { Heart, ShoppingCart, X, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AppContext } from '@/context/Appcontext'

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useContext(AppContext)

  const handleMoveToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.imageUrl || product.image || '/placeholder.svg',
      volume: product.volume || '30ml',
    })
    toggleWishlist(product)
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-20 h-20 text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save fragrances you love to revisit them later.</p>
          <Link
            href="/ProductList"
            className="inline-flex items-center gap-2 bg-[#E5A95E] hover:bg-[#d49a4f] text-black font-semibold px-8 py-3 rounded-full transition-all"
          >
            Explore Perfumes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/ProductList" className="text-gray-400 hover:text-[#E5A95E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <span className="text-gray-500 text-sm">({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden group">
              {/* Remove button */}
              <div className="relative">
                <div className="aspect-square bg-[#111] relative overflow-hidden">
                  <Image
                    src={product.imageUrl || product.image || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-black/90 transition-all"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{product.volume || '30ml'}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#E5A95E] font-bold">Rs {product.price}</span>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex items-center gap-1.5 bg-[#E5A95E] hover:bg-[#d49a4f] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
