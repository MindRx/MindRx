'use client';

import { useState, useEffect } from 'react';
import { Agent, ProviderName } from '@/lib/types';
import { PROVIDERS } from '@/lib/types';
import { useStore } from '@/stores/store';

interface AgentFormProps {
  agent?: Agent | null;
  onSave: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function AgentForm({ agent, onSave, onCancel }: AgentFormProps) {
  const { states } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider: 'mindrx' as ProviderName,
    model: '',
    state: 'sober',
    intensity: 0.7,
    systemPrompt: '',
    apiKey: '',
    baseUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with agent data or defaults
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        provider: agent.provider,
        model: agent.model,
        state: agent.state,
        intensity: agent.intensity,
        systemPrompt: agent.systemPrompt,
        apiKey: agent.apiKey || '',
        baseUrl: agent.baseUrl || ''
      });
    } else {
      // Set default model based on provider
      const defaultProvider = PROVIDERS.find(p => p.value === 'mindrx');
      setFormData(prev => ({
        ...prev,
        model: defaultProvider?.defaultModel || ''
      }));
    }
  }, [agent]);

  // Update model when provider changes
  const handleProviderChange = (provider: ProviderName) => {
    const providerConfig = PROVIDERS.find(p => p.value === provider);
    setFormData(prev => ({
      ...prev,
      provider,
      model: providerConfig?.defaultModel || '',
      apiKey: provider === 'mindrx' ? '' : prev.apiKey // Clear API key for mindrx
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = 'System prompt is required';
    }

    const providerConfig = PROVIDERS.find(p => p.value === formData.provider);
    if (providerConfig?.requiresApiKey && !formData.apiKey.trim()) {
      newErrors.apiKey = 'API key is required for this provider';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const providerConfig = PROVIDERS.find(p => p.value === formData.provider);
    
    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      provider: formData.provider,
      model: formData.model.trim(),
      state: formData.state,
      intensity: formData.intensity,
      systemPrompt: formData.systemPrompt.trim(),
      apiKey: providerConfig?.requiresApiKey ? formData.apiKey.trim() : undefined,
      baseUrl: formData.provider === 'ollama' ? formData.baseUrl.trim() : undefined
    });
  };

  const providerConfig = PROVIDERS.find(p => p.value === formData.provider);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`w-full px-3 py-2 bg-white/5 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder="Enter agent name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Describe what this agent does"
        />
      </div>

      {/* Provider */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Provider *
        </label>
        <select
          value={formData.provider}
          onChange={(e) => handleProviderChange(e.target.value as ProviderName)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {PROVIDERS.map(provider => (
            <option key={provider.value} value={provider.value}>
              {provider.label} — {provider.description}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Model *
        </label>
        <input
          type="text"
          value={formData.model}
          onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
          className={`w-full px-3 py-2 bg-white/5 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.model ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder={providerConfig?.placeholder || 'Enter model name'}
        />
        {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model}</p>}
      </div>

      {/* API Key (if required) */}
      {providerConfig?.requiresApiKey && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            API Key *
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            className={`w-full px-3 py-2 bg-white/5 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.apiKey ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="Enter API key"
          />
          {errors.apiKey && <p className="mt-1 text-xs text-red-400">{errors.apiKey}</p>}
        </div>
      )}

      {/* Base URL (for Ollama) */}
      {formData.provider === 'ollama' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Base URL
          </label>
          <input
            type="url"
            value={formData.baseUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="http://localhost:11434"
          />
        </div>
      )}

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Cognitive State
        </label>
        <select
          value={formData.state}
          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {states.map(state => (
            <option key={state.name} value={state.name}>
              {state.name} — {state.description}
            </option>
          ))}
        </select>
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          State Intensity: {Math.round(formData.intensity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={formData.intensity}
          onChange={(e) => setFormData(prev => ({ ...prev, intensity: parseFloat(e.target.value) }))}
          className="w-full"
        />
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          System Prompt *
        </label>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
          rows={4}
          className={`w-full px-3 py-2 bg-white/5 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
            errors.systemPrompt ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder="Enter the system prompt for this agent..."
        />
        {errors.systemPrompt && <p className="mt-1 text-xs text-red-400">{errors.systemPrompt}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-purple-600 border border-purple-500 rounded-md text-white hover:bg-purple-700 transition-colors"
        >
          {agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
}