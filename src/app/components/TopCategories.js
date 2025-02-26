'use client'
import Image from 'next/image'
import Link from 'next/link'

// const category = [
//   { name: 'Wing Chair', image: FourthChair, count: 15 },
//   { name: 'Wooden Chair', image: FifthChair, count: 20 },
//   { name: 'Desk Chair', image: sixthChair, count: 12 },
// ]

export default function TopCategories() {

  return (
    <section className="py-16">
      <h2 className="text-2xl font-semibold mb-8">Top Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* {categories.map((category) => (
          <Link key={category.title} href={`/category/${category.title.toLowerCase().replace(' ', '-')}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={urlFor(category.image)}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-semibold">{category.title}</h3>
                <p className="text-white text-sm">{category.count} items</p>
              </div>
            </div>
          </Link>
        ))} */}
      </div>
    </section>
  )
}

