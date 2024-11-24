"use client";

import React, { useEffect, useState } from "react";

const SkillManage = ({ email }) => {
    const [skills, setSkills] = useState([{ key: "", value: "" }]);
    const [wait, setWait] = useState(false)

    const handleAddSkill = () => {
        setSkills([...skills, { key: "", value: "" }]);
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const handleChange = (index, type, value) => {
        const updatedSkills = skills.map((skill, i) =>
            i === index ? { ...skill, [type]: value } : skill
        );
        setSkills(updatedSkills);
    };

    const handleSubmit = async () => {
        setWait(true)
        console.log(skills);
        const req = await fetch("/api/dashboard/skill/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, skills })
        })
        const res = await req.json()
        if (!res.success) {
            alert("Error adding skills")
            return
        }
        setWait(false)
        alert("Skills added successfully")
    };

    useEffect(() => {
        (async () => {
            setWait(true)
            const req = await fetch("/api/dashboard/skill/find", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
            const res = await req.json()
            setWait(false)
            try {
                setSkills(res.data.skills)
            } catch (error) {
            }
        })()

    }, [])

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Skills</h1>
            <div className="space-y-4">
                {skills.map((skills, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="SKILL"
                            value={skills.key}
                            onChange={(e) => handleChange(index, "key", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={wait}
                        />
                        <input
                            type="text"
                            placeholder="ROLE MODEL"
                            value={skills.value}
                            onChange={(e) => handleChange(index, "value", e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={wait}
                        />
                        <button
                            onClick={() => handleRemoveSkill(index)}
                            disabled={wait}
                            className="text-red-500 hover:text-red-700"
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddSkill}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                >
                    <span className="mr-2 text-xl">+</span> Add Another
                </button>
                <button
                    onClick={handleSubmit}
                    className={`w-full ${wait && "opacity-50 cursor-not-allowed"} bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4`}
                    disabled={wait}
                >
                    {wait ? "Please wait..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default SkillManage;
