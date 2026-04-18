'use client'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/Appcontext";

export default function CartSidebar({ open, onClose }) {
  const { cart, removeFromCart, updateCartQuantity } = useContext(AppContext);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] z-[80] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C9A96E]" />
            <h2 className="text-base font-semibold text-white tracking-wide">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-[#C9A96E] text-[#0a0a0a] text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-[#0a0a0a] border-b border-[#1e1e1e] shrink-0">
            {shipping === 0 ? (
              <p className="text-xs text-green-400 font-medium">You've unlocked free shipping!</p>
            ) : (
              <>
                <p className="text-xs text-[#888] mb-1.5">
                  Add <span className="text-[#C9A96E] font-semibold">Rs {(2000 - subtotal).toLocaleString()}</span> more for free shipping
                </p>
                <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A96E] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-[#2a2a2a]" />
              <p className="text-[#555] text-sm">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-[#C9A96E] text-sm border border-[#C9A96E]/40 hover:border-[#C9A96E] px-5 py-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                {/* Image */}
                <Link
                  href={`/Product-Details/${item.id}`}
                  onClick={onClose}
                  className="w-20 h-20 bg-[#111] border border-[#1e1e1e] shrink-0 overflow-hidden"
                >
                  <Image
                    src={item.image || item.imageUrl || '/placeholder.svg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-1"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/Product-Details/${item.id}`}
                      onClick={onClose}
                      className="text-[13px] font-medium text-[#e0e0e0] hover:text-[#C9A96E] leading-snug line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#444] hover:text-red-400 transition-colors shrink-0 mt-0.5"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5">{item.volume || '30ml'}</p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center border border-[#2a2a2a] overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 hover:bg-[#1a1a1a] transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-3 h-3 text-[#888]" />
                      </button>
                      <span className="px-3 py-1 text-[13px] font-semibold text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-[#1a1a1a] transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#888]" />
                      </button>
                    </div>
                    <span className="text-[#C9A96E] text-[13px] font-semibold">
                      Rs {(Number(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#1e1e1e] px-5 py-5 space-y-3 shrink-0 bg-[#0a0a0a]">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-[#888]">
              <span>Subtotal</span>
              <span className="text-white font-medium">Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-[#888]">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white font-medium'}>
                {shipping === 0 ? 'Free' : `Rs ${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1 border-t border-[#1e1e1e]">
              <span className="text-white">Total</span>
              <span className="text-[#C9A96E]">Rs {total.toLocaleString()}</span>
            </div>

            {/* Checkout button */}
            <Link
              href="/Checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-[#C9A96E] hover:bg-[#E2C68A] text-[#0a0a0a] font-semibold py-3.5 text-sm tracking-wider uppercase transition-all hover:shadow-lg hover:shadow-[#C9A96E]/20"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onClose}
              className="w-full text-center text-[12px] text-[#555] hover:text-[#888] transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
