import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
export function LabReportChat({
  reportId,
  fileName,
}: LabReportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
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

    // UI-only simulated AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "This is a demo AI response.\n\n" +
          "In production, this question would be sent to a Django REST Framework " +
          "API, which would securely call an AI service (such as Google Gemini) " +
          "to generate an accurate response about your lab report.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
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
