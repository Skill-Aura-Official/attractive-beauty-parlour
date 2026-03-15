import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Minimize2, User, Calendar, Sparkles, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { CONTACT_INFO } from "@/lib/constants";
import glamGenieAvatar from "@/assets/glam-genie-avatar.png";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "💇 Services offered?",
  "📅 Book appointment",
  "📍 Location & hours",
  "💍 Bridal packages",
  "🎉 Current offers",
];

const QUICK_FULL: Record<string, string> = {
  "💇 Services offered?": "What services do you offer?",
  "📅 Book appointment": "How can I book an appointment?",
  "📍 Location & hours": "Where are you located and what are your business hours?",
  "💍 Bridal packages": "Tell me about bridal packages",
  "🎉 Current offers": "What special offers do you have right now?",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey there! 💫 I'm **Glam Genie**, your personal beauty guide at Attractive Beauty Parlour.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === allMessages.length + 1) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      upsertAssistant("Sorry, I'm having trouble responding right now. Please try again or contact us directly!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating buttons - show call/whatsapp + chatbot */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
          >
            {/* Quick action buttons - visible on mobile */}
            <div className="flex flex-col gap-2 lg:hidden">
              <motion.a
                href={CONTACT_INFO.phoneLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-elegant border border-border/50"
                aria-label="Call now"
              >
                <Phone size={20} />
              </motion.a>
              <motion.a
                href={CONTACT_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-accent-foreground shadow-elegant border border-border/50"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </motion.a>
            </div>

            {/* Chat button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full shadow-elegant flex items-center justify-center overflow-hidden border-2 border-primary animate-pulse-gold"
              aria-label="Open chat"
            >
              <img src={glamGenieAvatar} alt="Glam Genie" className="w-full h-full object-cover" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 sm:right-6 sm:left-auto sm:w-[400px] z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            style={{ maxHeight: "min(620px, calc(100vh - 2rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-gold-dark">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={glamGenieAvatar} alt="Glam Genie" className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/30" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold font-display text-primary-foreground">Glam Genie 💫</p>
                  <p className="text-[11px] text-primary-foreground/70 font-body">Online • Your Beauty Guide</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={16} className="text-primary-foreground" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} className="text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin"
              style={{ minHeight: "220px" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 border border-primary/40 shadow-sm">
                      <img src={glamGenieAvatar} alt="Glam Genie" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm border border-border/30"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:m-0 [&_ul]:mb-1.5 [&_ol]:m-0 [&_ol]:mb-1.5 [&_li]:text-foreground [&_strong]:text-foreground [&_a]:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1 border border-border/30">
                      <User size={14} className="text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5 items-start"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-primary/40">
                    <img src={glamGenieAvatar} alt="Glam Genie" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 border border-border/30">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-body">Quick questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(QUICK_FULL[q] || q)}
                      disabled={isLoading}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-card text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200 disabled:opacity-50 font-body"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book appointment CTA */}
            <div className="px-4 pb-3">
              <a
                href={CONTACT_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all duration-200 font-body uppercase tracking-wider"
              >
                <Calendar size={14} />
                Book Appointment via WhatsApp
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-border bg-card">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 text-sm h-10 bg-muted/50 border-border/50 rounded-xl focus-visible:ring-primary/50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-xl"
              >
                <Send size={16} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
