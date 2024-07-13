import React from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import rehype from "rehype-raw";
import { GithubButton } from "../../components/GithubButton";
import CopyComp from "@/app/components/Copy";
import { prisma } from "../../../prisma/db";

async function getBlog(id: string) {
  const generations = await prisma.generations.findFirst({
    where: {
      session_id: id,
    },
    select: {
      blog: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });
  return generations?.blog || undefined;
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params?.id);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Generated Blog
          </h1>
          <GithubButton />
        </header>

        <main className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
          {blog ? (
            <div className="p-6">
              <div className="mb-4">
                <CopyComp text={blog} />
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehype]}
                className="prose dark:prose-invert max-w-none"
              >
                {blog}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-6 text-center text-neutral-600 dark:text-neutral-400">
              <p className="mb-4">Blog not found.</p>
              <p>
                If you believe this is an error, please try refreshing the page
                or raise an issue on Github.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}