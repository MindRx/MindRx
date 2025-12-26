'use client';

import { useState, useEffect } from 'react';
import { Agent } from '@/lib/types';
import { AgentCard } from './AgentCard';
import { AgentForm } from './AgentForm';
import { useStore } from '@/stores/store';

export function AgentList() {
  const { 
    agents, 
    selectedAgent, 
    setAgents, 
    addAgent, 
    updateAgent, 
    removeAgent, 
    setSelectedAgent,
    setShowAgentModal 
  } = useStore();

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load agents on mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/agents');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load agents');
      }
      
      setAgents(data.agents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setShowAgentModal(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowAgentModal(true);
  };

  const handleSaveAgent = async (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      let response;
      
      if (editingAgent) {
        // Update existing agent
        response = await fetch(`/api/agents/${editingAgent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentData)
        });
        
        if (response.ok) {
          const data = await response.json();
          updateAgent(editingAgent.id, data.agent);
        }
      } else {
        // Create new agent
        response = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentData)
        });
        
        if (response.ok) {
          const data = await response.json();
          addAgent(data.agent);
        }
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save agent');
      }
      
      setShowAgentModal(false);
      setEditingAgent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent');
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete agent');
      }
      
      removeAgent(agent.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading agents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={loadAgents}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Agents</h1>
          <p className="text-gray-400 mt-1">Create and manage custom AI agents</p>
        </div>
        <button
          onClick={handleCreateAgent}
          className="px-4 py-2 bg-purple-600 border border-purple-500 rounded-md text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Agent
        </button>
      </div>

      {/* Selected Agent Bar */}
      {selectedAgent && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-white font-medium">Selected: {selectedAgent.name}</span>
              <span className="text-gray-400 text-sm">({selectedAgent.provider} • {selectedAgent.model})</span>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      {agents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No agents created yet</div>
          <button
            onClick={handleCreateAgent}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onSelect={() => handleSelectAgent(agent)}
              onEdit={() => handleEditAgent(agent)}
              onDelete={() => handleDeleteAgent(agent)}
            />
          ))}
        </div>
      )}

      {/* Agent Form Modal */}
      {useStore.getState().showAgentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingAgent ? 'Edit Agent' : 'Create New Agent'}
            </h2>
            
            <AgentForm
              agent={editingAgent}
              onSave={handleSaveAgent}
              onCancel={() => {
                setShowAgentModal(false);
                setEditingAgent(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}