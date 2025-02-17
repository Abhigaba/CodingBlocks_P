"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import Blogcard from "./components/Blogcard";
export default function Home() {

  const [blogData, setBlogData] = useState([])
  
  const getData = async() => { 
    const res = await axios.get('http://localhost:3000/blog/fetch')
    if (res.data.data.length > 0){
    setBlogData(res.data.data) ;}
  }
  useEffect( () => {


    getData();
  }, [])


  const handleSubmit= async (event) => {
    event.preventDefault(); 

    const title = event.target[0].value; 
    const author = event.target[1].value; // Second input (Author ID)
    const content = event.target[2].value; // Third input (Content)

    const res = await axios.post('http://localhost:3000/blog/add', {title: title, author: author, content: content})
    getData();
  }

  return (
    <>
 <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Blogs</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="space-y-4 p-6 bg-white rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Author ID"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Content"
          rows="4"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>

      <div className="space-y-6">
        {blogData.map((n, i) => {
          return (
            <Blogcard
              key={i}
              cont={n}
              setBlogData={(data) => setBlogData(data)}
              blogData={blogData}
            />
          );
        })}
      </div>
    </div>

    </>  );
}
