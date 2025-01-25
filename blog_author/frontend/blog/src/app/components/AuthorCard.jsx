import React from 'react'
import Link from 'next/link';
import axios from 'axios';
const AuthorCard = ({authorData, setAuthorData, info}) => {

    const {_id,name, imageUrl, age} = info;
    const handleDelete = async() => {
        
        try {
            await axios.delete(`http://localhost:3000/author/delete/${_id}`)

            
            const updatedData = authorData.filter((n) => n._id != _id)
            setAuthorData(updatedData)
        }
        catch(error) {
            console.log(error)
        }
    }

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white flex flex-col items-center space-y-4">
    <p className="text-lg font-semibold text-gray-800">{name}</p>
    <p className="text-sm text-gray-600">Age: {age}</p>
    <img
      src={`${imageUrl}`}
      alt="Author"
      className="w-24 h-24 rounded-full object-cover border border-gray-200"
    />

    <div className="flex space-x-4">
      <Link
        href={`/authorUpdate/${_id}`}
        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
      >
        Update
      </Link>
      <button
        onClick={() => handleDelete()}
        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  </div>
  )
}

export default AuthorCard