import React from 'react'
import axios from 'axios';
import Link from 'next/link';

const Blogcard = ({cont, setBlogData, blogData}) => {
    const {_id,author, content} = cont;
    const handleDelete = async() => {
        
        try {
            await axios.delete(`http://localhost:3000/blog/delete/${_id}`)
            const updatedData = blogData.filter((n) => n._id != _id)
            setBlogData(updatedData)
        }
        catch(error) {
            alert('Cannot be deleted');
        }
    }

  return (
    <div className="border  rounded-lg shadow-md p-4 bg-white space-y-4">
    <div className="flex items-center space-x-4">
      <img
        src={`${author.imageUrl}`}
        alt={`${author.name}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <p className="text-lg font-semibold">{author.name}</p>
    </div>
    <p className="text-gray-700">{content}</p>
    <div className="flex space-x-4">
      <Link
        href={`/blogUpdate/${_id}`}
        className="text-blue-500 hover:underline font-medium"
      >
        Update
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  </div>
  )
}

export default Blogcard