import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import bottle from '@/app/assets/bottle.png'
import perfume from '@/app/assets/perfume.png'
import mainperfume from '@/app/assets/mainperfumeimg.png'
import Banner from './Banner'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const router = useRouter()
  
  const collections = [
    {
      name: "Crystal Collection",
      image:
      perfume
    },
    {
      name: "Classic Series",
      image:
      perfume
    },
    {
      name: "Nature's Essence",
      image:
      perfume
    },
    {
      name: "Modern Luxury",
      image:
      perfume
    },
    {
      name: "Ocean Breeze",
      image:
      perfume
    },
    {
      name: "Pure Elegance",
      image:
      perfume
    },
  ]

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
  // ... more products
]


  return (
    <div>
    <section className="relative min-h-[600px] flex items-center px-8  from-black to-[#141412]">
    <div className="max-w-2xl">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        Elevate Your Spirit with Victory Scented Fragrances!
      </h1>
      <p className="text-gray-300 mb-8 text-lg">Experience the essence of luxury and victory with A.S Fragnance</p>
      <Button className="bg-[#E5A95E] hover:bg-[#D49A4F] text-white px-8 py-3 rounded-md text-lg" onClick={()=>router.push('ProductList')}>Shop Now</Button>
    </div>
    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block w-1/3 h-full">
      <Image
        src={mainperfume}
        alt="Luxury perfume bottle"
        width={300}
        height={600}
        className="object-contain"
        priority
      />
    </div>
  </section>

  {/* Welcome Section */}
  <section className="px-8 py-32 bg-black/90 background-img">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-[#E5A95E] text-3xl font-semibold mb-6">Welcome to A.S Fragrance</h2>
      <p className="text-gray-300 leading-relaxed mb-8">
        Welcome to A.S Fragrance! We are where the spirit of luxury and triumph come alive through fragrance. Our
        carefully curated collection features exquisite scents that embody sophistication, confidence, and victory.
        Each perfume in our collection tells a unique story of success and achievement. At A.S Fragrance, we believe
        that every victory deserves a signature scent. Whether you're celebrating a personal triumph or preparing
        for your next conquest, we have the perfect fragrance that will tell your story of excellence.
      </p>
    </div>
  </section>

  {/* Values Section */}
  <section className="py-52 bg-black">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
      <div className="relative h-[400px] w-[100%]">
        <Image
          src={bottle}
          alt="Luxury perfume display"
          width={500}
          height={400}
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h2 className="text-[#E5A95E] text-3xl font-semibold mb-6">Our Values</h2>
        <p className="text-gray-300 leading-relaxed">
          At A.S Fragrance, we believe in our ability to create divine fragrances of passion and artistry. We believe
          in manifesting the extraordinary through scent. Our commitment to excellence reflects in every aspect of
          our brand - from the carefully selected ingredients to the artisanal crafting process. We take pride in
          creating unique fragrances that tell stories of triumph and inspire those who wear them to reach new
          heights of success and forge their own fragrant story.
        </p>
      </div>
    </div>
  </section>
  <section className="mb-16 px-16">
        <h2 className="text-[#E5A95E] text-4xl text-center font-medium mb-8">Best selling products</h2>
        {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="group">
            <div className="relative bg-[#121212] rounded-lg p-6 transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="relative aspect-square mb-4">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#E5A95E] font-medium">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400">{product.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>

      {/* Collections */}
      <section className="mb-16 py-52">
        <h2 className="text-[#E5A95E] text-4xl text-center font-medium mb-8">Our Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((collection, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-lg md:text-xl font-medium text-center px-4">{collection.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sale Banner */}
      {/* <section className="relative overflow-hidden rounded-lg">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-black p-8 md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Perfume Year End Sale!</h2>
            <p className="text-gray-400 text-lg mb-6">Up to 50% OFF</p>
            <Button className="bg-[#E5A95E] hover:bg-[#D49A4F] text-white px-8 py-3 rounded-md">Shop Now</Button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-20">
            <Image
              src={perfume}
              alt="Perfume bottle silhouette"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section> */}
      <Banner/>
  </div>
  )
}

