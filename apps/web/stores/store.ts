import { create } from 'zustand';
import type { Message, ProviderName, ConnectionStatus, StateInfo, Agent } from '@/lib/types';
import { DEFAULT_PROFILES } from '@/lib/types';

interface Store {
  // State
  profile: string;
  intensity: number;
  states: StateInfo[];
  provider: ProviderName;
  model: string | null;
  apiKeys: Record<string, string>;  // Session-only API keys
  messages: Message[];
  isStreaming: boolean;
  streamingText: string;
  connectionStatus: ConnectionStatus;
  showApiKeyModal: boolean;
  showOllamaModal: boolean;
  pendingProvider: ProviderName | null;
  
  // Agent management
  agents: Agent[];
  selectedAgent: Agent | null;
  showAgentModal: boolean;

  // Actions
  setProfile: (profile: string) => void;
  setIntensity: (intensity: number) => void;
  setStates: (states: StateInfo[]) => void;
  setProvider: (provider: ProviderName) => void;
  setModel: (model: string | null) => void;
  setApiKey: (provider: string, key: string) => void;
  getApiKey: (provider: string) => string | undefined;
  addMessage: (message: Message) => void;
  updateLastAssistantMessage: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (text: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  clearMessages: () => void;
  clearStreamingText: () => void;
  setShowApiKeyModal: (show: boolean) => void;
  setShowOllamaModal: (show: boolean) => void;
  setPendingProvider: (provider: ProviderName | null) => void;
  
  // Agent actions
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setShowAgentModal: (show: boolean) => void;
}

export const useStore = create<Store>((set, get) => ({
  profile: 'sober',
  intensity: 0.7,
  states: DEFAULT_PROFILES,
  provider: 'mindrx',
  model: null,
  apiKeys: {},
  messages: [],
  isStreaming: false,
  streamingText: '',
  connectionStatus: 'idle',
  showApiKeyModal: false,
  showOllamaModal: false,
  pendingProvider: null,
  
  // Agent state
  agents: [],
  selectedAgent: null,
  showAgentModal: false,

  setProfile: (profile) => set({ profile }),
  setIntensity: (intensity) => set({ intensity }),
  setStates: (states) => set({ states }),
  setProvider: (provider) => set({ provider }),
  setModel: (model) => set({ model }),
  setApiKey: (provider, key) => set((state) => ({
    apiKeys: { ...state.apiKeys, [provider]: key }
  })),
  getApiKey: (provider) => get().apiKeys[provider],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].type === 'assistant') {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      return { messages };
    }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingText: (text) => set({ streamingText: text }),
  appendStreamingText: (text) => set((state) => ({ streamingText: state.streamingText + text })),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  clearMessages: () => set({ messages: [] }),
  clearStreamingText: () => set({ streamingText: '' }),
  setShowApiKeyModal: (showApiKeyModal) => set({ showApiKeyModal }),
  setShowOllamaModal: (showOllamaModal) => set({ showOllamaModal }),
  setPendingProvider: (pendingProvider) => set({ pendingProvider }),
  
  // Agent actions
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    )
  })),
  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter(agent => agent.id !== id),
    selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent
  })),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setShowAgentModal: (showAgentModal) => set({ showAgentModal }),
}));
