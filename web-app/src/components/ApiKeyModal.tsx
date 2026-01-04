import { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (key: string) => void;
}

export function ApiKeyModal({ onSubmit }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      setError('API key should start with "sk-ant-"');
      return;
    }

    onSubmit(apiKey.trim());
  };

  return (
    <div className="api-key-modal">
      <div className="modal-content">
        <div className="modal-icon">⚔️</div>
        <h2>Welcome, Adventurer!</h2>
        <p className="modal-description">
          To use the Daggerheart Companion, please enter your Anthropic API key.
          Your key is stored locally and never sent to any server except Anthropic's API.
        </p>

        <form onSubmit={handleSubmit} className="api-key-form">
          <div className="form-group">
            <label htmlFor="apiKey">Anthropic API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="sk-ant-..."
              className={error ? 'input-error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="btn btn-primary">
            Begin Your Journey
          </button>
        </form>

        <p className="modal-footer">
          Don't have an API key?{' '}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get one from Anthropic
          </a>
        </p>
      </div>
    </div>
  );
}
