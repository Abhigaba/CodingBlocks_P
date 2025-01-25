'use client'
import axios from "axios";
import { useEffect, useState } from "react";

const Blog =  ({params}) => {
  
  const [id, setId] = useState()
  const [data, setdata] = useState({}) 
  const [loading, setloading] = useState(true)
  const [title, settitle] = useState('');
  const [content, setcontent] = useState('');


  useEffect(() => {
    const getID = async() =>{
      const id = (await params).id
      const res = await axios.get(`http://localhost:3000/blog/fetch/${id}`)
      setdata(res.data.data);
      settitle(res.data.data.title) ;
      setcontent(res.data.data.content)
      setId(id)
      setloading(false)
    }    
    getID();
  
  }, [])



  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.patch(`http://localhost:3000/blog/update/${id}`, {
        title,
        content,
      });

      console.log("Blog updated successfully:", response.data);
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update the blog.");
    }
  };

  if (loading ) {
    return <>
      <p>Loading</p>
    </>
  }
  return (
    
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Update Blog: {data.author.name}
      </h1>
      <div>
        <form onSubmit={(e) => handleUpdate(e)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Content"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
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
    </div>  );
};

export default Blog;
