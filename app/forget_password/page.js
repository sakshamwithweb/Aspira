"use client";
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        (async () => {
            const req = await fetch("/api/getUserData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            })
            const res = await req.json()
            console.log(res)
        })()
    };

    useEffect(() => {
        (async () => {
            const req = await fetch("/api/getUserSession")
            const res = await req.json()
            console.log(res)
            if (res.success) {
                redirect("/dashboard")
            }
        })()
    }, [])

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-6 space-y-4">
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit
            </button>
        </form>
    );
};

export default Page;
