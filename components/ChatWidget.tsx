"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/lib/chat-context';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatContactForm } from '@/components/ChatContactForm';

export function ChatWidget() {
  const { messages, isOpen, isLoading, messageCount, showForm, openChat, closeChat, sendMessage, hideContactForm } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Show message limit warning
  const showLimitWarning = messageCount >= 13;

  return (
    <>
      {/* Floating Button - Desktop Only (mobile uses BottomNav) */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="hidden md:flex fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messages.filter((m) => m.role === 'user').length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:top-auto md:w-96 md:h-[600px] z-50 flex flex-col bg-white shadow-2xl rounded-t-2xl md:rounded-2xl md:border border-gray-200">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-2xl md:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">PipeWorks Support</h3>
                <p className="text-xs opacity-90">
                  {isLoading ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="hover:bg-primary/80 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">Hello! 👋</p>
                <p className="text-sm mt-1">
                  How can we help you with your plumbing needs today?
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                {showLimitWarning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <p className="font-medium">⚠️ Message Limit</p>
                    <p className="mt-1">
                      You&apos;ve sent {messageCount} messages. After 15 messages, we&apos;ll provide our phone number for direct assistance.
                    </p>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Form Modal */}
          {showForm && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <ChatContactForm
                onSuccess={async () => {
                  hideContactForm();
                  // Add success message to chat
                  const successMessage = {
                    id: `success-${Date.now()}`,
                    role: 'assistant' as const,
                    content: "Thank you! ✅ We've received your information. David will contact you within 30 minutes. You can continue chatting if you have any other questions!",
                    timestamp: new Date(),
                  };
                  // Add success message to the messages array
                  // We need to access setMessages, but it's not exposed. 
                  // Instead, we'll send a system message via the chat API
                  // For now, just close the form - the user can see the success in the form itself
                }}
                onCancel={hideContactForm}
              />
            </div>
          )}

          {/* Input */}
          {!showForm && (
            <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || messageCount >= 15}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || messageCount >= 15}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            {messageCount >= 15 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please call us at +27 11 234 5678 for further assistance.
              </p>
            )}
          </form>
          )}
        </div>
      )}
    </>
  );
}

