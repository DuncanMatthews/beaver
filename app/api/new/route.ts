import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/prisma/db";

export async function POST(req: Request) {
  try {
    await prisma.$connect();

    const request = await req.json();

    if (!request?.url || typeof request.url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const urlObj = new URL(request.url);
    const youtubeVideoId = urlObj.searchParams.get("v");

    if (!youtubeVideoId) {
      return NextResponse.json({ error: 'Invalid YouTube video ID' }, { status: 400 });
    }

    const sessionId = `${uuidv4()}_${Date.now()}`;

    let content;
    try {
      content = await getSubtitles({ videoID: youtubeVideoId });
    } catch (err) {
      console.error('Error fetching subtitles:', err);
      return NextResponse.json({ error: 'Failed to fetch video subtitles' }, { status: 500 });
    }

    if (!content?.length) {
      return NextResponse.json({ error: 'No subtitles found' }, { status: 400 });
    }

    const processedContent = content.map((c: any) => c.text).join(" ");

    try {
      console.log('Attempting to create video entry...');
      const videoStatus = await prisma.videos.create({
        data: {
          url: request.url,
          session_id: sessionId,
          content: processedContent,
        },
      });

      console.log('Video entry created successfully:', videoStatus);
      return NextResponse.json({ sessionId, content: processedContent });
    } catch (err) {
      console.error('Error creating video entry:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));

      if (err.code === "P2021") {
        console.log('Database table not found. Please run migrations.');
      }

      return NextResponse.json({ error: 'Failed to create video entry', details: err.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}