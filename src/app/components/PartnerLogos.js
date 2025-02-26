import Image from "next/image"

// const partners = [
//     Zipper, Pipedrive, CIBBank, Startup, EventTrust, Monohub, Moz
//   ]
  
  export default function PartnerLogos() {
    return (
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 lg:gap-8 xl:gap-10">
            {/* {partners.map((partner, index) => (
              <Image src={partner} key={index} alt="partners"/>
            ))} */}
          </div>
        </div>
      </section>
    )
  }
  
  