"use client";

import { useState } from "react";
import { YoutubeVideoComponent } from "./components/YoutubeVideoComponent";
import { ActionComponent } from "./components/ActionComponent";
import Image from 'next/image';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary-600 dark:text-primary-400">Crucible</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-neutral-500 dark:text-neutral-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your AI-powered copilot for video content. Chat with your videos and transform them into blogs, Twitter threads, and more.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden">
            {!sessionId ? (
              <YoutubeVideoComponent setSessionId={setSessionId} />
            ) : (
              <ActionComponent sessionId={sessionId} setSessionId={setSessionId} />
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {['Input', 'Process', 'Output'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">{step}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-center">
                  {step === 'Input' && 'Paste your YouTube video URL'}
                  {step === 'Process' && 'Our AI analyzes your video content'}
                  {step === 'Output' && 'Get blogs, threads, and more'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}