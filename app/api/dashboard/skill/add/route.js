import { Skill } from "@/lib/model/skill";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(params) {
    try {
        const { email, skills } = await params.json();
        await connectDb()
        const findskill = await Skill.findOne({ email });
        if (findskill) {
            const updateskill = await Skill.findOneAndUpdate({ email }, { skills });
            return NextResponse.json({ success: true, message: "Skill updated successfully" })
        }
        const skill = new Skill({ email, skills });
        await skill.save();
        return NextResponse.json({ success: true, message: "Skill added successfully" })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error adding skill" })
    }
}