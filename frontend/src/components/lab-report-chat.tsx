import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export function LabReportChat({
  reportId,
  fileName,
}: LabReportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // Demo AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "This is a demo AI response. In production, this would analyze your lab report and answer your question accurately.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
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
