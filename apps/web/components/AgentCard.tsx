'use client';

import { Agent } from '@/lib/types';
import { PROVIDERS } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}

export function AgentCard({ agent, onSelect, onEdit, onDelete, isSelected }: AgentCardProps) {
  const provider = PROVIDERS.find(p => p.value === agent.provider);
  
  return (
    <div 
      className={`
        relative p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected 
          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }
      `}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{agent.name}</h3>
          <p className="text-sm text-gray-400 truncate mt-1">{agent.description}</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit agent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete agent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-2">
        {/* Provider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Provider:</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              agent.provider === 'openai' ? 'bg-green-500' :
              agent.provider === 'anthropic' ? 'bg-orange-500' :
              agent.provider === 'google' ? 'bg-blue-500' :
              agent.provider === 'xai' ? 'bg-red-500' :
              agent.provider === 'ollama' ? 'bg-gray-500' :
              'bg-purple-500'
            }`} />
            <span className="text-xs text-white">{provider?.label || agent.provider}</span>
          </div>
        </div>

        {/* Model */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Model:</span>
          <span className="text-xs text-white font-mono">{agent.model}</span>
        </div>

        {/* State */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">State:</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium state-${agent.state}`}>
            {agent.state}
          </span>
          <span className="text-xs text-gray-400">({Math.round(agent.intensity * 100)}%)</span>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}