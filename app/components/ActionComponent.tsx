import { useState } from "react";
import Loading from "../components/SvgComps/loading";
import axios from "axios";
import { GithubButton } from "./GithubButton";
import LoadingIcon from "../components/SvgComps/loading";

export const ActionComponent = ({
  setSessionId,
  sessionId,
}: {
  setSessionId: (sessionId: string) => void;
  sessionId: string;
}) => {
  const [action, setAction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>("");

  const generateContent = (variant: string) => {
    setLoading(true);
    axios
      .post("/api/content", {
        sessionId: sessionId,
        variant,
        instructions,
      })
      .then(() => {
        window.open(`${window.location.origin}/${variant}/${sessionId}`, "_blank");
      })
      .catch(() => {
        alert("Something went wrong, please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startChat = () => {
    window.open(`${window.location.origin}/chat/${sessionId}`, "_blank");
  };

  const actions = [
    { id: "tweet", label: "Generate Twitter thread" },
    { id: "blog", label: "Generate a blog post" },
    { id: "chat", label: "Chat with it" },
  ];

  return (
    <div className="w-full  max-w-2xl mx-auto px-4 py-8">
      <div className=" dark:bg-neutral-800 rounded-lg  p-6 animate-fadeIn">
        <button
          onClick={() => setSessionId("")}
          className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
        >
          ← Go Back
        </button>
        
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          What would you like to do with this video?
        </h2>
        
        <div className="space-y-3 mb-6">
          {actions.map((item) => (
            <button
              key={item.id}
              onClick={() => setAction(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg shadow transition-colors ${
                action === item.id
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {action && action !== "chat" && (
          <>
            <textarea
              onChange={(e) => setInstructions(e.target.value)}
              value={instructions}
              rows={4}
              className="w-full p-3 mb-4 text-sm rounded-lg border bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any instructions? (optional)"
            />
            <button
              onClick={() => generateContent(action)}
              disabled={loading}
              className={`w-full py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ?<LoadingIcon size={24} color="#1e88e5" />
 : "Generate"}
            </button>
          </>
        )}
        
        {action === "chat" && (
          <button
            onClick={startChat}
            className="w-full py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            Start Chatting
          </button>
        )}
      </div>
      
      
    </div>
  );
};