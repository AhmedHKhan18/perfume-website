import Link from "next/link";

export default function BreadCrumbs({pageTitle}) {
    return(
        <ul className="flex items-center justify-start ml-10 font-[sans-serif] space-x-4 mt-4">
      <li className="text-white hover:text-[#E5A95E] text-base cursor-pointer">
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-400 w-3.5 -rotate-90" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clipRule="evenodd" data-original="#000000"></path>
        </svg>
      </li>
      <li className="text-white hover:text-[#E5A95E] text-base cursor-pointer">
        {pageTitle}
      </li>
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-400 w-3.5 -rotate-90" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clipRule="evenodd" data-original="#000000"></path>
        </svg>
      </li>
      <li className="text-white hover:text-[#E5A95E] text-base font-bold cursor-pointer">
        Edit
      </li>
    </ul>
    )
}