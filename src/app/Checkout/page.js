'use client'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import Swal from 'sweetalert2';
import { AppContext } from "@/context/Appcontext";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const COUPONS = {
  WELCOME20: 20,
  SAVE10: 10,
  ASFF15: 15,
}

const SHIPPING_THRESHOLD = 2000
const SHIPPING_FEE = 200

export default function Checkout() {
  const { user, loading, cart, removeFromCart, updateCartQuantity, clearCart } = useContext(AppContext);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', address: '', city: '', notes: '' });
  const [formErrors, setFormErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = appliedCoupon ? Math.round((subtotal * COUPONS[appliedCoupon]) / 100) : 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!checkoutForm.name.trim()) errors.name = 'Full name is required';
    if (!checkoutForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!checkoutForm.address.trim()) errors.address = 'Address is required';
    if (!checkoutForm.city.trim()) errors.city = 'City is required';
    if (checkoutForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email)) {
      errors.email = 'Enter a valid email';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!validateForm()) return;

    setPlacing(true);
    try {
      const orderData = {
        items: cart,
        customer: checkoutForm,
        userId: user?.uid || null,
        userEmail: user?.email || checkoutForm.email || null,
        subtotal,
        shipping,
        discount,
        total,
        coupon: appliedCoupon || null,
        paymentMethod: 'COD',
        status: 'Pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();

      Swal.fire({
        title: 'Order Placed!',
        html: `<p>Thank you, <strong>${checkoutForm.name}</strong>!</p><p>Your order has been received and will be delivered soon.</p>`,
        icon: 'success',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#E5A95E',
        confirmButtonText: 'Continue Shopping',
      }).then(() => {
        window.location.href = '/ProductList';
      });
    } catch (err) {
      console.error('Order error:', err);
      Swal.fire({ title: 'Error', text: 'Failed to place order. Please try again.', icon: 'error', background: '#111', color: '#fff', confirmButtonColor: '#E5A95E' });
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some fragrances to get started.</p>
          <Link
            href="/ProductList"
            className="inline-flex items-center gap-2 bg-[#E5A95E] hover:bg-[#d49a4f] text-black font-semibold px-8 py-3 rounded-full transition-all"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/ProductList" className="text-gray-400 hover:text-[#E5A95E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <span className="text-gray-500 text-sm">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
                <div className="w-24 h-24 bg-[#111] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image || item.imageUrl || '/placeholder.svg'}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Volume: {item.volume || '30ml'}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 hover:bg-gray-800 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[#E5A95E] font-bold">Rs {(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#E5A95E]" /> Coupon Code
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#E5A95E]/10 border border-[#E5A95E]/30 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#E5A95E] font-mono font-semibold">{appliedCoupon} — {COUPONS[appliedCoupon]}% off</span>
                  <button onClick={removeCoupon} className="text-gray-500 hover:text-white text-xs">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    className="flex-1 bg-[#111] border border-gray-700 focus:border-[#E5A95E]/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-[#E5A95E] hover:bg-[#d49a4f] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
              <p className="text-xs text-gray-600 mt-2">Try: WELCOME20, SAVE10, ASFF15</p>
            </div>
          </div>

          {/* ── Order summary + checkout ── */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5">
              <h3 className="text-base font-bold mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `Rs ${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedCoupon})</span>
                    <span>−Rs {discount.toLocaleString()}</span>
                  </div>
                )}
                <hr className="border-gray-800 my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-[#E5A95E]">Rs {total.toLocaleString()}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500 mt-3">
                  Add Rs {(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            {/* Delivery form */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5">
              <h3 className="text-base font-bold mb-4">Delivery Details</h3>
              <div className="space-y-3">
                {[
                  { key: 'name',    placeholder: 'Full Name *',           type: 'text' },
                  { key: 'phone',   placeholder: 'Phone Number *',        type: 'tel' },
                  { key: 'email',   placeholder: 'Email (optional)',       type: 'email' },
                  { key: 'address', placeholder: 'Street Address *',      type: 'text' },
                  { key: 'city',    placeholder: 'City *',                type: 'text' },
                  { key: 'notes',   placeholder: 'Order notes (optional)', type: 'text' },
                ].map(({ key, placeholder, type }) => (
                  <div key={key}>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={checkoutForm[key]}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, [key]: e.target.value }))}
                      className={`w-full bg-[#111] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
                        formErrors[key] ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                      }`}
                    />
                    {formErrors[key] && <p className="text-red-400 text-xs mt-1">{formErrors[key]}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[#111] border border-gray-800 rounded-lg flex items-center gap-2">
                <span className="text-lg">💵</span>
                <div>
                  <p className="text-sm font-medium text-white">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive your order</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-4 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed bg-[#E5A95E] hover:bg-[#d49a4f] text-black hover:shadow-lg hover:shadow-[#E5A95E]/20"
              >
                {placing ? (
                  <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Placing Order…</>
                ) : (
                  <>Place Order · Rs {total.toLocaleString()}</>
                )}
              </button>
            </div>

            <Link href="/ProductList" className="block text-center text-sm text-gray-500 hover:text-[#E5A95E] transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
