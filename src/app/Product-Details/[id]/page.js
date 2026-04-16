'use client'

import Image from "next/image"
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Package, Lock } from "lucide-react"
import { use, useContext, useEffect, useState } from "react"
import { AppContext } from "@/context/Appcontext"
import Card from "@/app/components/ProductCard"
import Link from "next/link"

export default function ProductPage({ params }) {
  const resolvedParams = use(params)
  const productId = resolvedParams.id

  const { user, loading, perfumesData, addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed } = useContext(AppContext)
  const isLoggedIn = !loading && !!user

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Find product by id
  const product = perfumesData.find((p) => p.id === productId)

  // Add to recently viewed when product loads
  useEffect(() => {
    if (product) addToRecentlyViewed(product)
  }, [product])

  if (!product && perfumesData.length > 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Product not found</h2>
          <Link href="/ProductList" className="text-[#E5A95E] hover:underline">← Back to Shop</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5A95E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Build images array (support single or multiple)
  const images = product.images?.length
    ? product.images
    : [product.imageUrl || product.image || '/placeholder.svg']

  const inWishlist = isInWishlist(product.id)
  const relatedProducts = perfumesData.filter((p) => p.id !== product.id).slice(0, 4)

  const fragranceNotes = [
    { label: 'Top Notes', value: product.topNotes || product.fragranceNotes?.top },
    { label: 'Heart Notes', value: product.middleNotes || product.fragranceNotes?.middle },
    { label: 'Base Notes', value: product.baseNotes || product.fragranceNotes?.base },
  ].filter((n) => n.value)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: images[0],
        volume: product.volume || '30ml',
      })
    }
  }

  const inStock = product.stock === undefined || product.stock > 0

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#E5A95E]">Home</Link>
          <span>/</span>
          <Link href="/ProductList" className="hover:text-[#E5A95E]">Shop</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Image gallery ── */}
          <div className="lg:sticky top-24">
            {/* Main image */}
            <div className="relative aspect-square bg-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800/50 mb-4">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
              {/* In Stock badge */}
              {inStock ? (
                <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-green-900/80 text-green-400 text-xs font-medium px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> In Stock
                </span>
              ) : (
                <span className="absolute top-4 left-4 bg-red-900/80 text-red-400 text-xs font-medium px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
              {/* Image nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#E5A95E]' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div>
            {product.brand && (
              <p className="text-[#E5A95E] text-sm font-medium tracking-wider uppercase mb-2">{product.brand}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Number(product.rating)
                          ? 'fill-[#E5A95E] text-[#E5A95E]'
                          : 'fill-gray-700 text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {product.rating} / 5 {product.reviews && `(${product.reviews} reviews)`}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#E5A95E]">Rs {product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">Rs {product.originalPrice}</span>
              )}
              {product.volume && (
                <span className="text-sm text-gray-500 ml-2">/ {product.volume}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>
            )}

            <hr className="border-gray-800 mb-6" />

            {/* Fragrance Notes */}
            {fragranceNotes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Fragrance Notes</h3>
                <div className="flex flex-col gap-2">
                  {fragranceNotes.map((note) => (
                    <div key={note.label} className="flex items-start gap-3">
                      <span className="text-xs font-medium text-[#E5A95E] bg-[#E5A95E]/10 px-2 py-0.5 rounded shrink-0 mt-0.5">{note.label}</span>
                      <span className="text-sm text-gray-400">{note.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">Quantity</h3>
              <div className="inline-flex items-center border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-gray-800 transition-colors text-lg leading-none"
                >
                  −
                </button>
                <span className="px-5 py-2.5 text-sm font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2.5 hover:bg-gray-800 transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoggedIn
                    ? 'bg-[#E5A95E] hover:bg-[#d49a4f] text-black hover:shadow-lg hover:shadow-[#E5A95E]/20'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {!inStock ? (
                  'Out of Stock'
                ) : isLoggedIn ? (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                ) : (
                  <><Lock className="w-4 h-4" /> Sign In to Buy</>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                title={isLoggedIn ? (inWishlist ? 'Remove from wishlist' : 'Save to wishlist') : 'Sign in to save'}
                className={`w-14 flex items-center justify-center rounded-xl border transition-all ${
                  inWishlist
                    ? 'bg-[#E5A95E]/10 border-[#E5A95E]/40 text-[#E5A95E]'
                    : 'border-gray-700 text-gray-400 hover:border-[#E5A95E]/40 hover:text-[#E5A95E]'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Sign-in nudge shown when not logged in */}
            {!isLoggedIn && !loading && (
              <p className="text-xs text-gray-500 mb-4">
                <Link href="/Sign-in" className="text-[#E5A95E] underline font-medium">Sign in</Link>
                {' '}or{' '}
                <Link href="/Sign-in" className="text-[#E5A95E] underline font-medium">create an account</Link>
                {' '}to add items to your cart.
              </p>
            )}

            {/* Delivery info */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4 flex items-start gap-3">
              <Package className="w-5 h-5 text-[#E5A95E] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Free delivery on orders over Rs 2000</p>
                <p className="text-xs text-gray-500 mt-0.5">Estimated delivery: 2–5 business days</p>
              </div>
            </div>

            <hr className="border-gray-800 my-6" />

            {/* Product details accordion */}
            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#080808] border-t border-gray-800 py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <Card products={p} key={p.id || i} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductDetails({ product }) {
  const [open, setOpen] = useState(null)

  const sections = [
    {
      title: 'Product Details',
      content: product.details || `Volume: ${product.volume || '—'} · Concentration: ${product.concentration || 'Eau de Parfum'} · Brand: ${product.brand || 'A.S Fragrance'}`,
    },
    {
      title: 'How to Use',
      content: product.howToUse || 'Spray onto pulse points — wrists, neck, and behind the ears. Apply after showering for longer-lasting scent.',
    },
    {
      title: 'Shipping & Returns',
      content: 'Orders are processed within 1–2 business days. Free shipping on orders over Rs 2000. Returns accepted within 7 days for unopened products.',
    },
  ]

  return (
    <div className="space-y-0">
      {sections.map((s) => (
        <div key={s.title} className="border-b border-gray-800">
          <button
            onClick={() => setOpen(open === s.title ? null : s.title)}
            className="w-full flex items-center justify-between py-4 text-sm font-medium text-white hover:text-[#E5A95E] transition-colors"
          >
            {s.title}
            <span className="text-lg leading-none">{open === s.title ? '−' : '+'}</span>
          </button>
          {open === s.title && (
            <p className="text-sm text-gray-400 pb-4 leading-relaxed">{s.content}</p>
          )}
        </div>
      ))}
    </div>
  )
}
