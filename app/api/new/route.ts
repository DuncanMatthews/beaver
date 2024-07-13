import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/prisma/db";

export async function POST(req: Request) {
  try {
    const request = await req.json();

    if (!request?.url || typeof request.url !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const urlObj = new URL(request.url);
    const youtubeVideoId = urlObj.searchParams.get("v");

    if (!youtubeVideoId) {
      return new Response(JSON.stringify({ error: 'Invalid YouTube video ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = `${uuidv4()}_${Date.now()}`;

    let content;
    try {
      content = await getSubtitles({ videoID: youtubeVideoId });
    } catch (err) {
      console.error('Error fetching subtitles:', err);
      return new Response(JSON.stringify({ error: 'Failed to fetch video subtitles' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!content?.length) {
      return new Response(JSON.stringify({ error: 'No subtitles found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const processedContent = content.map((c: any) => c.text).join(" ");

    try {
      const videoStatus = await prisma.$transaction(async (tx) => {
        return tx.videos.create({
          data: {
            url: request.url,
            session_id: sessionId,
            content: processedContent,
          },
        });
      });

      console.log({ videoStatus });
      return NextResponse.json({ sessionId,content: processedContent });
    } catch (err) {
      console.error('Error creating video entry:', err);
      
      if (err.code === "P2021") {
        console.log('Database table not found. Please run migrations.');
      }

      return new Response(JSON.stringify({ error: 'Failed to create video entry' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}