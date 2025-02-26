'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState('navy')
  const [quantity, setQuantity] = useState(1)

  const colors = [
    { name: 'Navy', value: 'navy' },
    { name: 'White', value: 'white' },
    { name: 'Red', value: 'red' },
    { name: 'Green', value: 'green' },
  ]

  const relatedProducts = [
    { name: 'Classic Sneakers', price: '$89.00', image: '/placeholder.svg?height=200&width=200' },
    { name: 'Casual Shoes', price: '$79.00', image: '/placeholder.svg?height=200&width=200' },
    { name: 'Daily Backpack', price: '$49.00', image: '/placeholder.svg?height=200&width=200' },
    { name: 'Comfort Beanie', price: '$29.00', image: '/placeholder.svg?height=200&width=200' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Men's Fashion T-shirt"
              className="object-cover"
              fill
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`relative aspect-square overflow-hidden rounded-md border ${
                  selectedColor === color.value ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt={`${color.name} T-shirt`}
                  className="object-cover"
                  fill
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Men's Fashion T-Shirt</h1>
            <p className="mt-2 text-2xl font-semibold">$139.00</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="size" className="text-sm font-medium">
                Select Size
              </label>
              <Select>
                <SelectTrigger id="size" className="mt-1 w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 rounded-md border px-3 py-2 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="prose prose-sm">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <p>
              The Gildan Ultra Cotton T-shirt is made from a substantial 6.0 oz. per sq. yd. fabric constructed from 100% cotton. This classic fit preshrunk jersey knit provides unmatched comfort with each wear. Featuring a taped neck and shoulder, and a seamless double-needle collar, and available in a range of colors, it offers it all in the ultimate head-turning package.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {relatedProducts.map((product, index) => (
            <Link
              key={index}
              href="#"
              className="group overflow-hidden rounded-lg border bg-background p-2 transition-colors hover:bg-muted/50"
            >
              <div className="relative aspect-square mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="object-cover transition-transform group-hover:scale-105"
                  fill
                />
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}