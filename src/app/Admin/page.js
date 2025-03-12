'use client'
import { Input } from "@/components/ui/input";
import ImageUpload from "../components/Image-Upload";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AppContext } from "@/context/App.context";

export default function Admin(){
    const { SaveProduct } = useContext(AppContext);
    console.log("🚀 ~ Admin ~ SaveProduct:", SaveProduct)

const addProduct = () => {
    SaveProduct()
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
                    <ImageUpload/>
                    <Input text={true} placeholder='Enter Product Name' className=" bg-transparent border-gray-500"/>
                    <Input text={true} placeholder='Enter Product Description' className=" bg-transparent border-gray-500"/>
                    <Input number={true} placeholder='Enter Product Price' className=" bg-transparent border-gray-500"/>
                    <Input type='text' placeholder='Enter Product Name' className=" bg-transparent border-gray-500"/>
                    <Input type='text' placeholder='Enter Product Name' className=" bg-transparent border-gray-500"/>
                    <Button className="bg-[#E5A95E] hover:bg-[#D49A4F] text-black" onClick={addProduct}>Add Product</Button>
                </div>
            </div>
        </div>
    )
}