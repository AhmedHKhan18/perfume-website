'use client'
// import ProductCard from './ProductCard'
// import { useAppContext } from '../context/useContext'

// const featuredProducts = [
//   { id: 1, name: 'Library Stool Chair', price: 20, image: FirstChair, tag: 'New' },
//   { id: 2, name: 'Library Stool Chair', price: 20, image: SecondChair, tag: 'Sale' },
//   { id: 3, name: 'Library Stool Chair', price: 20, image:  ThirdChair},
//   { id: 4, name: 'Library Stool Chair', price: 20, image:  FourthChair},
// ]
export default function FeaturedProducts() {
//   const { products }:any = useAppContext()

  return (
    <section className="py-16">
      <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* {products.map((product:any) => (
          <ProductCard key={product._id} product={product} />
        ))} */}
      </div>
    </section>
  )
}

