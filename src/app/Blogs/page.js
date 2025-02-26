"use client"

import Image from "next/image"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const blogPosts = [
  {
    title: "Finding Your Signature Scent: A Guide to Personal Fragrance",
    excerpt:
      "Discover the art of finding the perfect scent that resonates with your personality. Our guide walks you through the intricate journey of selecting a signature fragrance that becomes an extension of your identity.",
    image:
      "",
    category: "Guides",
  },
  {
    title: "The Art of Curating a Luxury Perfume Collection: A Symphony of Scents",
    excerpt:
      "A perfume collection is not mere radiance; it is an achievement of fragrance. Learn how to build a unique collection that resonates with your personal style.",
    image:
      "",
    category: "Collections",
  },
  {
    title: "Unveiling Fragrance Notes: Mastering the Art of Scent Layering",
    excerpt:
      "Explore the intricate world of fragrance notes and learn how to create your own unique scent combinations through the art of layering.",
    image:
      "",
    category: "Tips",
  },
  {
    title: "The Soothing Symphony of Lavender Perfumes: Unlocking the Secrets",
    excerpt:
      "Dive deep into the calming world of lavender fragrances and discover how this timeless ingredient has shaped the perfume industry.",
    image:
      "",
    category: "Ingredients",
  },
  {
    title: "Ancient Perfumery: A Journey Through History",
    excerpt:
      "Take a fascinating journey through time as we explore the rich history of perfumery from ancient civilizations to modern day luxury fragrances.",
    image:
      "",
    category: "History",
  },
  {
    title: "The Timeless Elegance of Rose Perfumes: Unveiling the Queen of Flowers",
    excerpt:
      "Discover why rose continues to reign supreme in the world of perfumery and how modern interpretations keep this classic note forever relevant.",
    image:
      "",
    category: "Ingredients",
  },
]

const categories = ["All", "Guides", "Collections", "Tips", "Ingredients", "History"]
const sortOptions = ["Latest", "Popular", "Oldest"]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog Collection</h1>
          <h2 className="text-2xl md:text-3xl text-[#E5A95E] mb-4">Discover the Art of Perfumery</h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            Welcome to Local Face's blog, where we delve deep into the enchanting world of fine fragrances. Here you'll
            find rich, informative content about the art of perfumery, from the history of iconic scents to guides on
            finding your perfect fragrance. Our expert writers share their knowledge and passion, bringing you closer to
            understanding the intricate world of luxury perfumes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Input type="text" placeholder="Search articles..." className="pl-10 border-gray-800" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-[180px] bg-black border-black">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] bg-black">
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
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              className="group"
            >
              <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#E5A95E] text-black text-sm rounded-full">
                  {post.category}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#E5A95E] transition-colors">{post.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
              <button className="text-[#E5A95E] font-medium hover:text-[#D49A4F] transition-colors">Read More</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}