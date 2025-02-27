import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function Card({products, index}){
    return(
        <>
        <Link href={{pathname: `/Product-Details/${products.id}`, query: {name: products.name, image: products.image, price: products.price, rating: products.rating, reviews: products.reviews}}}>
          <div key={index} className="group">
            <div className="relative bg-[#121212] rounded-lg p-6 transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="relative aspect-square mb-4">
                <Image src={products.image || "/placeholder.svg"} alt={products.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-medium mb-2">{products.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < products.rating ? "fill-[#E5A95E] text-[#E5A95E]" : "fill-gray-600 text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400 ml-2">({products.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#E5A95E] font-medium">${products.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400">{products.volume}</span>
              </div>
            </div>
          </div>
          </Link>
          </>
    )
}