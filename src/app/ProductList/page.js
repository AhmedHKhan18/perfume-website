"use client"

import { useState, useContext, useMemo } from "react"
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from "lucide-react"
import Card from "../components/ProductCard"
import { AppContext } from "@/context/Appcontext"

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Best Rated" },
  { value: "name-asc", label: "Name: A–Z" },
]

const FRAGRANCE_NOTES = ["Oud", "Rose", "Musk", "Amber", "Vanilla", "Sandalwood", "Citrus", "Jasmine", "Cedar", "Bergamot"]
const BRANDS = ["A.S Fragrance", "Classic", "Modern", "Vintage", "Luxury"]
const CATEGORIES = ["Men", "Women", "Unisex", "Oud", "Floral", "Fresh", "Woody", "Oriental"]
const PAGE_SIZE = 12

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#1e1e1e] py-4">
      <button
        className="w-full flex items-center justify-between text-[12px] font-semibold text-[#aaa] hover:text-[#C9A96E] tracking-[0.12em] uppercase transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function ProductsPage() {
  const { perfumesData } = useContext(AppContext)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sort, setSort] = useState("default")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedNotes, setSelectedNotes] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)

  // Compute min/max price from data
  const prices = perfumesData.map((p) => Number(p.price) || 0)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 10000

  const toggleItem = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
    setPage(1)
  }

  const clearFilters = () => {
    setPriceRange([0, 10000])
    setSelectedCategories([])
    setSelectedNotes([])
    setSelectedBrands([])
    setInStockOnly(false)
    setSort("default")
    setSearch("")
    setPage(1)
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedNotes.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0)

  const filtered = useMemo(() => {
    let result = [...perfumesData]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      )
    }

    result = result.filter((p) => {
      const price = Number(p.price) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    if (selectedCategories.length) {
      result = result.filter((p) =>
        selectedCategories.some(
          (c) =>
            p.category?.toLowerCase().includes(c.toLowerCase()) ||
            p.gender?.toLowerCase() === c.toLowerCase()
        )
      )
    }

    if (selectedNotes.length) {
      result = result.filter((p) =>
        selectedNotes.some((note) =>
          [p.topNotes, p.middleNotes, p.baseNotes, p.fragranceNotes, p.notes]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(note.toLowerCase())
        )
      )
    }

    if (selectedBrands.length) {
      result = result.filter((p) =>
        selectedBrands.some((b) => p.brand?.toLowerCase().includes(b.toLowerCase()))
      )
    }

    if (inStockOnly) {
      result = result.filter((p) => p.stock === undefined || p.stock > 0)
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "rating-desc":
        result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        break
      case "name-asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
    }

    return result
  }, [perfumesData, search, priceRange, selectedCategories, selectedNotes, selectedBrands, inStockOnly, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const Sidebar = () => (
    <aside className="space-y-0">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e1e1e]">
        <h2 className="text-[11px] font-semibold text-[#C9A96E] tracking-[0.2em] uppercase">Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-[11px] text-[#666] hover:text-[#C9A96E] tracking-wider uppercase transition-colors">
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search within shop */}
      <FilterSection title="Search" defaultOpen>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-8 pr-3 py-2 bg-[#111] border border-[#232323] text-[13px] text-white placeholder-[#444] outline-none focus:border-[#C9A96E]/40 transition-colors"
          />
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range" defaultOpen>
        <div className="px-0.5 mt-3">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1) }}
            className="w-full accent-[#C9A96E]"
          />
          <div className="flex justify-between text-[11px] text-[#555] mt-2">
            <span>Rs {priceRange[0].toLocaleString()}</span>
            <span>Rs {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2.5 mt-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat)}
                className="w-3.5 h-3.5 accent-[#C9A96E]"
              />
              <span className="text-[13px] text-[#666] group-hover:text-[#f5f5f0] transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fragrance Notes */}
      <FilterSection title="Fragrance Notes">
        <div className="flex flex-wrap gap-1.5 mt-2">
          {FRAGRANCE_NOTES.map((note) => (
            <button
              key={note}
              onClick={() => toggleItem(selectedNotes, setSelectedNotes, note)}
              className={`px-2.5 py-1 text-[11px] font-medium tracking-wider transition-all border ${
                selectedNotes.includes(note)
                  ? "bg-[#C9A96E] border-[#C9A96E] text-[#0a0a0a]"
                  : "border-[#2a2a2a] text-[#555] hover:border-[#C9A96E]/40 hover:text-[#f5f5f0]"
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2.5 mt-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                className="w-3.5 h-3.5 accent-[#C9A96E]"
              />
              <span className="text-[13px] text-[#666] group-hover:text-[#f5f5f0] transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2.5 cursor-pointer group mt-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => { setInStockOnly(e.target.checked); setPage(1) }}
            className="w-3.5 h-3.5 accent-[#C9A96E]"
          />
          <span className="text-[13px] text-[#666] group-hover:text-[#f5f5f0] transition-colors">In Stock Only</span>
        </label>
      </FilterSection>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      {/* Page header */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A96E] text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">A.S Fragrance</p>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#f5f5f0]">Shop All Perfumes</h1>
          <div className="h-px w-10 bg-[#C9A96E] mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#232323] hover:border-[#C9A96E]/40 text-[12px] tracking-wider uppercase px-4 py-2 text-[#888] hover:text-[#C9A96E] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#C9A96E] text-[#0a0a0a] text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-[13px] text-[#444]">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
            className="bg-[#111] border border-[#232323] text-[13px] text-[#aaa] px-3 py-2 outline-none cursor-pointer hover:border-[#C9A96E]/40 transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-52 shrink-0">
            <Sidebar />
          </div>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-[#0d0d0d] border-r border-[#1e1e1e] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[11px] font-semibold text-[#C9A96E] tracking-[0.2em] uppercase">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-4 h-4 text-[#555] hover:text-white" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-5">🔍</div>
                <h3 className="font-playfair text-xl font-bold text-[#f5f5f0] mb-2">No products found</h3>
                <p className="text-[#555] text-sm mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="text-[13px] text-[#C9A96E] border-b border-[#C9A96E]/40 hover:border-[#C9A96E] pb-0.5 tracking-wider uppercase transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map((product, index) => (
                  <Card products={product} key={product.id || index} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 text-[12px] tracking-wider uppercase border border-[#232323] hover:border-[#C9A96E]/40 text-[#666] hover:text-[#C9A96E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-[13px] border transition-colors ${
                      page === i + 1
                        ? "bg-[#C9A96E] border-[#C9A96E] text-[#0a0a0a] font-semibold"
                        : "border-[#232323] text-[#666] hover:border-[#C9A96E]/40 hover:text-[#C9A96E]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2 text-[12px] tracking-wider uppercase border border-[#232323] hover:border-[#C9A96E]/40 text-[#666] hover:text-[#C9A96E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
