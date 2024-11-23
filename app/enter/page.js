"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [omi_userid, setOmiUserid] = useState("")

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            if (email.trim() === "" || password.trim() === "") {
                alert("fill form")
                return
            }
            const req = await fetch("/api/enter/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const res = await req.json()
            if (res.success) {
                redirect("/dashboard")
            } else {
                alert(res.message)
            }
            return
        }
        if (name.trim() === "" || omi_userid.trim() === "" || email.trim() === "" || password.trim() === "") {
            alert("fill form")
            return
        }
        const req = await fetch("/api/enter/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name,
                omi_userid: omi_userid
            })
        })
        const res = await req.json()
        if (res.success) {
            alert("signed up successfully! Now login")
            window.location.reload()
        } else {
            alert(res.message)
        }
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="w-full max-w-lg sm:max-w-md bg-white p-8 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? "Login to Aspira" : "Sign up for Aspira"}
                </h2>

                <form>
                    {!isLogin && (
                        <>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="omi-user-id"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    OMI User ID
                                </label>
                                <input
                                    type="text"
                                    value={omi_userid}
                                    onChange={(e) => setOmiUserid(e.target.value)}
                                    id="omi-user-id"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your OMI User ID"
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "New to Aspira?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={toggleForm}
                            className="text-blue-600 font-medium hover:underline focus:outline-none"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </p>
                    <Link
                        href="/enter/forget_password"
                        className="mt-2 inline-block text-sm text-blue-600 font-medium hover:underline"
                    >
                        Forget Password?
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Page;
