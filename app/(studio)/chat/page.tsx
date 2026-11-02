'use client';

import React, { useState } from 'react';
import {
  MessageSquareCode,
  Send,
  Zap,
  Sparkles,
  Code2,
  Play,
  RotateCcw,
  Copy,
  Check,
  Clock,
  Terminal,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useChatStore, API_RUNNER_PRESETS } from '@/lib/store/useChatStore';

const SUGGESTED_QUESTIONS = [
  'Create a cinematic sci-fi prompt for Apex Vision with 35mm anamorphic lighting',
  'Write a 3-shot commercial storyboard for luxury streetwear in Tokyo rain',
  'What are the optimal guidance scale and camera motion for Swift V1?',
  'Explain how to structure an API request to generate 10s video programmatically',
];

export default function ChatAndApiRunnerPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'runner'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // API Runner state
  const [runnerMethod, setRunnerMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [runnerUrl, setRunnerUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [runnerHeaders, setRunnerHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [runnerBody, setRunnerBody] = useState('{\n  "prompt": "Cinematic obsidian monolith",\n  "model": "apex-vision"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [runResult, setRunResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: Record<string, string>;
    data: any;
    truncated?: boolean;
    error?: string;
  } | null>(null);

  const {
    messages,
    isChatLoading,
    activeModel,
    sendMessage,
    clearChat,
  } = useChatStore();

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleExecuteRunner = async () => {
    setIsExecuting(true);
    setRunResult(null);

    let parsedHeaders = {};
    let parsedBody = undefined;

    try {
      parsedHeaders = JSON.parse(runnerHeaders);
    } catch {
      parsedHeaders = { 'Content-Type': 'application/json' };
    }

    if (runnerMethod !== 'GET' && runnerBody.trim()) {
      try {
        parsedBody = JSON.parse(runnerBody);
      } catch {
        parsedBody = runnerBody;
      }
    }

    try {
      const res = await fetch('/api/runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: runnerMethod,
          url: runnerUrl,
          headers: parsedHeaders,
          body: parsedBody,
        }),
      });

      const data = await res.json();
      setRunResult(data);
    } catch (err: any) {
      setRunResult({
        status: 500,
        statusText: 'Client Fetch Error',
        durationMs: 0,
        headers: {},
        data: { error: err.message },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === 'curl') {
      return `curl -X ${runnerMethod} "${runnerUrl}" \\
  -H "Content-Type: application/json" \\
  ${runnerMethod !== 'GET' ? `-d '${runnerBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'` : ''}`;
    } else if (selectedLanguage === 'js') {
      return `const response = await fetch("${runnerUrl}", {
  method: "${runnerMethod}",
  headers: ${runnerHeaders},
  ${runnerMethod !== 'GET' ? `body: JSON.stringify(${runnerBody})` : ''}
});
const data = await response.json();
console.log(data);`;
    } else {
      return `import requests

url = "${runnerUrl}"
headers = ${runnerHeaders}
${runnerMethod !== 'GET' ? `payload = ${runnerBody}
response = requests.${runnerMethod.toLowerCase()}(url, json=payload, headers=headers)` : `response = requests.get(url, headers=headers)`}

print(response.status_code)
print(response.json())`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
              <MessageSquareCode size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Atomic Chat & API Runner
            </h1>
            <span className="rounded-full bg-apex-lime/15 px-2.5 py-0.5 text-[10px] font-bold text-apex-lime uppercase tracking-wider">
              Creative Co-Pilot & Sandboxed Runner
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Consult Atomic AI on creative lighting, prompt equations, and scene setups, or benchmark APIs through the secure server-side runner.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-studio-900 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            Atomic AI Chat
          </button>
          <button
            onClick={() => setActiveTab('runner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'runner'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 size={13} />
            Secure API Runner
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* TAB 1: ATOMIC AI CHAT */
        <div className="rounded-3xl border border-white/10 bg-studio-900/80 shadow-2xl flex flex-col h-[75vh] overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-studio-950/80">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-apex-lime to-emerald-400 text-black shadow-glow-lime">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Atomic AI Creative Director
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Engine: {activeModel}
                </span>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Reset Session
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 text-white border border-white/10'
                      : 'bg-apex-lime text-black shadow-glow-subtle'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-studio-800 text-white border border-white/10 rounded-tr-none'
                      : 'bg-studio-950/90 text-zinc-200 border border-white/10 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <span className="text-[10px] text-zinc-500 block text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-3 max-w-xl">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-apex-lime text-black shadow-glow-subtle animate-pulse">
                  <Sparkles size={14} />
                </div>
                <div className="rounded-2xl bg-studio-950 p-4 border border-white/10 flex items-center gap-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-apex-lime animate-ping" />
                  Atomic AI is engineering your visual direction...
                </div>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-6 py-2 bg-studio-950/40 border-t border-white/5 flex gap-2 overflow-x-auto">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(q);
                  sendMessage(q);
                }}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-studio-900 border border-white/5 text-[11px] text-zinc-400 hover:text-white hover:border-apex-lime/30 transition-all flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendChat}
            className="p-4 bg-studio-950 border-t border-white/10 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Atomic AI for prompt expansion, camera motion equations, or creative feedback..."
              className="flex-1 rounded-xl border border-white/10 bg-studio-900 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputMessage.trim()}
              className="glow-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send size={14} />
              Send
            </button>
          </form>
        </div>
      ) : (
        /* TAB 2: SECURE API RUNNER */
        <div className="space-y-6">
          {/* Security Notice */}
          <div className="p-3 rounded-2xl bg-studio-900 border border-apex-cyan/30 flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-apex-cyan" />
              <strong>SSRF Guard Active:</strong> Only HTTP/HTTPS allowed. Localhost, private networks, and AWS metadata are blocked. 15s timeout / 1MB response cap.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Request Builder (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl border border-white/10 bg-studio-900 space-y-4 shadow-glass-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={14} className="text-apex-lime" /> HTTP Request Configuration
                  </h3>
                </div>

                {/* Method & URL Input */}
                <div className="flex gap-2">
                  <select
                    value={runnerMethod}
                    onChange={(e) => setRunnerMethod(e.target.value as any)}
                    className="rounded-xl border border-white/10 bg-studio-950 px-3 py-2 text-xs font-bold text-apex-lime focus:outline-none"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={runnerUrl}
                    onChange={(e) => setRunnerUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="flex-1 rounded-xl border border-white/10 bg-studio-950 px-3 py-2 text-xs font-mono text-zinc-200 focus:border-apex-lime/60 focus:outline-none"
                  />
                  <button
                    onClick={handleExecuteRunner}
                    disabled={isExecuting}
                    className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Play size={13} className="fill-current" />
                    {isExecuting ? 'Sending...' : 'Send'}
                  </button>
                </div>

                {/* Headers */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Headers (JSON)
                  </label>
                  <textarea
                    value={runnerHeaders}
                    onChange={(e) => setRunnerHeaders(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-studio-950 p-2.5 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-apex-lime/50 resize-none"
                  />
                </div>

                {/* Request Body */}
                {runnerMethod !== 'GET' && (
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={runnerBody}
                      onChange={(e) => setRunnerBody(e.target.value)}
                      rows={6}
                      className="w-full rounded-xl border border-white/10 bg-studio-950 p-2.5 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-apex-lime/50 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Code Export Generator */}
              <div className="p-4 rounded-2xl border border-white/10 bg-studio-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs">
                    {(['curl', 'js', 'python'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-apex-lime/10 text-apex-lime border border-apex-lime/30 font-bold'
                            : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getCodeSnippet());
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                  >
                    {copiedCode ? <Check size={12} className="text-apex-lime" /> : <Copy size={12} />}
                    {copiedCode ? 'Copied' : 'Copy Snippet'}
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-studio-950 overflow-x-auto text-[11px] font-mono text-zinc-300 border border-white/5">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>
            </div>

            {/* Right: Response Inspector (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl border border-white/10 bg-studio-900 space-y-4 shadow-glass-card min-h-[400px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    Response Inspector
                  </h3>

                  {runResult && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono ${
                          runResult.status >= 200 && runResult.status < 300
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {runResult.status} {runResult.statusText}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                        <Clock size={11} /> {runResult.durationMs}ms
                      </span>
                    </div>
                  )}
                </div>

                {isExecuting ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 space-y-2">
                    <div className="h-6 w-6 rounded-full border-2 border-apex-lime border-t-transparent animate-spin" />
                    <span className="text-xs font-mono">Dispatching request through secure proxy...</span>
                  </div>
                ) : runResult ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] text-zinc-400">
                      <span>Body Output</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(runResult.data, null, 2));
                          setCopiedResponse(true);
                          setTimeout(() => setCopiedResponse(false), 2000);
                        }}
                        className="flex items-center gap-1 text-apex-lime hover:underline"
                      >
                        {copiedResponse ? <Check size={11} /> : <Copy size={11} />}
                        {copiedResponse ? 'Copied' : 'Copy JSON'}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-studio-950 overflow-x-auto text-[11px] font-mono text-zinc-200 border border-white/5 max-h-[380px] leading-relaxed">
                      <code>{JSON.stringify(runResult.data, null, 2)}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 space-y-2">
                    <Terminal size={32} className="text-zinc-700" />
                    <p className="text-xs text-zinc-400">No request executed yet.</p>
                    <p className="text-[11px] text-zinc-600">
                      Enter any external public API or internal endpoint to execute through the secure runner.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
