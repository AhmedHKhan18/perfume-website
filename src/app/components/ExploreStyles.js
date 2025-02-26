import Image from 'next/image'

// const styles = [
//   { id: 1, image: SeventhChair },
//   { id: 2, image: EightChair },
//   { id: 3, image: NinthChair },
//   { id: 4, image: TenthChair },
//   { id: 5, image: EleventhChair },
// ]

export default function ExploreStyles() {
  return (
    <section className="py-16">
      <h2 className="text-2xl font-semibold mb-8">Explore New and Popular Styles</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          {/* <Image
            src={SeventhChair}
            alt="Featured Style"
            width={600}
            height={600}
            className="w-full h-auto rounded-lg"
          /> */}
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-6">
          {/* {styles.slice(1).map((style) => (
            <Image
              key={style.id}
              src={style.image}
              alt={`Style ${style.id}`}
              width={300}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          ))} */}
        </div>
      </div>
    </section>
  )
}

