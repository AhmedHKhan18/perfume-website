"use client"

import Image from "next/image"
import banner from '@/app/assets/bannerpic.png'
import background from '@/app/assets/background-img.png'
import collection from '@/app/assets/perfume-collection.png'

const features = [
  {
    title: "Luxury Inspired",
    description:
      "Every fragrance we craft carefully reflects our commitment to luxury and excellence. Our perfumes are inspired by the finest ingredients and most sophisticated combinations, ensuring that each scent tells its own unique story of refinement and strength.",
  },
  {
    title: "High-Quality Ingredients",
    description:
      "We source only the finest and most exclusive ingredients from around the world. Our master perfumers work with precision and passion to create unique blends that capture the essence of luxury. Each fragrance is carefully crafted to ensure a long-lasting and distinctive experience.",
  },
  {
    title: "Personalized Service",
    description:
      "We believe that finding your perfect scent is a deeply personal journey. Our expert consultants are dedicated to helping you discover the fragrance that best expresses your personality and style. We take pride in offering a bespoke experience that helps guide you every step of the way.",
  },
]

export default function AboutPage() {
  return (
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={background}
              alt="Luxury architecture"
              fill
              className="object-cover opacity-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />
          </div>
          <div className="relative text-center max-w-3xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-justify lg:text-center">
              At A.S Fragrance, we believe that perfumes are more than just scents; they are expressions of art and style.
              We strive to create fragrances that capture the essence of luxury and sophistication, crafting each scent
              with passion and precision to give you an unforgettable sensory experience.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 from-[#141412] via-transparent to-transparent">
          <div className="max-w-8xl">
              <div className="text-center mb-52 ">
                <h2 className="text-[#E5A95E] text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed text-justify lg:text-center">
                  A.S Fragrance began as a small artisanal perfume house dedicated to creating unique and captivating
                  scents. Our journey started with a simple passion to create the perfect fragrance that would capture
                  the essence of luxury and individuality. Today, we continue to push the boundaries of perfumery,
                  combining traditional techniques with modern innovation to create fragrances that are both timeless
                  and contemporary.
                </p>
              </div>

            <div className="relative h-[400px] md:h-[600px] w-full rounded-lg overflow-hidden">
              <Image
                src={collection}
                alt="Perfume display"
                fill
                className=" w-[100%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* What Makes Us Unique Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-black to-[#141412]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              What Makes Us Unique
            </h2>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#E5A95E] mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  )
}