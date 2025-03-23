"use client"

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import perfume from '@/app/assets/perfume.png'
import BreadCrumbs from "../components/BreadCrumbs"
import SpecialOffers from "../components/Special-Offer"
import Card from "../components/ProductCard"
import { useContext } from "react"
import { AppContext } from "@/context/Appcontext"

const products = [
  {
    name: "Luxurious Elixir Rough",
    price: 220.0,
    rating: 4,
    reviews: 60,
    volume: "100ml",
    image: perfume,
    id: 1,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 2,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 3,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 4,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 5,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 6,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 7,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 8,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 9,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 10,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 11,
  },
  {
    name: "The Golden Legacy",
    price: 160.0,
    rating: 4,
    reviews: 103,
    volume: "100ml",
    image: perfume,
    id: 12,
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
   const { perfumesData } = useContext(AppContext);
  return (
    <div>
    <BreadCrumbs pageTitle={'Shop'}/>
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12">
      {/* Header */}
      <h1 className="text-[#E5A95E] text-3xl text-center font-medium mb-8">
        Best Selling Products
      </h1>

      {/* Filters */}
      {/* <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-400">Filter by:</span>
          {Object.entries(filterOptions).map(([category, options]) => (
            <Select key={category}>
              <SelectTrigger className="w-auto bg-black border-none outline-none">
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
          <SelectTrigger className="w-auto bg-black border-none outline-none">
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
      </div> */}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {perfumesData.map((product, index) => (
        <Card products={product} key={index} index={index}/>
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