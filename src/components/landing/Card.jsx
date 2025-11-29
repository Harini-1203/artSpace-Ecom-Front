import React from 'react'
import pic from "../../assets/pic.webp";




export const Card = () => {
  return (
    <div className=" bg-white  rounded-lg shadow-md overflow-hidden mt-6 cursor-pointer" onClick={() => navigate("/product/1")}> 
        <img src={pic} alt="Product" className="w-full h-80 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">Product Name</h3>
          <p className="text-gray-700 font-medium mt-1">$49.99</p>
          {/* Color Options */}
          {/* <div className="flex gap-2 mt-3">
            <span className="w-6 h-6 rounded-full bg-red-500 border border-gray-300"></span>
            <span className="w-6 h-6 rounded-full bg-blue-500 border border-gray-300"></span>
            <span className="w-6 h-6 rounded-full bg-green-500 border border-gray-300"></span>
          </div> */}
          {/* Add to Cart */}
          <button className="mt-4 w-full bg-[var(--brand-blue)] text-white py-2 px-4 rounded-lg transition" onClick={(e) => {
            e.stopPropagation();
            navigate("/cart");
          }}>
            Add to Cart
          </button>
        </div>
      </div>
  )
}
