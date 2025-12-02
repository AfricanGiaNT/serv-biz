"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  conversationId: string | null;
  messageCount: number;
  showForm: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  showContactForm: () => void;
  hideContactForm: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversationId = localStorage.getItem('chat_conversation_id');
    const savedMessages = localStorage.getItem('chat_messages');
    const savedMessageCount = localStorage.getItem('chat_message_count');
    
    if (savedConversationId) {
      setConversationId(savedConversationId);
    }
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
    
    if (savedMessageCount) {
      setMessageCount(parseInt(savedMessageCount, 10));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
    if (conversationId) {
      localStorage.setItem('chat_conversation_id', conversationId);
    }
    localStorage.setItem('chat_message_count', messageCount.toString());
  }, [messages, conversationId, messageCount]);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setMessageCount(0);
    setShowForm(false);
    localStorage.removeItem('chat_messages');
    localStorage.removeItem('chat_conversation_id');
    localStorage.removeItem('chat_message_count');
  }, []);

  const showContactForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const hideContactForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Check message limit
    if (messageCount >= 15) {
      const limitMessage: Message = {
        id: `limit-${Date.now()}`,
        role: 'assistant',
        content: "I've gathered enough information. Please call us directly at +27 11 234 5678 for immediate assistance. Thank you for contacting PipeWorks!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
          messageCount: messageCount + 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update conversation ID if it's a new conversation
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Show form if API indicates user wants to connect
      if (data.showForm) {
        setShowForm(true);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble right now. Please try again or call us at +27 11 234 5678.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, messageCount, isLoading]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        conversationId,
        messageCount,
        showForm,
        openChat,
        closeChat,
        sendMessage,
        clearChat,
        showContactForm,
        hideContactForm,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}


