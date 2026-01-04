import { Link } from 'react-router-dom';
import { Fragment } from 'react';

// Game terms that should be linked
const linkableTerms: Record<string, string> = {
  // Mechanics
  'hope': '/mechanics/hope',
  'fear': '/mechanics/fear',
  'stress': '/mechanics/stress',
  'evasion': '/mechanics/evasion',
  'hit points': '/mechanics/hit-points',
  'hp': '/mechanics/hit-points',
  'armor score': '/mechanics/armor-score',
  'damage threshold': '/mechanics/damage-thresholds',
  'damage thresholds': '/mechanics/damage-thresholds',
  'major threshold': '/mechanics/damage-thresholds',
  'severe threshold': '/mechanics/damage-thresholds',
  'critical success': '/mechanics/critical-success',
  'advantage': '/mechanics/advantage-disadvantage',
  'disadvantage': '/mechanics/advantage-disadvantage',
  'short rest': '/mechanics/short-rest',
  'long rest': '/mechanics/long-rest',
  'action roll': '/mechanics/action-roll',
  'duality dice': '/mechanics/duality-dice',
  'duality die': '/mechanics/duality-dice',
  'hope die': '/mechanics/duality-dice',
  'fear die': '/mechanics/duality-dice',
  'attack': '/mechanics/attack',
  'death': '/mechanics/death',
  'conditions': '/mechanics/conditions',
  'proficiency': '/mechanics/proficiency',
  'difficulty': '/mechanics/difficulty',
  'domain cards': '/mechanics/domain-cards',
  'domain card': '/mechanics/domain-cards',
  'traits': '/mechanics/traits',
  'trait': '/mechanics/traits',
  'tier': '/mechanics/tier',
  'tag team roll': '/mechanics/tag-team',
  'tag team': '/mechanics/tag-team',
  'experiences': '/mechanics/experiences',
  'experience': '/mechanics/experiences',
  'reaction roll': '/mechanics/reaction-roll',
  'reaction rolls': '/mechanics/reaction-roll',
  'armor slots': '/mechanics/armor-slots',
  'armor slot': '/mechanics/armor-slots',
  'ranges': '/mechanics/ranges',
  'leveling up': '/mechanics/leveling-up',
  'multiclassing': '/mechanics/multiclassing',
  'vulnerable': '/mechanics/conditions',
  'hidden': '/mechanics/conditions',
  'restrained': '/mechanics/conditions',

  // Domains
  'arcana': '/domains/arcana',
  'blade': '/domains/blade',
  'bone': '/domains/bone',
  'codex': '/domains/codex',
  'grace': '/domains/grace',
  'midnight': '/domains/midnight',
  'sage': '/domains/sage',
  'splendor': '/domains/splendor',
  'valor': '/domains/valor',

  // Classes
  'bard': '/classes/bard',
  'druid': '/classes/druid',
  'guardian': '/classes/guardian',
  'ranger': '/classes/ranger',
  'rogue': '/classes/rogue',
  'seraph': '/classes/seraph',
  'sorcerer': '/classes/sorcerer',
  'warrior': '/classes/warrior',
  'wizard': '/classes/wizard',
};

// Build a regex pattern for all terms (case insensitive, word boundaries)
const termPattern = new RegExp(
  `\\b(${Object.keys(linkableTerms)
    .sort((a, b) => b.length - a.length) // Longer terms first
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})\\b`,
  'gi'
);

interface LinkedContentProps {
  content: string;
}

// Process markdown formatting (bold, italic)
function processMarkdown(text: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  // Match **bold**, *italic*, or ***bold italic***
  const markdownPattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = markdownPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];
    if (match[2]) {
      // ***bold italic***
      result.push(<strong key={match.index}><em>{match[2]}</em></strong>);
    } else if (match[3]) {
      // **bold**
      result.push(<strong key={match.index}>{match[3]}</strong>);
    } else if (match[4]) {
      // *italic*
      result.push(<em key={match.index}>{match[4]}</em>);
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

export function LinkedContent({ content }: LinkedContentProps) {
  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim());

  return (
    <div className="linked-content">
      {paragraphs.map((paragraph, pIndex) => {
        // Check if it's a list item
        const isBullet = paragraph.trim().startsWith('- ');
        const text = isBullet ? paragraph.trim().slice(2) : paragraph;

        if (isBullet) {
          return (
            <p key={pIndex} className="bullet-item">
              <LinkedParagraph text={text} />
            </p>
          );
        }

        return (
          <p key={pIndex}>
            <LinkedParagraph text={paragraph} />
          </p>
        );
      })}
    </div>
  );
}

function LinkedParagraph({ text }: { text: string }) {
  // First, process markdown formatting
  const markdownParts = processMarkdown(text);

  // Then process each part for term links
  const result = markdownParts.flatMap((part, partIndex) => {
    if (typeof part !== 'string') {
      // It's already a JSX element (bold/italic), process its children for links
      return <Fragment key={`md-${partIndex}`}>{part}</Fragment>;
    }

    // Process string parts for term links
    const linkedParts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex state
    termPattern.lastIndex = 0;

    while ((match = termPattern.exec(part)) !== null) {
      const term = match[0];
      const termLower = term.toLowerCase();
      const path = linkableTerms[termLower];

      if (path) {
        // Add text before the match
        if (match.index > lastIndex) {
          linkedParts.push(part.slice(lastIndex, match.index));
        }

        // Add the linked term
        linkedParts.push(
          <Link key={`${partIndex}-${match.index}-${term}`} to={path} className="term-link">
            {term}
          </Link>
        );

        lastIndex = match.index + term.length;
      }
    }

    // Add remaining text
    if (lastIndex < part.length) {
      linkedParts.push(part.slice(lastIndex));
    }

    // If no matches, just return the original string
    if (linkedParts.length === 0) {
      return part;
    }

    return linkedParts;
  });

  return (
    <>
      {result.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
