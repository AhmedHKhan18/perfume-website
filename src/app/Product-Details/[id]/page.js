'use client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import perfume from '@/app/assets/perfume.png'
import { useSearchParams } from "next/navigation"
import Card from "@/app/components/ProductCard"
  

export default function Product(){
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); 
  const price = searchParams.get("price");
  const image = searchParams.get('image');
  const id = searchParams.get("id");
  const product = {
    name: name || 'Unknown',
    price: price || 40,
    image: image || '',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt erat enim. Lorem ipsum dolor sit amet, consectetur adipiscing'
  }
  console.log("🚀 ~ Product ~ product.image:", product.image)

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
]


    return(
        <div>
        <div className='font-[sans-serif] p-4'>
  <div className='lg:max-w-6xl max-w-xl mx-auto'>
    <div className='grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8'>
      <div className='w-full lg:sticky top-0'>
        <div className='flex flex-row gap-2'>
          <div className='flex flex-col gap-2 w-16 max-sm:w-14 shrink-0'>
            <Image src={product.image} alt='Product1'
              className='aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 border-black' />
            <Image src={product.image} alt='Product2'
              className='aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 border-transparent' />
            <Image src={product.image} alt='Product3'
              className='aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 border-transparent' />
            <Image src={product.image} alt='Product4'
              className='aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 border-transparent' />
          </div>
          <div className='flex-1'>
            <Image src={product.image} alt='Product'
              className='w-full aspect-[548/712] object-cover' />
          </div>
        </div>
      </div>

      <div className='w-full'>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-[#E5A95E]'>{product.name}</h3>
          <p className='text-white mt-1 text-sm'>Women Embroidered Georgette A-line Kurta With Attached Dupatta (Maroon)
          </p>
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <h4 className='text-[#E5A95E] text-2xl sm:text-3xl font-bold'>Rs:{product.price}</h4>
            <p className='text-white text-lg'><strike>$16</strike> <span className='text-sm ml-1.5'>Tax included</span></p>
          </div>

          <div className='flex items-center gap-4 mt-2'>
            <div className='flex items-center gap-1 text-lg px-2.5 bg-green-600 text-white rounded-full'>
              <p>4</p>
              <svg className='w-[13px] h-[13px] fill-white' viewBox='0 0 14 13' fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
              </svg>
            </div>
            <p className='text-white text-sm'>253 ratings and 27 reviews</p>
          </div>
        </div>

        <hr className='my-6 border-gray-300' />

        <div>
          <h3 className=' text-lg   sm:text-xl   font-bold   text-[#E5A95E] '>Sizes</h3>
          <div className=' flex   flex-wrap   gap-4   mt-4 '>
            <button type='button'
              className=' w-10   h-9   border   border-gray-300   hover:border-[#E5A95E]   text-sm      flex   items-center   justify-center   shrink-0 '>SM</button>
            <button type='button'
              className=' w-10   h-9   border   border-[#E5A95E]   hover:border-[#E5A95E]   text-sm      flex   items-center   justify-center   shrink-0 '>MD</button>
            <button type='button'
              className=' w-10   h-9   border   border-gray-300   hover:border-[#E5A95E]   text-sm      flex   items-center   justify-center   shrink-0 '>LG</button>
            <button type='button'
              className=' w-10   h-9   border   border-gray-300   hover:border-[#E5A95E]   text-sm      flex   items-center   justify-center   shrink-0 '>XL</button>
          </div>

          <div className=' mt-6   flex   flex-wrap   gap-4 '>
            <button type='button'
              className=' px-4   py-3   w-[45%]   border   border-gray-300   bg-gray-100   hover:bg-gray-200   text-gray-800   text-sm   font-semibold       '>Add
              to wishlist</button>
            <button type='button'
              className=' px-4   py-3   w-[45%]   border   border-[#E5A95E]   bg-[#E5A95E]   hover:bg-yellow-600   text-white   text-sm   font-semibold       '>Add
              to cart</button>
          </div>
        </div>

        <hr className=' my-6   border-gray-300 ' />

        <div>
          <h3 className=' text-lg   sm:text-xl   font-bold   text-[#E5A95E] '>Select Delivery Location</h3>
          <p className=' text-white   text-sm   mt-1 '>Enter the pincode of your area to check product availability.</p>
          <div className=' flex   items-center   gap-2   mt-4   max-w-sm '>
            <input type='number' placeholder='Enter pincode'
              className=' bg-gray-100 text-gray-800   px-4   py-2.5   text-sm   w-full      border-0   outline-0 ' />
            <button type='button'
              className=' border-0   outline-0   bg-[#E5A95E]   hover:bg-yellow-700   text-white      px-4   py-2.5   text-sm '>Apply</button>
          </div>
        </div>

        <hr className=' my-6   border-gray-300 ' />

        <div className="my-6">
          <h3 className=' text-lg   sm:text-xl   font-bold   text-[#E5A95E] '>Product Information</h3>
          <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
          <AccordionTrigger>Product Details</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
          <AccordionTrigger>Vendor Details</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
           Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          </AccordionItem>
          </Accordion>
        </div>
        <div>
          <h3 className=' text-lg   sm:text-xl   font-bold   text-[#E5A95E] '>Customer Reviews</h3>
          <div className=' flex   items-center   gap-1.5   mt-4 '>
            <svg className=' w-5   h-5   fill-yellow-300 ' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
            </svg>
            <svg className=' w-5   h-5   fill-yellow-300 ' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
            </svg>
            <svg className=' w-5   h-5   fill-yellow-300 ' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
            </svg>
            <svg className=' w-5   h-5   fill-yellow-300 ' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
            </svg>
            <svg className=' w-5   h-5   fill-[#CED5D8] ' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
            </svg>
          </div>

          <div className=' flex   items-center   flex-wrap   gap-4   mt-4 '>
            <h4 className=' text-2xl   sm:text-3xl   text-[#E5A95E]   font-semibold '>4.0 / 5</h4>
            <p className=' text-sm   text-white '>Based on 253 ratings</p>
          </div>
        </div>

        <div className=' mt-6 '>
          <div className=' flex   items-start '>
            <img src='https://readymadeui.com/team-2.webp' className=' w-12   h-12   rounded-full   border-2   border-white ' />
            <div className=' ml-3 '>
              <h4 className=' text-sm   font-bold '>John Doe</h4>
              <div className=' flex   space-x-1   mt-1 '>
                <svg className=' w-[14px]   h-[14px]   fill-yellow-300 ' viewBox='0 0 14 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
                </svg>
                <svg className=' w-[14px]   h-[14px]   fill-yellow-300 ' viewBox='0 0 14 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
                </svg>
                <svg className=' w-[14px]   h-[14px]   fill-yellow-300 ' viewBox='0 0 14 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
                </svg>
                <svg className=' w-[14px]   h-[14px]   fill-yellow-300 ' viewBox='0 0 14 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
                </svg>
                <svg className=' w-[14px]   h-[14px]   fill-[#CED5D8] ' viewBox='0 0 14 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z' />
                </svg>
                <p className=' text-xs   text-white   !ml-2 '>2 mont</p>
              </div>
              <p className=' text-sm   text-white   mt-4 '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
          <a href='javascript:void(0)' className=' block   text-[#E5A95E]   hover:underline   text-sm   mt-6   font-semibold '>Read all
            reviews</a>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div className="px-2">
    <h1 className="text-4xl text-center my-10 text-[#E5A95E]">Discover More</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {products.map((product, index) => (
               <Card products={product} index={index}/>
             ))}
      </div>
  </div>
</div>
    )
}