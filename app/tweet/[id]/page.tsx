import Link from "next/link";
import { GithubButton } from "../../components/GithubButton";
import { prisma } from "../../../prisma/db";

async function getTweet(id: string) {
  const generations = await prisma.generations.findFirst({
    where: {
      session_id: id,
    },
    select: {
      thread: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });
  return generations?.thread || undefined;
}

export default async function Tweet({ params }: { params: { id: string } }) {
  const tweets = (await getTweet(params?.id)) as string[];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Twitter Thread
          </h1>
          <GithubButton />
        </header>

        <main>
          {tweets && tweets.length > 0 ? (
            <div className="space-y-4">
              {tweets.map((tweet, index) => (
                <Link
                  key={index}
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                >
                  <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {tweet}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                      Tweet this
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md animate-fadeIn">
              <p className="text-neutral-700 dark:text-neutral-300">
                Threads not found. If you believe this is an error, please try
                refreshing the page or raise an issue on Github.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}