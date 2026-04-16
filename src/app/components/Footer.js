'use client'
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react"
import { useState } from "react"

const LINKS = {
  Shop: [
    { label: 'All Fragrances', href: '/ProductList' },
    { label: 'Best Sellers',   href: '/ProductList' },
    { label: 'New Arrivals',   href: '/ProductList' },
    { label: 'Gift Sets',      href: '/ProductList' },
  ],
  Help: [
    { label: 'Contact Us',      href: '/Contact-Us' },
    { label: 'FAQs',            href: '/Contact-Us' },
    { label: 'Returns Policy',  href: '/Contact-Us' },
    { label: 'Track Your Order',href: '/Cart' },
  ],
  Company: [
    { label: 'About Us',       href: '/About-Us' },
    { label: 'Blog',           href: '/Blogs' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use',   href: '#' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] text-[#f5f5f0]">

      {/* Top strip */}
      <div className="border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-playfair text-2xl font-bold text-[#C9A96E] tracking-wider">A.S FRAGRANCE</p>
            <p className="text-[#555] text-sm mt-1 tracking-wide">Scentsation of the Scentury™</p>
          </div>
          {/* Newsletter */}
          <form onSubmit={handleSubscribe} className="flex gap-0 w-full max-w-sm">
            {subscribed ? (
              <p className="text-[#C9A96E] text-sm font-medium w-full text-center py-3">✓ You're on the list!</p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-[#111] border border-[#232323] border-r-0 px-4 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#C9A96E]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#C9A96E] hover:bg-[#E2C68A] text-[#0a0a0a] px-5 py-3 flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold text-[#C9A96E] tracking-[0.22em] uppercase mb-5">{category}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-[#555] hover:text-[#f5f5f0] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#3a3a3a]">
            © {new Date().getFullYear()} A.S Fragrance. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Facebook,  href: '#' },
              { Icon: Instagram, href: '#' },
              { Icon: Twitter,   href: '#' },
              { Icon: Youtube,   href: '#' },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} className="text-[#333] hover:text-[#C9A96E] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
