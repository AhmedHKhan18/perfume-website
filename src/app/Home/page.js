import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, User, Heart, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

export default function HomePage() {
  const featuredProducts = [
    { id: 1, name: 'Xbox Series X', price: '$499.99', image: '/placeholder.svg?height=200&width=200' },
    { id: 2, name: 'DualSense Controller', price: '$69.99', image: '/placeholder.svg?height=200&width=200' },
    { id: 3, name: 'Gaming Headset', price: '$99.99', image: '/placeholder.svg?height=200&width=200' },
    { id: 4, name: 'Gaming Mouse', price: '$49.99', image: '/placeholder.svg?height=200&width=200' },
  ]

  const categories = [
    'Consoles',
    'Games',
    'Controllers',
    'Headsets',
    'Accessories',
  ]

  const date = Date.now()
  const year = new Date(date).getFullYear()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-[rgb(27,99,146)] text-white">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/" className="text-2xl font-bold">
                AS PERFUMES
              </Link>
            </div>

            <div className="hidden flex-1 md:block max-w-xl mx-4">
              <div className="flex gap-2">
                <Input type="search" placeholder="Search products..." className="w-full" />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* <nav className="hidden md:flex items-center gap-6 p-4 text-sm">
            {categories.map((category) => (
              <Link
                key={category}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="rounded-lg overflow-hidden bg-[#1a365d] text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Xbox Series X</h1>
                <p className="text-lg mb-6">Experience next-gen gaming</p>
                <Button size="lg" variant="secondary">
                  Shop Now
                </Button>
              </div>
              <div className="relative aspect-square md:aspect-auto md:h-[400px]">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Xbox Series X"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href="#"
                className="group rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium group-hover:text-primary">{product.name}</h3>
                  <p className="text-muted-foreground">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-6 mt-6">Best Selling</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href="#"
                className="group rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium group-hover:text-primary">{product.name}</h3>
                  <p className="text-muted-foreground">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="mb-12 grid md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden bg-yellow-100 p-6">
            <h3 className="text-xl font-bold mb-2">Summer Sale</h3>
            <p className="mb-4">Up to 50% off on selected items</p>
            <Button>View Deals</Button>
          </div>
          <div className="rounded-lg overflow-hidden bg-blue-100 p-6">
            <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
            <p className="mb-4">Check out the latest gaming gear</p>
            <Button>Shop Now</Button>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest News</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((post) => (
              <article key={post} className="rounded-lg border bg-card overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Blog post"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">Gaming News Title</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <Button variant="link" className="px-0">
                    Read More
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="rounded-lg bg-muted p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Get the latest updates on new perfumes and upcoming sales
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input type="email" placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Returns</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Returns Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Facebook</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Twitter</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Instagram</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {year} AS Perfumes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}