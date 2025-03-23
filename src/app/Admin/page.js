'use client'
import { Input } from "@/components/ui/input";
import ImageUpload from "../components/Image-Upload";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { AppContext } from "@/context/Appcontext";

export default function Admin(){
    const { SaveProduct } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        reviews: '',
        rating: '',
        volume: '',
    });

const addProduct = () => {
    SaveProduct(formData)
    setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        reviews: '',
        rating: '',
        volume: '',
      });
}

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    return(
        <div className="flex py-10 justify-center items-center h-auto">
            <div className="flex h-auto p-10 justify-center w-1/2 border border-gray-500 rounded-xl shadow-lg shadow-gray-800">
                <div className="flex w-full flex-col gap-10 justify-between">
                    <h1 className="text-3xl text-center font-semibold text-[#E5A95E]">Add a Product</h1>
                    <ImageUpload setFormData={setFormData}/>
                    <Input name="name" value={formData.name} placeholder='Enter Product Name' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Input name="description" value={formData.description} placeholder='Enter Product Description' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Input name="price" value={formData.price} placeholder='Enter Product Price' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Input name="reviews" value={formData.reviews} type='text' placeholder='Enter Product Reviews' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Input name="rating" value={formData.rating} type='text' placeholder='Enter Product Ratings' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Input name="volume" value={formData.volume} type='text' placeholder='Enter Product Volume' className="bg-transparent border-gray-500" onChange={handleChange}/>
                    <Button className="bg-[#E5A95E] hover:bg-[#D49A4F] text-black" onClick={addProduct}>Add Product</Button>
                </div>
            </div>
        </div>
    )
}