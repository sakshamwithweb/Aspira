import { Skill } from "@/lib/model/skill";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(params) {
    try {
        const { email } = await params.json();
        await connectDb()
        const find = await Skill.findOne({ email })
        if (!find) {
            return NextResponse.json({ success: false })
        }
        return NextResponse.json({ success: true, data: find })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false })
    }
}