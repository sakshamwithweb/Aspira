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
                {
                    role: 'user',
                    content: `You are a skilled and insightful mentor helping individuals improve specific skills based on their recent conversations. 
                    I am ${user.name}, and here is some context about me:
                    - I aim to develop the following skills and want to emulate the role models: ${JSON.stringify(skill.skills)}.                  
                    Below is a transcription of a recent conversation I had:
                    "${transcribe}"
                    Based on the transcription and the skills I want to improve, please provide:
                    1. A concise piece of actionable advice (1-2 sentences) tailored to my goals, if there is an opportunity for improvement.
                    2. If no actionable advice is relevant, respond with exactly the word: "false".
                    Ensure your response is in plain text with no markdown, bullet points, or additional formatting.`
                }
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


