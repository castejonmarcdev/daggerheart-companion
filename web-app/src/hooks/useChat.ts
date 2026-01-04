import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../types/chat';
import { sendMessage } from '../api/claude';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChat = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      apiKey: null,

      setApiKey: (key: string) => {
        set({ apiKey: key });
      },

      sendMessage: async (content: string) => {
        const { apiKey, messages } = get();

        if (!apiKey) {
          set({ error: 'API key is required' });
          return;
        }

        // Create user message
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content,
          timestamp: new Date(),
        };

        set({
          messages: [...messages, userMessage],
          isLoading: true,
          error: null,
        });

        try {
          const result = await sendMessage(
            apiKey,
            [...messages, userMessage]
          );

          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.content,
            timestamp: new Date(),
            toolCalls: result.toolCalls,
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'daggerheart-chat',
      partialize: (state) => ({ apiKey: state.apiKey }),
    }
  )
);
