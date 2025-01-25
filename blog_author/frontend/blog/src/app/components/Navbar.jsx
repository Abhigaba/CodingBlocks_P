"use client"
import React from 'react'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <>
    <div className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className="text-lg font-medium hover:text-blue-300 transition"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/author"
              className="text-lg font-medium hover:text-blue-300 transition"
            >
              Author
            </Link>
          </li>
        </ul>
      </div>
    </div>
        </>
  )
}
