import Image from "next/image";
import banner from '@/app/assets/bannerpic.png'
import { useRouter } from "next/navigation";


export default function Banner(){
  const router = useRouter()
    return(
        <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10">
      <Image src={banner} alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />

      <div className="min-h-[550px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
        <h2 className="sm:text-4xl text-2xl font-bold mb-6">Perfume Year End Sale Up to 50% OFF</h2>
        <p className="sm:text-lg text-base text-center text-gray-200">Discover an exquisite collection of premium perfumes at unbelievable prices during our exclusive Perfume Sale!</p>

        <button
          type="button"
          className="mt-12 bg-transparent text-white text-base py-3 px-6 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300" onClick={()=>router.push('/ProductList')}>
          Shop Now
        </button>
      </div>
    </div>
    )
}