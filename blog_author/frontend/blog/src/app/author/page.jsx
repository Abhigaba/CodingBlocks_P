'use client'
import React from 'react'
import AuthorCard from '../components/AuthorCard'
import { useState, useEffect } from 'react'
import axios from 'axios'
const author = () => {

    const [authorData, setAuthorData] = useState([])

    useEffect( () => {
  
      const getData = async() => { 
      const res = await axios.get('http://localhost:3000/author/fetch')
      if (res.data.data.length > 0){
      setAuthorData(res.data.data) ;}
    }
      getData();
    }, [])
  
    const handleSubmit= async (event) => {
      event.preventDefault(); 
  
      const name = event.target[0].value; // First input (Blog Title)
      const age = parseInt(event.target[1].value); // Second input (Author ID)
      const imageUrl = event.target[2].value; // Third input (Content)
  
      const res = await axios.post('http://localhost:3000/author/add', {name, age, imageUrl})
      const data = res.data.data; 
  
      setAuthorData([...authorData, data])
    }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800">Author</h1>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Age"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
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
          Submit
        </button>
      </form>

      <div className="space-y-4">
        {authorData.map((n, i) => (
          <AuthorCard
            key={i}
            info={n}
            setAuthorData={(data) => setAuthorData(data)}
            authorData={authorData}
          />
        ))}
      </div>
    </div>
  )
}

export default author