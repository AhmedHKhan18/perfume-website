"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import banner from '@/app/assets/bannerpic.png'
import bannercoverimg from '@/app/assets/bannercoverimg.png'
import bannercoverimg2 from '@/app/assets/bannercoverimg2.png'


const offers = [
  {
    title: "Aqua Serenity",
    subtitle: "Embrace the Tranquil Tides",
    discount: "20% OFF",
    description:
      "Immerse yourself in the calming embrace of Aqua Serenity's enchanting fragrance that creates an aura of peace and tranquility.",
    image:
    bannercoverimg,
    theme: "blue",
  },
  {
    title: "Golden Angel",
    subtitle: "Unleash Your Divine Glow",
    discount: "25% OFF",
    description:
      "Indulge in the divine allure of Golden Angel, a fragrance that embodies celestial radiance and timeless beauty.",
    image:
    bannercoverimg2,
    theme: "gold",
  },
]

export default function SpecialOffers() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-center text-3xl md:text-4xl font-medium mb-16">
          Special Offers
        </h1>

        <div className="space-y-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl ${
                offer.theme === "blue"
                  ? "bg-gradient-to-r from-black to-[#001829]"
                  : "bg-gradient-to-r from-black to-[#1a1100]"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex flex-col justify-center order-2 md:order-1">
                  <div>
                    <div
                      className="inline-block px-4 py-2 rounded-full border border-opacity-50 mb-6 text-sm
                      ${offer.theme === 'blue' ? 'border-cyan-500 text-cyan-400' : 'border-yellow-500 text-yellow-400'}"
                    >
                      Limited Time Offer: {offer.discount}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">{offer.title}</h2>
                    <p className={`text-xl mb-4 ${offer.theme === "blue" ? "text-cyan-300" : "text-yellow-300"}`}>
                      {offer.subtitle}
                    </p>
                    <p className="text-gray-400 mb-8 max-w-md">{offer.description}</p>
                    <Button
                      className={`${
                        offer.theme === "blue" ? "bg-cyan-600 hover:bg-cyan-700" : "bg-yellow-600 hover:bg-yellow-700"
                      } text-white px-8 py-6 rounded-full text-lg transition-transform hover:scale-105`}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>

                <div className="relative h-[300px] md:h-[400px] order-1 md:order-2">
                  <div className="relative h-full">
                    <Image
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 ${
                        offer.theme === "blue"
                          ? "bg-gradient-radial from-cyan-500/20 via-transparent to-transparent"
                          : "bg-gradient-radial from-yellow-500/20 via-transparent to-transparent"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}