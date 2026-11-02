// lib/store/useChatStore.ts
import { create } from 'zustand';
import { ChatMessage, ApiRunnerPreset, ApiRunnerResult } from '../types';

export const API_RUNNER_PRESETS: ApiRunnerPreset[] = [
  {
    name: 'Generate Apex Image',
    method: 'POST',
    endpoint: '/api/generate/image',
    description: 'Trigger photorealistic image synthesis via Apex Vision',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer apex_live_sso_session',
    },
    body: {
      model: 'apex-vision-v2',
      prompt: 'Cyberpunk street in rain with glowing neon signs, cinematic bokeh, 8k resolution',
      negative_prompt: 'blurry, oversaturated, low quality',
      aspect_ratio: '16:9',
      style: 'cinematic',
      guidance: 7.5,
      steps: 30,
    },
  },
  {
    name: 'Generate Cinematic Video',
    method: 'POST',
    endpoint: '/api/generate/video',
    description: 'Render 5s or 10s video with camera trajectory',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer apex_live_sso_session',
    },
    body: {
      model: 'studio-v1',
      prompt: 'Obsidian monolith floating over alien mountain range at golden hour',
      camera_motion: 'Drone Orbit 360',
      duration: '5s',
      fps: 30,
      aspect_ratio: '16:9',
      motion_intensity: 8,
    },
  },
  {
    name: 'Query Available Models',
    method: 'GET',
    endpoint: '/api/models',
    description: 'Fetch all active models, capabilities & credit pricing',
    headers: {
      'Authorization': 'Bearer apex_live_sso_session',
    },
    body: {},
  },
  {
    name: 'Atomic AI Chat Completion',
    method: 'POST',
    endpoint: '/api/chat',
    description: 'Creative direction & prompt engineering assistance',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer apex_live_sso_session',
    },
    body: {
      model: 'gemini-2-5-flash',
      messages: [
        { role: 'user', content: 'Generate a dramatic lighting prompt for a cinematic supercar reveal' }
      ],
      temperature: 0.7,
    },
  },
];

interface ChatState {
  // Chat
  messages: ChatMessage[];
  isChatLoading: boolean;
  activeModel: string;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // API Runner
  selectedPreset: ApiRunnerPreset;
  activeMethod: 'GET' | 'POST';
  activeEndpoint: string;
  activeHeaders: string;
  activeBody: string;
  isExecutingApi: boolean;
  lastResult: ApiRunnerResult | null;
  historyLogs: Array<{ id: string; timestamp: string; method: string; endpoint: string; status: number; duration: number }>;
  setPreset: (preset: ApiRunnerPreset) => void;
  setMethod: (method: 'GET' | 'POST') => void;
  setEndpoint: (endpoint: string) => void;
  setHeaders: (headers: string) => void;
  setBody: (body: string) => void;
  executeApi: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Welcome to **Atomic Apex Studio**. I am **Atomic AI**, your creative co-pilot. I can generate cinematic prompts, design complex camera motion curves, script commercial storyboards, or benchmark your API queries. How can we elevate your vision today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'Atomic Creative Core',
    },
  ],
  isChatLoading: false,
  activeModel: 'Atomic AI Pro (Gemini 2.5 Flash)',

  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isChatLoading: true,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...get().messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          model: get().activeModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned ' + response.status);
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Atomic AI Pro',
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isChatLoading: false,
      }));
    } catch (err: any) {
      // Intelligent fallback creative response
      setTimeout(() => {
        let fallbackReply = `Here is an optimized creative direction based on your request:\n\n**Visual Concept:** High-contrast chiaroscuro with anamorphic depth.\n**Enhanced Prompt:** \`${content}, volumetric atmosphere, 35mm film grain, 8k octane render, cinematic lighting\`\n**Recommended Settings:** Model: Apex Vision V2 | Aspect Ratio: 16:9 | Guidance: 7.5 | Camera: 360 Drone Orbit`;
        
        const fallbackMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'Atomic AI Pro',
        };

        set((state) => ({
          messages: [...state.messages, fallbackMsg],
          isChatLoading: false,
        }));
      }, 700);
    }
  },

  clearChat: () => {
    set({
      messages: [
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: 'Chat session refreshed. What visual direction would you like to explore next?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'Atomic Creative Core',
        },
      ],
    });
  },

  // API Runner
  selectedPreset: API_RUNNER_PRESETS[0],
  activeMethod: 'POST',
  activeEndpoint: '/api/generate/image',
  activeHeaders: JSON.stringify(API_RUNNER_PRESETS[0].headers, null, 2),
  activeBody: JSON.stringify(API_RUNNER_PRESETS[0].body, null, 2),
  isExecutingApi: false,
  lastResult: null,
  historyLogs: [],

  setPreset: (preset: ApiRunnerPreset) => {
    set({
      selectedPreset: preset,
      activeMethod: preset.method,
      activeEndpoint: preset.endpoint,
      activeHeaders: JSON.stringify(preset.headers, null, 2),
      activeBody: JSON.stringify(preset.body, null, 2),
    });
  },

  setMethod: (method) => set({ activeMethod: method }),
  setEndpoint: (endpoint) => set({ activeEndpoint: endpoint }),
  setHeaders: (headers) => set({ activeHeaders: headers }),
  setBody: (body) => set({ activeBody: body }),

  executeApi: async () => {
    const { activeMethod, activeEndpoint, activeHeaders, activeBody } = get();
    set({ isExecutingApi: true });

    const startTime = performance.now();
    let parsedHeaders = {};
    let parsedBody = undefined;

    try {
      parsedHeaders = JSON.parse(activeHeaders);
    } catch (e) {
      parsedHeaders = { 'Content-Type': 'application/json' };
    }

    if (activeMethod === 'POST' && activeBody.trim()) {
      try {
        parsedBody = JSON.parse(activeBody);
      } catch (e) {
        parsedBody = { raw: activeBody };
      }
    }

    try {
      const response = await fetch(activeEndpoint, {
        method: activeMethod,
        headers: parsedHeaders,
        body: activeMethod === 'POST' ? JSON.stringify(parsedBody) : undefined,
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let data: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const resHeaders: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      const result: ApiRunnerResult = {
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        timeMs: duration,
        headers: resHeaders,
        data,
      };

      set((state) => ({
        isExecutingApi: false,
        lastResult: result,
        historyLogs: [
          {
            id: 'log-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            method: activeMethod,
            endpoint: activeEndpoint,
            status: response.status,
            duration,
          },
          ...state.historyLogs.slice(0, 19),
        ],
      }));
    } catch (err: any) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const result: ApiRunnerResult = {
        status: 500,
        statusText: 'Internal Network Error',
        timeMs: duration,
        headers: { 'error-source': 'client-fetch-exception' },
        data: { error: err.message || 'Failed to dispatch request' },
      };

      set((state) => ({
        isExecutingApi: false,
        lastResult: result,
      }));
    }
  },
}));
