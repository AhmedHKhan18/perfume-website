'use client'
import Link from 'next/link';
// import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
// import ShoppingCart from '@/app/components/Shopping-cart'
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react'
import { Search, User, ShoppingCart } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function Header() {
    const [cart, setCart] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

useEffect(()=>{
  const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
  if(cartData){
    setCart(cartData)
  }
},[])

const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

const menuItems = [
  { name: "Home", href: "/", active: true },
  { name: "Products Page", href: "/Product-page"},
  { name: "Cart", href: "/Details/Cart" },
  { name: "Product Details", href: "/Details" },
  { name: "Contact Us", href: "/Contact-us" },
  { name: "About Us", href: "/About-us" },
  { name: "FAQ", href: "/Faq" },
]

  return (
    <nav className="flex items-center justify-between px-8 py-4 scroll">
    <div className="text-[#E5A95E] text-2xl font-semibold">A.S FRAGRANCE</div>
    <div className="hidden md:flex items-center space-x-8">
      <a href="/" className="text-white hover:text-[#E5A95E]">
        Home
      </a>
      <a href="/ProductList" className="text-white hover:text-[#E5A95E]">
        Shop
      </a>
      <a href="/About-Us" className="text-white hover:text-[#E5A95E]">
        About us
      </a>
      <a href="/Contact-Us" className="text-white hover:text-[#E5A95E]">
        Contact
      </a>
      <a href="/Blogs" className="text-white hover:text-[#E5A95E]">
        Blog
      </a>
    </div>
    <div className="flex items-center space-x-6">
      <Search className="w-5 h-5 text-white hover:text-[#E5A95E] cursor-pointer" />
      <User className="w-5 h-5 text-white hover:text-[#E5A95E] cursor-pointer" />
      <div className="relative">
      <ShoppingCart className="w-5 h-5 text-white hover:text-[#E5A95E] cursor-pointer" onClick={()=>router.push("/Cart")}/>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#E5A95E] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount}
        </span>
      )}
      </div>
    </div>
  </nav>
  );
}
