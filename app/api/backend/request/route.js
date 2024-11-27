import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/lib/model/register';
import { Skill } from '@/lib/model/skill';
import { OpenAI } from 'openai';
import { Summary } from '@/lib/model/summary';

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
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        const body = await request.json();
        const { transcript_segments } = body;
        console.log(transcript_segments)

        const user = await User.findOne({ omi_userid: uid });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const skill = await Skill.findOne({ email: user.email });
        if (!skill) {
            return NextResponse.json({ error: 'User has set no skill' }, { status: 404 });
        }

        const findSummary = await Summary.findOne({ email: user.email });
        let currentSummary;
        if (!findSummary) {
            const summary = new Summary({ email: user.email, summary: "empty" });
            await summary.save();
            currentSummary = "";
        } else {
            currentSummary = findSummary.summary;
        }
        const formattedSkill = skill.skills.map(skill => `${skill.key} as ${skill.value}`).join(", ")

        const prompt = `You are a skilled and insightful mentor helping individuals improve specific skills based on their recent conversations and historical context. 
        I am ${user.name}, and here is some context about me:
        - I aim to develop the following skills and emulate these role models: ${formattedSkill}.
        To give better advice, consider this summary of previous suggestions and feedback provided to me:
        "${currentSummary}"
        Below is a transcription of a recent conversation I had:
        "${JSON.stringify(transcript_segments)}"
        Based on the transcription, the skills I want to improve, and the historical summary, please provide:
        1. A concise piece of actionable advice (max 2 sentences) tailored to my goals, if there is an opportunity for improvement.
        2. If no actionable advice is relevant, respond with exactly the word: "false".
        Ensure your response is in plain text with no markdown, bullet points, or additional formatting.`
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: "Provide all responses in plain text only no md of any formate. Respond with the exact content requested, avoiding additional context or preamble." },
                {
                    role: 'user',
                    content: prompt
                }

            ],
            model: 'gpt-3.5-turbo',
        });
        console.log(prompt)
        console.log(chatCompletion.choices[0].message.content)

        if (chatCompletion.choices[0].message.content && chatCompletion.choices[0].message.content !== "false") {
            const latestAdvice = chatCompletion.choices[0].message.content;

            const updateSummaryCompletion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: "Provide all responses in plain text only. Respond with the exact content requested, avoiding additional context or preamble." },
                    {
                        role: 'user',
                        content: `You are an AI assistant tasked with updating summaries to reflect new advice. 
                Here is the current summary of previous suggestions and feedback:
                "${currentSummary}"
                Below is the latest advice provided:
                "${latestAdvice}"
                Update the summary by incorporating the latest advice. Write in a concise manner, like a memory log, with clear, actionable notes. 
                Ensure your response is in plain text with no markdown, bullet points, or additional formatting.`
                    }
                ],
                model: 'gpt-3.5-turbo',
            });
            const updatedSummary = updateSummaryCompletion.choices[0].message.content;
            console.log(updatedSummary)
            const updated = await Summary.findOneAndUpdate({ email: user.email }, { summary: updatedSummary });
            await updated.save();
            return NextResponse.json({
                success: true,
                message: latestAdvice,
            })
        } else {
            return NextResponse.json({
                success: false,
            })
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
