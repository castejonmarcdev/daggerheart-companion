interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: '📖',
    title: 'Learn the Basics',
    prompt: 'What are the key differences between Daggerheart and D&D 5e?',
  },
  {
    icon: '🎭',
    title: 'Explore Classes',
    prompt: 'Tell me about the Bard class and its subclasses',
  },
  {
    icon: '🎲',
    title: 'Understand Mechanics',
    prompt: 'How do the Duality Dice work? What are Hope and Fear?',
  },
  {
    icon: '⚔️',
    title: 'Combat Rules',
    prompt: 'How does combat work in Daggerheart? How is damage calculated?',
  },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h2>Welcome to the Daggerheart Companion</h2>
        <p>
          Your guide to the world of Daggerheart! Ask me anything about rules,
          classes, ancestries, mechanics, or get help creating your character.
        </p>

        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() => onSuggestionClick(suggestion.prompt)}
            >
              <span className="suggestion-icon">{suggestion.icon}</span>
              <span className="suggestion-title">{suggestion.title}</span>
              <span className="suggestion-prompt">{suggestion.prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
