#!/bin/bash

echo "🚀 Deploying MindRx Agent Creation Feature..."

# Check if git is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Add AI agent creation feature

- Implement complete agent management system
- Add agent CRUD API routes (/api/agents)
- Create AgentCard, AgentForm, AgentList components
- Add prominent agent creation CTAs throughout UI
- Extend Zustand store with agent state management
- Support all existing cognitive states for agents
- Multi-provider support (OpenAI, Anthropic, Google, xAI, Ollama, MindRx)
- Custom system prompts and API key management

Features:
- Create custom AI agents with unique personalities
- Configure provider, model, cognitive state, intensity
- Edit and delete existing agents
- Select agents for chat interactions
- Prominent CTAs on main page and sidebar"
else
    echo "✅ No changes to commit"
fi

echo "📤 Pushing to GitHub..."
git push origin main

echo "🌐 Deployment Instructions:"
echo "If this repository is connected to Vercel/Netlify:"
echo "  - Deployment should trigger automatically"
echo "  - Check deployment dashboard for status"
echo ""
echo "If manual deployment needed:"
echo "  - Vercel: vercel --prod"
echo "  - Netlify: netlify deploy --prod --dir=apps/web/.next"
echo ""
echo "🎉 Agent creation feature is ready for deployment!"
echo ""
echo "After deployment, test at:"
echo "- http://mindrx.tech/agents (agents page)"
echo "- http://mindrx.tech/ (main page with agent creation CTAs)"