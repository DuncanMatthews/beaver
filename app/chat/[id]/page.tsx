"use client";

import React, { useEffect, useState, useRef } from "react";
import BotSvg from "../../components/SvgComps/BotSvg";
import EnterSvg from "../../components/SvgComps/EnterSvg";
import LoadingSvg from "../../components/SvgComps/loading";
import ReactMarkdown from "react-markdown";
import axios from "axios";

interface ChatInterface {
  msg: string;
  isSender: boolean;
}

export default function Chat({ params }: { params: { id: string } }) {
  const [answer, setAnswer] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatInterface[]>([
    { msg: "Hi, how can I help you?", isSender: false },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = async () => {
    if (loading || !search.trim()) return;
    
    const newChats = [
      ...chats,
      { msg: search, isSender: true },
      { msg: "", isSender: false },
    ];
    setChats(newChats);
    setSearch("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        sessionId: params.id,
        prompt: search.trim(),
        previous: chats.slice(1),
      }, {
        onDownloadProgress: (progressEvent: any) => {
          if (progressEvent?.event?.target?.response) {
            setAnswer(progressEvent.event.target.response);
          }
        },
      });
      setAnswer(response.data);
    } catch (error) {
      setAnswer("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setAnswer(""), 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (answer !== "") {
      setChats(prev => {
        const updated = [...prev];
        updated[updated.length - 1].msg = answer;
        return updated;
      });
    }
  }, [answer, loading]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Chat with the YouTube Bot
          </h1>
        
        </header>

        <main className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-[calc(100vh-250px)] overflow-y-auto p-6">
            {chats.map((chat, index) => (
              <div key={index} className={`mb-4 flex ${chat.isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${chat.isSender ? 'bg-primary-100 dark:bg-primary-900' : 'bg-neutral-100 dark:bg-neutral-700'} rounded-lg p-3`}>
                  {!chat.isSender && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mb-2">
                      <BotSvg />
                    </div>
                  )}
                  <ReactMarkdown className="prose dark:prose-invert max-w-none">
                    {chat.msg}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && !answer && (
              <div className="flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <LoadingSvg />
                <span className="ml-2">Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg">
              <textarea
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Type your message here..."
                className="flex-grow p-3 bg-transparent resize-none focus:outline-none dark:text-neutral-100"
                rows={1}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="p-3 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50"
              >
                <EnterSvg />
              </button>
            </div>
          </div>
        </main>

        
      </div>
    </div>
  );
}