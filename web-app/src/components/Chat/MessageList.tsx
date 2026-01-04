import { useEffect, useRef } from 'react';
import { Message as MessageType } from '../../types/chat';
import { Message } from './Message';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="message message-assistant">
          <div className="message-content">
            <div className="loading-indicator">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
