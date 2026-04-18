import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Send, Bot, User } from "lucide-react"; // Icons for better UI

export function LabReportChat({ reportId }: { reportId: string }) {
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Better scroll logic: scroll the internal viewport
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const onSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user" as const, content: input };
    const currentHistory = [...messages, userMsg]; // Capture history including new msg
    
    setMessages(currentHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/lab/reports/${reportId}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access")}` 
        },
        body: JSON.stringify({ 
          message: input,
          history: messages // Send history to backend for context
        })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply || "I've updated the analysis based on your question." 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting to the medical engine right now." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-150 border rounded-xl bg-slate-50 shadow-inner overflow-hidden">
      <div className="p-3 bg-white border-b flex items-center gap-2 font-medium text-slate-700">
        <Bot size={18} className="text-blue-600" />
        AI Health Assistant
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10 text-sm">
              Ask a question about your lab results...
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-1 mt-1 rounded-full h-fit ${m.role === 'user' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                   {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 border rounded-tl-none"
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="p-1 mt-1 bg-slate-200 rounded-full h-fit">
                   <Bot size={14} />
                </div>
                <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm space-y-2">
                  <Skeleton className="h-3 w-45 bg-slate-100" />
                  <Skeleton className="h-3 w-30 bg-slate-100" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-2" />
        </div>
      </ScrollArea>

      <div className="p-4 bg-white border-t">
        <form 
          className="flex gap-2" 
          onSubmit={(e) => { e.preventDefault(); onSend(); }}
        >
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask about your hemoglobin, cholesterol..." 
            className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 shrink-0">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}