"use client"

import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import perfume from '@/app/assets/perfume.png'
import BreadCrumbs from "../components/BreadCrumbs"
import SpecialOffers from "../components/Special-Offer"

const products = [
  {
    name: "Luxurious Elixir Rough",
    price: 220.0,
    rating: 4,
    reviews: 60,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
  },
  // ... more products
]

const filterOptions = {
  Collections: ["Luxury", "Classic", "Modern", "Vintage"],
  "Fragrance Families": ["Floral", "Oriental", "Fresh", "Woody"],
  Gender: ["All", "Men", "Women", "Unisex"],
  Occasions: ["Daily", "Evening", "Special", "Casual"],
}

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Best Rating", "Most Popular"]

export default function ProductsPage() {
  return (
    <div>
    <BreadCrumbs pageTitle={'Shop'}/>
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12">
      {/* Header */}
      <h1 className="text-[#E5A95E] text-3xl text-center font-medium mb-8">
        Best Selling Products
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-400">Filter by:</span>
          {Object.entries(filterOptions).map(([category, options]) => (
            <Select key={category}>
              <SelectTrigger className="w-[120px] bg-black border-none outline-none">
                <SelectValue placeholder={category} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <Select>
          <SelectTrigger className="w-[120px] bg-black border-none outline-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option.toLowerCase()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="group">
            <div className="relative bg-[#121212] rounded-lg p-6 transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="relative aspect-square mb-4">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating ? "fill-[#E5A95E] text-[#E5A95E]" : "fill-gray-600 text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400 ml-2">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#E5A95E] font-medium">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400">{product.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-12">
        <button className="p-2 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-gray-400">Page 1 of 4</span>
        <button className="p-2 rounded-full hover:bg-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
    <SpecialOffers/>
    </div>
  )
}