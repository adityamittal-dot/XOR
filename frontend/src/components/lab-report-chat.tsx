<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
=======
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
>>>>>>> origin/frontend
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
<<<<<<< HEAD
} from "@/components/ui/card";
import { Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LabReportChatProps {
  reportId: string;
  fileName: string;
}

/**
 * UI-only chat interface for lab reports.
 * Simulates AI responses and is ready to be connected
 * to a DRF + Gemini backend later.
 */
=======
} from "./ui/card";
import { Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type LabReportChatProps = {
  reportId: string;
  fileName: string;
};

>>>>>>> origin/frontend
export function LabReportChat({
  reportId,
  fileName,
}: LabReportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
<<<<<<< HEAD
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
=======

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
>>>>>>> origin/frontend
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

<<<<<<< HEAD
    // UI-only simulated AI response
=======
    // Demo AI response
>>>>>>> origin/frontend
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
<<<<<<< HEAD
          "This is a demo AI response.\n\n" +
          "In production, this question would be sent to a Django REST Framework " +
          "API, which would securely call an AI service (such as Google Gemini) " +
          "to generate an accurate response about your lab report.",
=======
          "This is a demo AI response. In production, this would analyze your lab report and answer your question accurately.",
>>>>>>> origin/frontend
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
<<<<<<< HEAD
    }, 1000);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
=======
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
>>>>>>> origin/frontend
      e.preventDefault();
      handleSend();
    }
  };

  return (
<<<<<<< HEAD
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Ask Questions About This Report</CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Chat with AI about {fileName}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 min-h-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 pr-4 mb-4"
          style={{ maxHeight: "400px" }}
        >
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Ask questions about your lab report to get AI-powered
                answers.
              </p>
              <p className="text-xs mt-1">
=======
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <CardTitle>Ask Questions About This Report</CardTitle>
        </div>
        <p className="text-sm text-gray-500">
          Chat with AI about <span className="font-medium">{fileName}</span>
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col min-h-0">
        <ScrollArea className="mb-4 flex-1 pr-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p className="text-sm">
                Ask questions about your lab report
              </p>
              <p className="mt-1 text-xs">
>>>>>>> origin/frontend
                Example: “What do my cholesterol levels mean?”
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
<<<<<<< HEAD
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
=======
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {message.content
                        .replace(/\*\*/g, "")
                        .replace(/\*/g, "")
                        .replace(/#{1,6}\s+/g, "")
                        .replace(/`/g, "")}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-gray-500"
>>>>>>> origin/frontend
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
<<<<<<< HEAD
=======
              <div ref={bottomRef} />
>>>>>>> origin/frontend
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your lab report..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
