"use client";

import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: "user" | "bot", text: string }[]>([
    { type: "bot", text: "Hello! How can I help you today with the AI Complaint Analyzer?" }
  ]);

  const faqs = [
    { 
      q: "How do I submit a complaint?", 
      a: "First, register and login. Then click on 'New Complaint' in the dashboard or navigation menu to get started." 
    },
    { 
      q: "What can the AI analyze?", 
      a: "Our AI analyzes sentiment (tone), urgency priority, and provides a concise one-line summary of your complaint." 
    },
    { 
      q: "How do I check my status?", 
      a: "All your submissions are listed in your Dashboard. You can see if they are 'PENDING' or 'RESOLVED'." 
    },
    { 
      q: "Is my data secure?", 
      a: "Absolutely. We use secure hashing for passwords and private authenticated sessions for all your data." 
    }
  ];

  const handleFaqClick = (faq: typeof faqs[0]) => {
    setMessages(prev => [
      ...prev, 
      { type: "user", text: faq.q },
      { type: "bot", text: faq.a }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform bg-primary"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      ) : (
        <Card className="w-80 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Bot className="h-5 w-5" /> AI Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-white/20 text-white" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.type === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted text-foreground rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-4 border-t flex flex-col gap-2 bg-muted/30">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter mb-1">Frequently Asked Questions</p>
            <div className="flex flex-col gap-2 w-full">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleFaqClick(faq)}
                  className="text-left text-xs p-2 rounded-lg border bg-white hover:bg-primary hover:text-white transition-all duration-200 shadow-sm"
                >
                  {faq.q}
                </button>
              ))}
            </div>
            <div className="mt-4 text-[10px] text-center text-muted-foreground italic">
              Powered by AI Analyzer Bot
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
