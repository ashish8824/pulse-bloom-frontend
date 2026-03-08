import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { clsx } from "clsx";
import { useSendAiChatMutation } from "@/services/aiApi";
import { AiPlanGate } from "./AiPlanGate";
import type { AiChatMessage } from "@/types/ai.types";

const CONVERSATION_ID_KEY = "pb_ai_conversation_id";

const STARTER_PROMPTS = [
  "Why do I feel worse on certain days of the week?",
  "Which of my habits has the biggest impact on my mood?",
  "What should I focus on to reduce my burnout risk?",
  "Give me a weekly plan based on my data",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-brand-400" />
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: AiChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex items-end gap-2",
        isUser ? "flex-row-reverse" : "flex-row",
        "max-w-[85%]",
        isUser ? "self-end" : "self-start",
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isUser
            ? "bg-brand-600/40 border border-brand-500/40"
            : "bg-gray-700 border border-gray-600",
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-brand-300" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-gray-300" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={clsx(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-brand-600/30 border border-brand-500/30 text-white rounded-br-sm"
            : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-sm",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(() =>
    localStorage.getItem(CONVERSATION_ID_KEY),
  );
  const [sendMessage, { isLoading }] = useSendAiChatMutation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;

    const userMsg: AiChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const result = await sendMessage({
        message: messageText,
        conversationId: conversationId ?? undefined,
      }).unwrap();

      const assistantMsg: AiChatMessage = {
        role: "assistant",
        content: result.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (result.conversationId && result.conversationId !== conversationId) {
        setConversationId(result.conversationId);
        localStorage.setItem(CONVERSATION_ID_KEY, result.conversationId);
      }
    } catch {
      const errMsg: AiChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem(CONVERSATION_ID_KEY);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[750px] card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              AI Wellness Coach
            </p>
            <p className="text-xs text-gray-500">
              Powered by your 90-day behavioral data
            </p>
          </div>
        </div>
        {!isEmpty && (
          <button
            onClick={handleNewConversation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {isEmpty ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">
                Your AI Wellness Coach
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Ask me anything about your mood patterns, habits, or get
                personalized recommendations.
              </p>
            </div>
            {/* Starter prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left px-3 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-brand-600/50 hover:bg-gray-800 text-xs text-gray-300 transition-all leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-800 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your mood patterns, habits, or get advice..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none min-h-[42px] max-h-28 leading-relaxed"
            style={{ height: "42px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "42px";
              el.style.height = Math.min(el.scrollHeight, 112) + "px";
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export function AiChatPage() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-400" />
          AI Coach Chat
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your personal wellness coach — trained on your behavioral data
        </p>
      </div>

      <AiPlanGate feature="ai_chat">
        <ChatInterface />
      </AiPlanGate>
    </div>
  );
}
