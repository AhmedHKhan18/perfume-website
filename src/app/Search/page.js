"use client"
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/context/Appcontext";
import { Search } from "lucide-react";

const products = [
  { id: 1, name: "Oud Perfume" },
  { id: 2, name: "Rose Fragrance" },
  { id: 3, name: "Musk Oil" },
  { id: 4, name: "Amber Essence" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { perfumesData } = useContext(AppContext);
  

  useEffect(() => {
    if (searchQuery) {
      const filtered = perfumesData.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col items-center p-6 h-screen">
      <div className="flex items-center w-full max-w-md">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded w-full max-w-md bg-transparent border-gray-800 text-white"
      />
      <Search className="w-5 h-5 relative right-8 text-white hover:text-[#E5A95E] cursor-pointer" onClick={()=>router.push("/Search")}/>
      </div>
      {searchQuery && filteredProducts.length > 0 ? (
        <div className="mt-4 w-full max-w-md bg-transparent text-white shadow-lg rounded">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={{pathname: `/Product-Details/${product.id}`, query: {name: product.name, description: product.description, image: product.imageUrl, price: product.price, rating: product.rating, reviews: product.reviews}}}>
              <div className="p-2 border-b cursor-pointer hover:bg-gray-800 hover:text-[#E5A95E]">
                {product.name}
              </div>
            </Link>
          ))}
        </div>
      ): searchQuery && filteredProducts == 0 ? (<p className="text-white text-2xl my-20">No Perfume Found</p>): null}
    </div>
  );
}
