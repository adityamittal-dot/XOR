import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { LabAPI, type ChatTurn } from "../api/lab";

export function LabReportChat({ reportId }: { reportId: number }) {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Start a fresh conversation whenever a different report is selected.
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [reportId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSend() {
    const question = input.trim();
    if (!question || loading) return;

    const history = messages;
    setMessages([...history, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await LabAPI.chat(reportId, question, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const detail =
        err instanceof Error ? err.message : "Please try again in a moment.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I could not answer that. ${detail}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[36rem] flex-col overflow-hidden rounded-xl border bg-slate-50 shadow-inner">
      <div className="flex items-center gap-2 border-b bg-white p-3 font-medium text-slate-700">
        <Bot size={18} className="text-blue-600" />
        AI Health Assistant
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="mt-10 text-center text-sm text-slate-400">
              Ask a question about your lab results...
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] gap-2 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`mt-1 h-fit rounded-full p-1 ${
                    m.role === "user" ? "bg-blue-100" : "bg-slate-200"
                  }`}
                >
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`whitespace-pre-wrap rounded-2xl p-3 text-sm shadow-sm ${
                    m.role === "user"
                      ? "rounded-tr-none bg-blue-600 text-white"
                      : "rounded-tl-none border bg-white text-slate-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] gap-2">
                <div className="mt-1 h-fit rounded-full bg-slate-200 p-1">
                  <Bot size={14} />
                </div>
                <div className="space-y-2 rounded-2xl rounded-tl-none border bg-white p-4 shadow-sm">
                  <Skeleton className="h-3 w-44 bg-slate-100" />
                  <Skeleton className="h-3 w-28 bg-slate-100" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </ScrollArea>

      <div className="border-t bg-white p-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your hemoglobin, cholesterol..."
            className="border-slate-200 bg-slate-50"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="shrink-0"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
