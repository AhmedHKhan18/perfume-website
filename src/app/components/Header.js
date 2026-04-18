'use client'
import Link from 'next/link';
import { useEffect, useState, useContext, useRef } from 'react';
import { Menu, X, Search, User, ShoppingCart, Heart, LogOut, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { AppContext } from '@/context/Appcontext';
import CartSidebar from './CartSidebar';

const NAV = [
  { name: 'Home',    href: '/' },
  { name: 'Shop',    href: '/ProductList' },
  { name: 'About',   href: '/About-Us' },
  { name: 'Contact', href: '/Contact-Us' },
  { name: 'Blog',    href: '/Blogs' },
];

const ANNOUNCEMENTS = [
  '✦  Free delivery on orders over Rs 2,000',
  '✦  Use code WELCOME20 for 20% off your first order',
  '✦  Authentic luxury fragrances — crafted with passion',
  '✦  Cash on Delivery available nationwide',
];

export default function Header() {
  const { cartCount, wishlistCount, user, handleLogout, perfumesData } = useContext(AppContext);
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef  = useRef(null);
  const userRef    = useRef(null);
  const router     = useRouter();
  const pathname   = usePathname();

  /* sticky shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false); setQuery(''); setSuggestions([]);
      }
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* suggestions */
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    setSuggestions(perfumesData.filter(p => p.name?.toLowerCase().includes(q)).slice(0, 5));
  }, [query, perfumesData]);

  const goSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/Search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false); setQuery(''); setSuggestions([]);
  };

  const goProduct = (id) => {
    router.push(`/Product-Details/${id}`);
    setSearchOpen(false); setQuery(''); setSuggestions([]);
  };

  /* announcement bar items × 2 for seamless loop */
  const barItems = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-[#C9A96E] overflow-hidden flex items-center">
        <div className="marquee-track">
          {barItems.map((text, i) => (
            <span key={i} className="text-[#0a0a0a] text-[11px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap px-10">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className={`fixed top-10 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/98 backdrop-blur-md shadow-[0_1px_0_#232323]' : 'bg-[#0a0a0a]'
      }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="font-playfair text-xl md:text-2xl font-bold tracking-[0.18em] text-[#C9A96E] shrink-0 hover:text-[#E2C68A] transition-colors">
            A.S FRAGRANCE
          </Link>

          {/* Desktop nav links — centred */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map(({ name, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={`text-[13px] font-medium tracking-[0.08em] uppercase transition-colors relative group ${
                    active ? 'text-[#C9A96E]' : 'text-[#aaa] hover:text-white'
                  }`}
                >
                  {name}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-[#C9A96E] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#C9A96E] transition-colors rounded-lg hover:bg-white/5"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-11 w-72 bg-[#111] border border-[#232323] rounded-xl shadow-2xl overflow-hidden">
                  <form onSubmit={goSearch} className="flex items-center px-3 py-2.5 border-b border-[#232323]">
                    <Search className="w-4 h-4 text-[#555] mr-2 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search fragrances…"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder-[#444]"
                    />
                    {query && (
                      <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }}>
                        <X className="w-3.5 h-3.5 text-[#555] hover:text-white" />
                      </button>
                    )}
                  </form>
                  {suggestions.length > 0 && (
                    <ul className="py-1">
                      {suggestions.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => goProduct(p.id)}
                            className="w-full text-left px-4 py-2 text-[13px] text-[#aaa] hover:bg-[#1a1a1a] hover:text-[#C9A96E] flex items-center justify-between gap-2"
                          >
                            <span>{p.name}</span>
                            {p.price && <span className="text-[#C9A96E] text-xs shrink-0">Rs {p.price}</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {query.length >= 2 && suggestions.length === 0 && (
                    <p className="px-4 py-3 text-[13px] text-[#555]">No results for "{query}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/Wishlist"
              className="relative w-9 h-9 hidden lg:flex items-center justify-center text-[#888] hover:text-[#C9A96E] transition-colors rounded-lg hover:bg-white/5"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C9A96E] text-[#0a0a0a] text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 hidden lg:flex items-center justify-center text-[#888] hover:text-[#C9A96E] transition-colors rounded-lg hover:bg-white/5"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C9A96E] text-[#0a0a0a] text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div ref={userRef} className="relative hidden lg:block">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#C9A96E] transition-colors rounded-lg hover:bg-white/5"
              >
                <User className="w-[18px] h-[18px]" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-11 w-48 bg-[#111] border border-[#232323] rounded-xl shadow-2xl overflow-hidden py-1">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-[#232323]">
                        <p className="text-[11px] text-[#555] tracking-wider uppercase">Signed in as</p>
                        <p className="text-sm text-white truncate mt-0.5">{user.displayName || user.email}</p>
                      </div>
                      <Link href="/Profile" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-[#aaa] hover:bg-[#1a1a1a] hover:text-[#C9A96E]">My Profile</Link>
                      <Link href="/Orders"  onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-[#aaa] hover:bg-[#1a1a1a] hover:text-[#C9A96E]">Order History</Link>
                      <button onClick={() => { handleLogout(); setUserOpen(false); }} className="w-full text-left px-4 py-2.5 text-[13px] text-red-400 hover:bg-[#1a1a1a] flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/Sign-in" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-[#aaa] hover:bg-[#1a1a1a] hover:text-[#C9A96E]">Sign In</Link>
                      <Link href="/Sign-in" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-[#C9A96E] hover:bg-[#1a1a1a]">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#C9A96E] transition-colors"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Cart sidebar ── */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-72 bg-[#0f0f0f] border-l border-[#232323] flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#232323] shrink-0">
            <span className="font-playfair text-[#C9A96E] font-bold tracking-wider">A.S FRAGRANCE</span>
            <button onClick={() => setMenuOpen(false)} className="text-[#666] hover:text-white">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {NAV.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-3 text-sm font-medium tracking-wider uppercase transition-colors ${
                  pathname === href ? 'text-[#C9A96E]' : 'text-[#888] hover:text-white'
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="px-6 py-5 border-t border-[#232323] flex items-center gap-5">
            <Link href="/Wishlist" onClick={() => setMenuOpen(false)} className="relative text-[#888] hover:text-[#C9A96E]">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A96E] text-[#0a0a0a] text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </Link>
            <button
              onClick={() => { setMenuOpen(false); setCartOpen(true); }}
              className="relative text-[#888] hover:text-[#C9A96E]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A96E] text-[#0a0a0a] text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <Link href="/Sign-in" onClick={() => setMenuOpen(false)} className="text-[#888] hover:text-[#C9A96E]">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
