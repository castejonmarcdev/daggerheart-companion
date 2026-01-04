import { useChat } from '../../hooks/useChat';

export function Header() {
  const { clearMessages, messages } = useChat();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <span className="header-icon">⚔️</span>
          <h1>Daggerheart Companion</h1>
        </div>
        <div className="header-actions">
          {messages.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={clearMessages}
              title="Clear chat history"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
