import { openAiHandler } from "@/utils";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to serialize BigInt
const serializeBigInt = (data: any): any => {
  return JSON.parse(JSON.stringify(data, (_, v) =>
    typeof v === 'bigint' ? v.toString() : v
  ));
};

export async function POST(req: Request) {
  const request = await req.json();

  try {
    const video = await prisma.videos.findFirst({
      where: {
        session_id: request?.sessionId,
      },
      select: {
        content: true,
      },
    });

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    let blog;
    let tweet;

    if (request?.variant === "tweet") {
      tweet = await getTweet(video.content ?? "");
      if (!tweet?.length) {
        throw new Error("Failed to generate tweet");
      }
    } else {
      blog = await openAiHandler(
        video.content ?? "",
        "blog",
        request?.instructions
      );
    }

    const generation = await prisma.$transaction(async (tx) => {
      return tx.generations.create({
        data: {
          blog: blog,
          thread: tweet,
          session_id: request?.sessionId,
        },
      });
    }, {
      timeout: 10000 // 10 seconds timeout for this transaction
    });

    // Serialize the generation object to handle BigInt
    const serializedGeneration = serializeBigInt(generation);

    return NextResponse.json({ status: true, generation: serializedGeneration });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse("Something went wrong", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

const getTweet = async (content: string, count = 1): Promise<any> => {
  if (count === 4) return [];
  
  try {
    let tweet = await openAiHandler(content ?? "", "tweet");
    return JSON.parse(tweet);
  } catch (e) {
    console.log("Retry", count);
    return getTweet(content, count + 1);
  }
};