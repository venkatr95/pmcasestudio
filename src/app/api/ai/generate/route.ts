import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const { prompt, type } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ 
      text: `[MOCK AI OUTPUT] This is auto-generated content for ${type}. To enable real AI generation, please set OPENAI_API_KEY in your .env file.` 
    });
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      system: 'You are an expert Product Manager assistant. Return concise, structured data. Do not use markdown codeblocks like ```json unless explicitly asked to.',
    });
    return NextResponse.json({ text });
  } catch (e) {
    console.error('AI Error:', e);
    return new NextResponse('AI generation failed', { status: 500 });
  }
}
