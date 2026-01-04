import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';

export function ChatContainer() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat();

  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={sendMessage} />
      ) : (
        <MessageList messages={messages} isLoading={isLoading} />
      )}

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-dismiss">×</button>
        </div>
      )}

      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
