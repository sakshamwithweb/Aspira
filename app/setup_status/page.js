"use client"
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    (async () => {
      const req = await fetch('/api/getUserSession')
      const res = await req.json()
      console.log(res)
      if (res.success) {
        setSigned(true)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {signed ? (
        <div className="p-8 bg-green-50 border border-green-500 rounded-lg shadow-xl text-center">
          <h1 className="text-green-800 text-3xl font-bold mb-4">🎉 Welcome Back!</h1>
          <p className="text-green-700 text-lg">
            You are successfully signed in. Everything looks awesome here! 🌟
          </p>
        </div>
      ) : (
        <div className="p-8 bg-red-50 border-4 border-red-700 rounded-lg text-center">
          <h1 className="text-red-800 text-3xl font-extrabold mb-4">😬 Oops!</h1>
          <p className="text-red-700 text-lg">
            You are <strong>not signed in🛑</strong>. 
          </p>
        </div>
      )}
    </div>
  )
}

export default Page