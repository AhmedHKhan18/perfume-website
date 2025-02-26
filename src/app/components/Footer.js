import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import Image from "next/image"
export default function Footer(){

    const footerLinks = {
        Categories: ["Fashion", "Beauty", "Sports", "Perfumes", "Indoor"],
        Shopping: ["Payments", "Delivery", "Buyer protection"],
        "Customer care": ["Help center", "Terms & Conditions", "Privacy policy", "Returns & refunds", "Survey & feedback"],
        Pages: ["About Us", "Shop", "Contact Us", "Services", "Blog"],
      }

    return(
        <div className="bg-black text-white pt-20">
            <footer className="bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Newsletter */}
            <div className="lg:col-span-2">
              <div
                className="mb-8"
              >
                <h3 className="text-[#E5A95E] text-xl font-medium mb-4">A.S Fragrance</h3>
                <p className="text-gray-400 mb-6">Subscribe to Our Newsletter:</p>
                <p className="text-sm text-gray-500 mb-4">Receive Updates on New arrivals and Special Promotions!</p>
                <div className="flex gap-2">
                  <Input type="email" placeholder="Your email" className="bg-[#141412] border-black" />
                  <Button className="bg-[#E5A95E] hover:bg-[#D49A4F] text-black">
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div
                key={category}
              >
                <h4 className="font-medium mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#E5A95E] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div
            className="flex justify-center space-x-6 pt-8 border-t border-gray-800"
          >
              <a href="#" className="text-gray-400 hover:text-[#E5A95E]">
                <div className="w-6 h-6 transition-colors rounded-full">
                <Facebook/>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E5A95E]">
                <div className="w-6 h-6 transition-colors rounded-full">
                <Instagram/>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E5A95E]">
                <div className="w-6 h-6 transition-colors rounded-full">
                <Twitter/>
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E5A95E]">
                <div className="w-6 h-6 transition-colors rounded-full">
                <Linkedin/>
                </div>
              </a>
          </div>
        </div>
      </footer>
        </div>
    )
}