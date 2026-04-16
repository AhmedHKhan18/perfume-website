'use client'

import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppContext } from '@/context/Appcontext'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { auth, db } from '@/firebaseConfig'
import { toast } from 'react-toastify'
import { User, ShoppingBag, Heart, Lock, LogOut, ChevronRight, Package, ArrowLeft } from 'lucide-react'

/* ── Small reusable input ── */
function Input({ label, type = 'text', value, onChange, disabled, placeholder }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#555] mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[#111] border border-[#232323] text-[#f5f5f0] text-sm placeholder-[#444] outline-none focus:border-[#C9A96E]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  )
}

const STATUS_COLOR = {
  Pending:    'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
  Processing: 'bg-blue-900/40   text-blue-400   border-blue-800/40',
  Shipped:    'bg-purple-900/40 text-purple-400  border-purple-800/40',
  Delivered:  'bg-green-900/40  text-green-400   border-green-800/40',
  Cancelled:  'bg-red-900/40    text-red-400     border-red-800/40',
}

export default function ProfilePage() {
  const { user, loading, handleLogout, wishlist } = useContext(AppContext)
  const router = useRouter()

  const [activeTab, setActiveTab]   = useState('profile')
  const [orders, setOrders]         = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  /* profile form */
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving]           = useState(false)

  /* password form */
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)

  /* redirect if not logged in */
  useEffect(() => {
    if (!loading && !user) router.push('/Sign-in')
  }, [user, loading, router])

  /* seed display name */
  useEffect(() => {
    if (user) setDisplayName(user.displayName || '')
  }, [user])

  /* fetch orders */
  useEffect(() => {
    if (!user || activeTab !== 'orders') return
    const fetch = async () => {
      setOrdersLoading(true)
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        /* index may not exist yet — silently fall back to empty */
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }
    fetch()
  }, [user, activeTab])

  const saveName = async (e) => {
    e.preventDefault()
    if (!displayName.trim()) return
    setSaving(true)
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() })
      toast.success('Name updated!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    if (pwForm.next.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setPwSaving(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, pwForm.current)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, pwForm.next)
      toast.success('Password updated!')
      setPwForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.code === 'auth/wrong-password' ? 'Current password is incorrect' : err.message)
    } finally {
      setPwSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile',   icon: User },
    { id: 'orders',  label: 'Orders',    icon: ShoppingBag },
    { id: 'wishlist',label: 'Wishlist',  icon: Heart },
    { id: 'security',label: 'Security',  icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">

      {/* Page header */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] px-6 md:px-8 py-10">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[#555] hover:text-[#C9A96E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[#C9A96E] text-[11px] font-semibold tracking-[0.25em] uppercase mb-1">Account</p>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold">
              {user.displayName || 'My Profile'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="md:w-56 shrink-0">
            {/* avatar */}
            <div className="flex flex-col items-center bg-[#0f0f0f] border border-[#1e1e1e] p-6 mb-4">
              <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <p className="text-sm font-semibold text-[#f5f5f0] text-center truncate w-full text-center">
                {user.displayName || 'User'}
              </p>
              <p className="text-[11px] text-[#555] truncate w-full text-center mt-0.5">{user.email}</p>
            </div>

            {/* nav */}
            <nav className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-[13px] font-medium transition-colors border-b border-[#1a1a1a] last:border-0 ${
                    activeTab === id
                      ? 'text-[#C9A96E] bg-[#C9A96E]/5'
                      : 'text-[#666] hover:text-[#f5f5f0] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
              <button
                onClick={() => { handleLogout(); router.push('/') }}
                className="w-full flex items-center gap-2.5 px-4 py-3.5 text-[13px] text-red-400 hover:bg-[#1a1a1a] transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </nav>
          </aside>

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">

            {/* ── Profile tab ── */}
            {activeTab === 'profile' && (
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 md:p-8">
                <h2 className="font-playfair text-xl font-bold mb-6">Personal Information</h2>
                <form onSubmit={saveName} className="space-y-5 max-w-md">
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={user.email || ''}
                    disabled
                  />
                  <Input
                    label="Account Created"
                    value={user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '—'}
                    disabled
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#C9A96E] hover:bg-[#E2C68A] disabled:opacity-60 text-[#0a0a0a] text-[12px] font-semibold tracking-[0.12em] uppercase px-8 py-3 transition-colors flex items-center gap-2"
                  >
                    {saving
                      ? <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                      : 'Save Changes'
                    }
                  </button>
                </form>
              </div>
            )}

            {/* ── Orders tab ── */}
            {activeTab === 'orders' && (
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 md:p-8">
                <h2 className="font-playfair text-xl font-bold mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-7 h-7 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-14 h-14 text-[#2a2a2a] mx-auto mb-4" />
                    <p className="text-[#555] text-sm">No orders yet</p>
                    <Link href="/ProductList" className="mt-4 inline-block text-[12px] text-[#C9A96E] border-b border-[#C9A96E]/40 hover:border-[#C9A96E] pb-0.5 tracking-wider uppercase transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-[#1e1e1e] p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                          <div>
                            <p className="text-[11px] text-[#555] tracking-wider uppercase mb-1">Order ID</p>
                            <p className="text-sm font-mono text-[#aaa]">{order.id.slice(0, 12).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-[#555] tracking-wider uppercase mb-1">Date</p>
                            <p className="text-sm text-[#aaa]">
                              {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                                : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-[#555] tracking-wider uppercase mb-1">Total</p>
                            <p className="text-sm font-semibold text-[#C9A96E]">Rs {order.total?.toLocaleString()}</p>
                          </div>
                          <span className={`self-start text-[11px] font-semibold tracking-wider uppercase px-3 py-1 border ${STATUS_COLOR[order.status] || STATUS_COLOR.Pending}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        {/* items */}
                        <div className="space-y-2 pt-4 border-t border-[#1a1a1a]">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-[#888]">{item.name} <span className="text-[#555]">× {item.quantity}</span></span>
                              <span className="text-[#666]">Rs {(Number(item.price) * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Wishlist tab ── */}
            {activeTab === 'wishlist' && (
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 md:p-8">
                <h2 className="font-playfair text-xl font-bold mb-6">Saved Items</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-14 h-14 text-[#2a2a2a] mx-auto mb-4" />
                    <p className="text-[#555] text-sm">Your wishlist is empty</p>
                    <Link href="/ProductList" className="mt-4 inline-block text-[12px] text-[#C9A96E] border-b border-[#C9A96E]/40 hover:border-[#C9A96E] pb-0.5 tracking-wider uppercase transition-colors">
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(item => (
                      <Link
                        key={item.id}
                        href={`/Product-Details/${item.id}`}
                        className="flex items-center gap-4 p-4 border border-[#1e1e1e] hover:border-[#C9A96E]/30 transition-colors group"
                      >
                        <div className="w-16 h-16 bg-[#131313] border border-[#1e1e1e] flex items-center justify-center shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl || item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#e0e0e0] truncate group-hover:text-[#C9A96E] transition-colors">{item.name}</p>
                          <p className="text-[12px] text-[#555] mt-0.5">{item.volume || '30ml'}</p>
                          <p className="font-playfair text-[#C9A96E] text-sm font-semibold mt-1">Rs {Number(item.price).toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Security tab ── */}
            {activeTab === 'security' && (
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-6 md:p-8">
                <h2 className="font-playfair text-xl font-bold mb-2">Change Password</h2>
                <p className="text-[13px] text-[#555] mb-6">
                  Only available if you signed up with email & password.
                </p>
                <form onSubmit={savePassword} className="space-y-5 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    value={pwForm.current}
                    onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={pwForm.next}
                    onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                    placeholder="Min. 6 characters"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="bg-[#C9A96E] hover:bg-[#E2C68A] disabled:opacity-60 text-[#0a0a0a] text-[12px] font-semibold tracking-[0.12em] uppercase px-8 py-3 transition-colors flex items-center gap-2"
                  >
                    {pwSaving
                      ? <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                      : 'Update Password'
                    }
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
