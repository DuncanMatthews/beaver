"use client";

import { useState } from "react";
import axios from "axios";
import Loading from "../components/SvgComps/loading";
import { GithubButton } from "./GithubButton";
import LoadingIcon from "../components/SvgComps/loading";

export const YoutubeVideoComponent = ({
  setSessionId,
}: {
  setSessionId: (sessionId: string) => void;
}) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    const match = regex.exec(url);
    if (!match) {
      alert("Invalid URL");
      return;
    }
    setLoading(true);

    axios
      .post("/api/new", {
        url: url,
      })
      .then((res) => {
        setSessionId(res.data.sessionId);
      })
      .catch(() => {
        alert("Unable to process given video, try another one.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-8">
        Welcome to <span className="text-primary-600 dark:text-primary-400">Crucible</span>
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 mb-8 animate-fadeIn">
        <label htmlFor="url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          YouTube Video URL
        </label>
        <div className="flex gap-4">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="text"
            id="url"
            className="flex-grow border text-sm rounded-lg p-2.5 bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://www.youtube.com/watch?v=TX9qSaGXFyg&t=23s"
            required
          />
          <button
            onClick={!loading ? handleSubmit : undefined}
            type="button"
            className={`px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {!loading ? "Continue" : <LoadingIcon size={24} color="#1e88e5" />
          }
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-neutral-900 dark:text-neutral-100">Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {["Generate a Twitter thread", "Generate a blog post", "Chat with the video"].map((feature, index) => (
            <div key={index} className="bg-slate-100 dark:bg-neutral-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="text-primary-600 dark:text-primary-400 mb-2">
                {/* You can add icons here */}
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">{feature}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Transform your YouTube content effortlessly with our AI-powered tools.
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};