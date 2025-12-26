import { NextRequest, NextResponse } from 'next/server';
import { agents, type Agent } from './storage';

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agentList = Array.from(agents.values());
    return NextResponse.json({ agents: agentList });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      provider,
      model,
      state,
      intensity,
      systemPrompt,
      customState,
      apiKey,
      baseUrl
    } = body;

    // Validate required fields
    if (!name || !provider || !model || !systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: name, provider, model, systemPrompt' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const now = new Date().toISOString();
    
    const agent: Agent = {
      id,
      name,
      description: description || '',
      provider,
      model,
      state: state || 'sober',
      intensity: intensity || 0.5,
      systemPrompt,
      customState,
      apiKey,
      baseUrl,
      createdAt: now,
      updatedAt: now
    };

    // Store agent
    agents.set(id, agent);

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}