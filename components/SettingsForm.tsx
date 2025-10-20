'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Config {
  id: string;
  run_policy: 'always' | 'sampled';
  sample_rate_pct: number;
  obfuscate_pii: boolean;
  max_eval_per_day: number;
}

export function SettingsForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetchConfig();
    getSession();
  }, []);

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  }

  async function fetchConfig() {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const res = await fetch('/api/config', {
        headers: { Authorization: `Bearer ${session.session.access_token}` },
      });

      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error('Failed to save config');

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const copyToken = () => {
    if (session?.access_token) {
      navigator.clipboard.writeText(session.access_token);
      alert('Token copied to clipboard!');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading settings...</div>;
  if (!config) return <div className="text-center py-8 text-red-600">Failed to load settings</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Evaluation Settings */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Evaluation Settings</h2>
        <div className="space-y-8">
          {/* Run Policy */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">Run Policy</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={config.run_policy === 'always'}
                  onChange={() => setConfig({ ...config, run_policy: 'always' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Always evaluate</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={config.run_policy === 'sampled'}
                  onChange={() => setConfig({ ...config, run_policy: 'sampled' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Sample-based</span>
              </label>
            </div>
          </div>

          {/* Sample Rate */}
          <div>
            <label htmlFor="sample_rate" className="block text-sm font-semibold text-gray-900 mb-4">
              Sample Rate: {config.sample_rate_pct}%
            </label>
            <input
              id="sample_rate"
              type="range"
              min="0"
              max="100"
              value={config.sample_rate_pct}
              onChange={(e) => setConfig({ ...config, sample_rate_pct: parseInt(e.target.value) })}
              disabled={config.run_policy === 'always'}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <p className="text-xs text-gray-600 mt-2">Only applies when using sample-based policy</p>
          </div>

          {/* PII Masking */}
          <div>
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={config.obfuscate_pii}
                onChange={(e) => setConfig({ ...config, obfuscate_pii: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">Obfuscate PII</span>
                <p className="text-xs text-gray-600">Automatically mask emails, phone numbers, and sensitive data</p>
              </div>
            </label>
          </div>

          {/* Max Evals */}
          <div>
            <label htmlFor="max_eval" className="block text-sm font-semibold text-gray-900 mb-3">
              Max Evaluations Per Day
            </label>
            <input
              id="max_eval"
              type="number"
              min="1"
              value={config.max_eval_per_day}
              onChange={(e) => setConfig({ ...config, max_eval_per_day: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm font-medium ${
                message.includes('success')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* API Token Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">API Access</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Use this token for programmatic access to the EvalFlow API. Keep it secure!
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Your API Token</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showToken ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={copyToken}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
            
            {showToken ? (
              <code className="text-sm bg-gray-900 text-green-400 p-3 rounded block overflow-x-auto">
                {session?.access_token || 'No token available'}
              </code>
            ) : (
              <div className="bg-gray-900 text-gray-400 p-3 rounded text-sm">
                ••••••••••••••••••••••••••••••••
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Example Usage</h3>
            <pre className="text-xs bg-blue-900 text-blue-100 p-3 rounded overflow-x-auto">
{`curl -X POST http://localhost:3000/api/evals/ingest \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "interaction_id": "chat_001",
    "prompt": "What is AI?",
    "response": "Artificial Intelligence is...",
    "score": 85,
    "latency_ms": 250
  }'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}