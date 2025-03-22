// import { Input } from "@/components/ui/input";

// export default function ImageUpload({handleChange}){

//     return(
//         <div>
//     <label htmlFor='uploadFile1'
//       className='bg-transparent text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-600 border-dashed mx-auto font-[sans-serif]'>
//       <svg xmlns='http://www.w3.org/2000/svg' className='w-11 mb-2 fill-gray-500' viewBox='0 0 32 32'>
//         <path
//           d='M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z'
//           data-original='#000000' />
//         <path
//           d='M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z'
//           data-original='#000000' />
//       </svg>
//       Upload Image

//       <Input type='file' id='uploadFile1' className='hidden' onChange={handleChange}/>
//       <p className='text-xs font-medium text-gray-400 mt-2'>PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
//     </label>
//     </div>
//     )
// }


import { useState } from "react";
import { Input } from "@/components/ui/input";
import axios from 'axios';

export default function ImageUpload({ setFormData }) {
  const [isUploading, setIsUploading] = useState();
  const [previewUrl, setPreviewUrl] = useState();


  const handleFileChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const preview = URL.createObjectURL(files);
      setPreviewUrl(preview);
      handleImageUpload(files);
    }
  };

  const handleImageUpload = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData?.append("file", file);
    uploadFormData?.append("upload_preset", "perfumes");
    uploadFormData?.append("cloud_name", "doo8r5y0m");

    try {
      setIsUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/doo8r5y0m/image/upload`,
        uploadFormData
      );
      const imageUrl = response.data.secure_url;
      setFormData((prev) => ({ ...prev, imageUrl }));
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      alert("Image upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="uploadFile1"
        className="bg-transparent text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-600 border-dashed mx-auto font-[sans-serif]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-11 mb-2 fill-gray-500"
          viewBox="0 0 32 32"
        >
          <path
            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
            data-original="#000000"
          />
          <path
            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
            data-original="#000000"
          />
        </svg>
        {
          previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-full object-cover rounded-lg border"
            />
          ) : (
            <>
        Upload Images

        <Input
          type="file"
          id="uploadFile1"
          className="hidden"
          accept="image/*"
          name="imageUrl"
          onChange={handleFileChange}
        />
        <p className="text-xs font-medium text-gray-400 mt-2">
          PNG, JPG, SVG, WEBP, and GIF are allowed.
        </p>
        </>
        )
      }
      </label>

      {/* Image Preview Section */}
      {/* <div className="mt-4 flex gap-4 flex-wrap">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`preview-${index}`}
            className="w-24 h-24 object-cover rounded-lg border"
          />
        ))}
      </div> */}
    </div>
  );
}
