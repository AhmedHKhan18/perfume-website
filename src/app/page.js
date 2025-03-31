'use client'
import { ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'
import HeroSection from './components/HeroSection'
import PartnerLogos from './components/PartnerLogos'
import FeaturedProducts from './components/FeaturedProducts'
import TopCategories from './components/TopCategories'
import ExploreStyles from './components/ExploreStyles'

export default function App() {


  return (
    <div className="min-h-screen flex flex-col">
    
    <main className="flex-grow">
      <HeroSection />
      <div className="container mx-auto px-4">
      </div>
    </main>
    
  </div>
  )
}