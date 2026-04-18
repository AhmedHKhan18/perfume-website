'use client'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, CreditCard, Wallet, Banknote, Lock } from "lucide-react";
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

const COUNTRIES = [
  'Pakistan', 'Afghanistan', 'Australia', 'Bahrain', 'Bangladesh', 'Canada',
  'China', 'Egypt', 'France', 'Germany', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Italy', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Lebanon', 'Malaysia',
  'Maldives', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
  'Oman', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Yemen',
]

export default function Checkout() {
  const { user, loading, cart, removeFromCart, updateCartQuantity, clearCart } = useContext(AppContext);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', address: '', apartment: '', city: '', country: 'Pakistan', postalCode: '', notes: '' });
  const [formErrors, setFormErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'wallet'
  const [cardDetails, setCardDetails] = useState({ number: '', holder: '', expiry: '', cvv: '' });
  const [walletType, setWalletType] = useState('easypaisa'); // 'easypaisa' | 'jazzcash'
  const [walletPhone, setWalletPhone] = useState('');

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
    if (!checkoutForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email)) errors.email = 'Enter a valid email';
    if (!checkoutForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!checkoutForm.address.trim()) errors.address = 'Address is required';
    if (!checkoutForm.city.trim()) errors.city = 'City is required';
    if (!checkoutForm.country.trim()) errors.country = 'Country is required';
    if (paymentMethod === 'card') {
      if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) errors.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardDetails.holder.trim()) errors.cardHolder = 'Cardholder name is required';
      if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errors.cardExpiry = 'Enter expiry as MM/YY';
      if (!cardDetails.cvv.match(/^\d{3,4}$/)) errors.cardCvv = 'Enter a valid CVV';
    }
    if (paymentMethod === 'wallet') {
      if (!walletPhone.trim().match(/^03\d{9}$/)) errors.walletPhone = 'Enter a valid Pakistani mobile number (03XXXXXXXXX)';
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
        paymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod === 'card' ? 'Card' : paymentMethod === 'bank' ? 'Bank Deposit' : `Wallet (${walletType})`,
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
                {/* Name */}
                {[
                  { key: 'name',  placeholder: 'Full Name *',    type: 'text' },
                  { key: 'email', placeholder: 'Email *',         type: 'email' },
                  { key: 'phone', placeholder: 'Phone Number *',  type: 'tel' },
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

                {/* Country */}
                <div>
                  <select
                    value={checkoutForm.country}
                    onChange={(e) => setCheckoutForm((f) => ({ ...f, country: e.target.value }))}
                    className={`w-full bg-[#111] border rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-colors appearance-none ${
                      formErrors.country ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                    }`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-[#111]">{c}</option>
                    ))}
                  </select>
                  {formErrors.country && <p className="text-red-400 text-xs mt-1">{formErrors.country}</p>}
                </div>

                {/* Street Address */}
                <div>
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm((f) => ({ ...f, address: e.target.value }))}
                    className={`w-full bg-[#111] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
                      formErrors.address ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                    }`}
                  />
                  {formErrors.address && <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>}
                </div>

                {/* Apartment */}
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={checkoutForm.apartment}
                  onChange={(e) => setCheckoutForm((f) => ({ ...f, apartment: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 focus:border-[#E5A95E]/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />

                {/* City + Postal Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="City *"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm((f) => ({ ...f, city: e.target.value }))}
                      className={`w-full bg-[#111] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
                        formErrors.city ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                      }`}
                    />
                    {formErrors.city && <p className="text-red-400 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                  <input
                    type="text"
                    placeholder="Postal Code (optional)"
                    value={checkoutForm.postalCode}
                    onChange={(e) => setCheckoutForm((f) => ({ ...f, postalCode: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-700 focus:border-[#E5A95E]/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>

                {/* Notes */}
                <input
                  type="text"
                  placeholder="Order notes (optional)"
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 focus:border-[#E5A95E]/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>

              {/* Payment method selector */}
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-white mb-3">Payment Method</h4>
                <div className="space-y-2">

                  {/* COD — active */}
                  {[
                    { id: 'cod',  label: 'Cash on Delivery', sub: 'Pay when you receive your order', icon: <Banknote className="w-4 h-4" /> },
                    { id: 'bank', label: 'Bank Deposit',      sub: 'Direct bank transfer',            icon: <CreditCard className="w-4 h-4" /> },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === opt.id
                          ? 'border-[#E5A95E]/60 bg-[#E5A95E]/5'
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.id}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="accent-[#E5A95E]"
                      />
                      <span className={paymentMethod === opt.id ? 'text-[#E5A95E]' : 'text-gray-400'}>{opt.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.sub}</p>
                      </div>
                    </label>
                  ))}

                  {/* Card + Wallet — locked / coming soon */}
                  {[
                    { id: 'card',   label: 'Debit / Credit Card', sub: 'Visa, Mastercard, UnionPay', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'wallet', label: 'Mobile Wallet',        sub: 'Easypaisa or JazzCash',      icon: <Wallet className="w-4 h-4" /> },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 opacity-50 cursor-not-allowed select-none"
                    >
                      <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                      <span className="text-gray-600">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">{opt.label}</p>
                        <p className="text-xs text-gray-600">{opt.sub}</p>
                      </div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-600 border border-gray-700 px-2 py-0.5 rounded-full shrink-0">
                        Coming Soon
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card details */}
                {paymentMethod === 'card' && (
                  <div className="mt-3 space-y-3 p-4 bg-[#111] border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400">Secured & encrypted</span>
                    </div>
                    {/* Card number */}
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const fmt = raw.match(/.{1,4}/g)?.join(' ') || raw;
                          setCardDetails((d) => ({ ...d, number: fmt }));
                        }}
                        className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none tracking-widest ${
                          formErrors.cardNumber ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                        }`}
                      />
                      {formErrors.cardNumber && <p className="text-red-400 text-xs mt-1">{formErrors.cardNumber}</p>}
                    </div>
                    {/* Cardholder */}
                    <div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails((d) => ({ ...d, holder: e.target.value }))}
                        className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none ${
                          formErrors.cardHolder ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                        }`}
                      />
                      {formErrors.cardHolder && <p className="text-red-400 text-xs mt-1">{formErrors.cardHolder}</p>}
                    </div>
                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                            setCardDetails((d) => ({ ...d, expiry: v }));
                          }}
                          className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none ${
                            formErrors.cardExpiry ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                          }`}
                        />
                        {formErrors.cardExpiry && <p className="text-red-400 text-xs mt-1">{formErrors.cardExpiry}</p>}
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails((d) => ({ ...d, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none ${
                            formErrors.cardCvv ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                          }`}
                        />
                        {formErrors.cardCvv && <p className="text-red-400 text-xs mt-1">{formErrors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Wallet details */}
                {paymentMethod === 'wallet' && (
                  <div className="mt-3 space-y-3 p-4 bg-[#111] border border-gray-800 rounded-lg">
                    {/* Wallet type toggle */}
                    <div className="flex gap-2">
                      {['easypaisa', 'jazzcash'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWalletType(w)}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors capitalize ${
                            walletType === w
                              ? 'bg-[#E5A95E] border-[#E5A95E] text-black'
                              : 'border-gray-700 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {w === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}
                        </button>
                      ))}
                    </div>
                    {/* Wallet phone */}
                    <div>
                      <input
                        type="tel"
                        placeholder="Registered mobile number (03XXXXXXXXX)"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none ${
                          formErrors.walletPhone ? 'border-red-500' : 'border-gray-700 focus:border-[#E5A95E]/50'
                        }`}
                      />
                      {formErrors.walletPhone && <p className="text-red-400 text-xs mt-1">{formErrors.walletPhone}</p>}
                    </div>
                    <p className="text-xs text-gray-500">You will receive a payment request on your {walletType === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} account.</p>
                  </div>
                )}

                {/* Bank deposit details */}
                {paymentMethod === 'bank' && (
                  <div className="mt-3 p-4 bg-[#111] border border-gray-800 rounded-lg space-y-3">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Transfer the total amount to the account below and place your order. Your order will be processed once payment is confirmed.
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'A/C Title', value: 'A.S Fragrance' },
                        { label: 'A/C #',     value: '1234567890' },
                        { label: 'IBAN #',    value: 'PK36MEZN0001234567890101' },
                        { label: 'Bank',      value: 'Meezan Bank' },
                      ].map(({ label, value }) => (
                        <div key={label} className="py-2 border-b border-gray-800 last:border-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 shrink-0 w-16">{label}</span>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(value)}
                              className="text-[10px] text-[#E5A95E] border border-[#E5A95E]/30 hover:border-[#E5A95E] px-2 py-0.5 rounded transition-colors shrink-0"
                            >
                              Copy
                            </button>
                          </div>
                          <span className="text-sm font-mono font-medium text-white break-all mt-1 block">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-500/80">Please include your name as the payment reference.</p>
                  </div>
                )}
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
