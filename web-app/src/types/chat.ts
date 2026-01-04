export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  result?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  apiKey: string | null;
}
