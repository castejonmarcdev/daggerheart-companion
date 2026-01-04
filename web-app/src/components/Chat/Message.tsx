import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '../../types/chat';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`message message-${message.role}`}>
      {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
        <div className="tool-calls">
          {message.toolCalls.map((tool) => (
            <span key={tool.id} className="tool-badge">
              📚 {formatToolName(tool.toolName)}
            </span>
          ))}
        </div>
      )}

      <div className="message-content">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              // Custom table styling
              table: ({ children }) => (
                <div className="table-wrapper">
                  <table>{children}</table>
                </div>
              ),
              // Links open in new tab
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

function formatToolName(name: string): string {
  const toolNames: Record<string, string> = {
    search_rules: 'Searching rules',
    lookup_class: 'Looking up class',
    lookup_ancestry: 'Looking up ancestry',
    lookup_community: 'Looking up community',
    lookup_equipment: 'Looking up equipment',
    lookup_mechanic: 'Looking up mechanic',
    get_domain_info: 'Getting domain info',
    list_options: 'Listing options',
  };

  return toolNames[name] || name;
}
