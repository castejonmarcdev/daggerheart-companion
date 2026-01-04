import { Message, ToolCallInfo } from '../types/chat';
import { executeToolCall } from './tools';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are a helpful Daggerheart TTRPG companion assistant. You help players and GMs learn and understand the Daggerheart rules system published by Darrington Press (Critical Role).

When answering questions:
1. Use the available tools to look up accurate rule information from the Daggerheart SRD
2. Explain concepts clearly, especially for users coming from D&D 5e
3. Highlight key differences from D&D when relevant
4. Provide practical examples when helpful

Key Daggerheart concepts to emphasize:
- **Duality Dice**: Two d12s (Hope and Fear) replace the d20. Which die is higher matters!
- **No Initiative**: The narrative spotlight moves organically, no turn order
- **Hope & Fear**: Player resources (Hope tokens) and GM resources (Fear)
- **Stress & HP**: Stress is mental/emotional strain (6 slots), HP is physical injury
- **Action Results**: Success/Failure combined with Hope/Fear creates 4+ outcomes
- **Critical Success**: Matching dice = auto-success + bonus + Hope + clear Stress

When comparing to D&D 5e:
- Classes are similar archetypes but work differently
- No ability scores - just 6 Traits with modifiers
- Heritage = Ancestry + Community (like Race + Background)
- Domains replace spell schools (9 domains with card decks)
- Armor works via damage thresholds and Armor Slots, not AC

Always be encouraging and help users understand this new system!`;

const TOOLS = [
  {
    name: 'search_rules',
    description: 'Search Daggerheart rules by keyword or topic. Use this to find specific rules, mechanics, or game concepts.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'The search term or topic to look up',
        },
        category: {
          type: 'string',
          enum: ['mechanics', 'classes', 'ancestries', 'communities', 'equipment', 'combat', 'gm', 'all'],
          description: 'Optional category to narrow search',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'lookup_class',
    description: 'Get detailed information about a Daggerheart class including features, domains, and subclasses.',
    input_schema: {
      type: 'object' as const,
      properties: {
        className: {
          type: 'string',
          enum: ['Bard', 'Druid', 'Guardian', 'Ranger', 'Rogue', 'Seraph', 'Sorcerer', 'Warrior', 'Wizard'],
          description: 'The name of the class to look up',
        },
        includeSubclasses: {
          type: 'boolean',
          description: 'Whether to include detailed subclass information',
        },
      },
      required: ['className'],
    },
  },
  {
    name: 'lookup_ancestry',
    description: 'Get detailed information about a Daggerheart ancestry including physical description and ancestry features.',
    input_schema: {
      type: 'object' as const,
      properties: {
        ancestryName: {
          type: 'string',
          enum: ['Clank', 'Drakona', 'Dwarf', 'Elf', 'Faerie', 'Faun', 'Firbolg', 'Fungril', 'Galapa', 'Giant', 'Goblin', 'Halfling', 'Human', 'Infernis', 'Katari', 'Orc', 'Ribbet', 'Simiah', 'Mixed Ancestry'],
          description: 'The name of the ancestry to look up',
        },
      },
      required: ['ancestryName'],
    },
  },
  {
    name: 'lookup_community',
    description: 'Get detailed information about a Daggerheart community including description and community feature.',
    input_schema: {
      type: 'object' as const,
      properties: {
        communityName: {
          type: 'string',
          enum: ['Highborne', 'Loreborne', 'Orderborne', 'Ridgeborne', 'Seaborne', 'Slyborne', 'Underborne', 'Wanderborne', 'Wildborne'],
          description: 'The name of the community to look up',
        },
      },
      required: ['communityName'],
    },
  },
  {
    name: 'lookup_equipment',
    description: 'Look up Daggerheart weapons or armor.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['weapon', 'armor'],
          description: 'Type of equipment to look up',
        },
        tier: {
          type: 'number',
          description: 'Equipment tier (1-4)',
        },
        name: {
          type: 'string',
          description: 'Specific equipment name to look up',
        },
        category: {
          type: 'string',
          enum: ['primary', 'secondary'],
          description: 'For weapons: filter by category',
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'lookup_mechanic',
    description: 'Get detailed explanation of a Daggerheart core mechanic.',
    input_schema: {
      type: 'object' as const,
      properties: {
        mechanic: {
          type: 'string',
          enum: [
            'duality_dice', 'action_roll', 'hope', 'fear',
            'evasion', 'stress', 'hit_points', 'damage_thresholds',
            'attack', 'critical_success', 'advantage', 'disadvantage',
            'conditions', 'short_rest', 'long_rest', 'death',
            'leveling_up', 'multiclassing', 'ranges', 'armor_slots',
          ],
          description: 'The mechanic to look up',
        },
      },
      required: ['mechanic'],
    },
  },
  {
    name: 'get_domain_info',
    description: 'Get information about Daggerheart domains including which classes have access to them.',
    input_schema: {
      type: 'object' as const,
      properties: {
        domainName: {
          type: 'string',
          enum: ['Arcana', 'Blade', 'Bone', 'Codex', 'Grace', 'Midnight', 'Sage', 'Splendor', 'Valor'],
          description: 'Specific domain to look up. If omitted, returns all domains.',
        },
      },
      required: [],
    },
  },
  {
    name: 'list_options',
    description: 'List all available options for a category (classes, ancestries, communities, or domains).',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['classes', 'ancestries', 'communities', 'domains'],
          description: 'The category to list options for',
        },
      },
      required: ['category'],
    },
  },
];

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: ContentBlock[];
  stop_reason: string;
}

export async function sendMessage(
  apiKey: string,
  messages: Message[]
): Promise<{ content: string; toolCalls: ToolCallInfo[] }> {
  const anthropicMessages: AnthropicMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const toolCalls: ToolCallInfo[] = [];
  let finalContent = '';

  // Initial request
  let response = await makeRequest(apiKey, anthropicMessages);

  // Handle tool use loop
  while (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter(
      (block): block is ContentBlock & { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } =>
        block.type === 'tool_use'
    );

    // Execute each tool call
    const toolResults: ContentBlock[] = [];
    for (const toolUse of toolUseBlocks) {
      const result = await executeToolCall(toolUse.name, toolUse.input);

      toolCalls.push({
        id: toolUse.id,
        toolName: toolUse.name,
        input: toolUse.input,
        result,
      });

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: result,
      });
    }

    // Continue conversation with tool results
    anthropicMessages.push({
      role: 'assistant',
      content: response.content,
    });

    anthropicMessages.push({
      role: 'user',
      content: toolResults,
    });

    response = await makeRequest(apiKey, anthropicMessages);
  }

  // Extract final text content
  for (const block of response.content) {
    if (block.type === 'text' && block.text) {
      finalContent += block.text;
    }
  }

  return { content: finalContent, toolCalls };
}

async function makeRequest(
  apiKey: string,
  messages: AnthropicMessage[]
): Promise<AnthropicResponse> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${error}`);
  }

  return response.json();
}
