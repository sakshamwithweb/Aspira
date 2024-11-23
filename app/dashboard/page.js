"use client"
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    useEffect(() => {
        (async () => {
            const req = await fetch("/api/getUserSession")
            const res = await req.json()
            console.log(res)
            if(!res.success){
                redirect("/enter")
            }else{
                console.log("hurray you are logged in")
            }
        })()
    }, [])
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default page;