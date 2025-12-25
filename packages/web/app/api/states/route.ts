import { NextResponse } from 'next/server';
import { StateEngine } from '@mindrx/core';

export async function GET() {
  try {
    const engine = new StateEngine();
    const stateNames = engine.listNames();
    const states = stateNames.map((name) => {
      const state = engine.get(name);
      if (!state) return null;
      return {
        name: state.name,
        description: state.description,
        parameters: state.parameters,
        behavior: state.behavior,
      };
    }).filter(Boolean);
    return NextResponse.json({ states });
  } catch {
    return NextResponse.json({ error: 'Failed to load states' }, { status: 500 });
  }
}
