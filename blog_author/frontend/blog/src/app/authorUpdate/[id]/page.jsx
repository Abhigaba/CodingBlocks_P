'use client'
import axios from "axios";
import { useEffect, useState } from "react";

const Author =  ({params}) => {
  
  const [id, setId] = useState()
  const [data, setdata] = useState({})
  useEffect(() => {
    const getID = async() =>{
      const id = ((await params).id)
      const res = await axios.get(`http://localhost:3000/author/fetch/${id}`)
      setdata(res.data.data);
      setId(id);
    }
    getID();
  
  }, [])


  const handleUpdate = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const age = parseInt(e.target[1].value);
    const imageUrl = e.target[2].value;
    
    
    try {
      const response = await axios.patch(`http://localhost:3000/author/update/${id}`, {
        name, age, imageUrl
      });

      console.log("Blog updated successfully:", response.data);
      alert("Blog updated successfully!");
    } catch (error) {
      alert("Failed to update the blog.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
    <h1 className="text-2xl font-semibold text-gray-800 text-center">
      Update Author: {data.name}
    </h1>
    <div className="flex justify-center">
      <img
        src={data.imageUrl}
        alt="Author"
        className="w-32 h-32 rounded-full object-cover border border-gray-300"
      />
    </div>
    <div>
      <form onSubmit={(e) => handleUpdate(e)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Age"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Image URL"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Update
        </button>
      </form>
    </div>
  </div>
  );
};

export default Author;
