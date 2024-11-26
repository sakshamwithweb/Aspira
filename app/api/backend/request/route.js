import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/model/register';
import { Skill } from '@/lib/model/skill';
import { OpenAI } from 'openai';

const mongoURI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
    mongoose.connect(mongoURI).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });
}

const openai = new OpenAI({
    apiKey: process.env.OpenAI,
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { transcribe, userId } = body;

        const user = await User.findOne({ omi_userid: userId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const skill = await Skill.findOne({ email: user.email });
        if (!skill) {
            return NextResponse.json({ error: 'User has set no skill' }, { status: 404 });
        }

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: "Provide all responses in plain text only no md of any formate. Respond with the exact content requested, avoiding additional context or preamble." },
                { role: 'user', content: `You are a helpful mentor. I am ${user.name} It is a json where I have writte my skill and the role model for that skill-${JSON.stringify(skill.skills)}\nIt is a transcription of what I was talking recently-${transcribe}.\nI want based on what I want to acquire skill and my conversation, if there is any advice to be better so give in short like 1-2 sentences but if there is no no such advice, return false` }
            ],
            model: 'gpt-3.5-turbo',
        });

        console.log(chatCompletion.choices[0].message.content)

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
            },
            skill: skill.skills,
            transcription: transcribe,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


