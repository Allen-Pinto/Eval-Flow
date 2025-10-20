'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Config {
  run_policy: 'always' | 'sampled';
  sample_rate_pct: number;
  obfuscate_pii: boolean;
  max_eval_per_day: number;
}

export function ConfigPanel() {
  const [config, setConfig] = useState<Config>({
    run_policy: 'always',
    sample_rate_pct: 100,
    obfuscate_pii: true,
    max_eval_per_day: 10000,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setConfig({
          run_policy: data.run_policy,
          sample_rate_pct: data.sample_rate_pct,
          obfuscate_pii: data.obfuscate_pii,
          max_eval_per_day: data.max_eval_per_day,
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveConfig() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_configs').upsert({
        user_id: user.id,
        ...config,
        updated_at: new Date().toISOString(),
      });

      alert('Configuration saved successfully! ✅');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration ❌');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Evaluation Configuration</h2>
        <p className="text-gray-600">Customize how your AI evaluations are processed and stored</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        {/* Run Policy */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Run Policy
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Choose whether to evaluate all interactions or use sampling
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setConfig({ ...config, run_policy: 'always' })}
              className={`px-6 py-4 rounded-lg border-2 font-medium transition-all ${
                config.run_policy === 'always'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="font-semibold">Always Run</div>
              <div className="text-xs mt-1 opacity-75">Evaluate every interaction</div>
            </button>
            <button
              onClick={() => setConfig({ ...config, run_policy: 'sampled' })}
              className={`px-6 py-4 rounded-lg border-2 font-medium transition-all ${
                config.run_policy === 'sampled'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🎲</div>
              <div className="font-semibold">Sampled</div>
              <div className="text-xs mt-1 opacity-75">Random sampling</div>
            </button>
          </div>
        </div>

        {/* Sample Rate - Only show if sampled */}
        {config.run_policy === 'sampled' && (
          <div className="space-y-3 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <label className="block text-sm font-semibold text-gray-700">
              Sample Rate: <span className="text-blue-600">{config.sample_rate_pct}%</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Percentage of interactions to evaluate
            </p>
            <input
              type="range"
              min="1"
              max="100"
              value={config.sample_rate_pct}
              onChange={(e) => setConfig({ ...config, sample_rate_pct: parseInt(e.target.value) })}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4285F4 0%, #4285F4 ${config.sample_rate_pct}%, #E8F0FE ${config.sample_rate_pct}%, #E8F0FE 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* PII Obfuscation */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Privacy & Security
          </label>
          <div
            onClick={() => setConfig({ ...config, obfuscate_pii: !config.obfuscate_pii })}
            className={`flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer transition-all ${
              config.obfuscate_pii
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <div className="font-semibold text-gray-900">Obfuscate PII</div>
                <div className="text-sm text-gray-600 mt-1">
                  Automatically mask emails, phone numbers, and SSNs
                </div>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all ${
                config.obfuscate_pii ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  config.obfuscate_pii ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </div>
          </div>
        </div>

        {/* Max Evaluations Per Day */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Daily Evaluation Limit
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Maximum number of evaluations to process per day
          </p>
          <div className="relative">
            <input
              type="number"
              value={config.max_eval_per_day}
              onChange={(e) => setConfig({ ...config, max_eval_per_day: parseInt(e.target.value) || 0 })}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              min="1"
              max="100000"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              / day
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {[1000, 5000, 10000, 20000].map((value) => (
              <button
                key={value}
                onClick={() => setConfig({ ...config, max_eval_per_day: value })}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-all"
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={saveConfig}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Saving Configuration...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>💾</span>
                Save Configuration
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-2xl mb-3">💡</div>
          <h3 className="font-semibold text-gray-900 mb-2">Sampling Tips</h3>
          <p className="text-sm text-gray-600">
            Use sampling to reduce costs while maintaining statistical significance. 
            10-20% sampling is often sufficient for trend analysis.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-2xl mb-3">🛡️</div>
          <h3 className="font-semibold text-gray-900 mb-2">PII Protection</h3>
          <p className="text-sm text-gray-600">
            PII obfuscation helps you comply with privacy regulations like GDPR and CCPA 
            by masking sensitive information.
          </p>
        </div>
      </div>
    </div>
  );
}