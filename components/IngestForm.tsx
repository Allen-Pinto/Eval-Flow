'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface IngestFormProps {
  onSuccess?: () => void;
}

export function IngestForm({ onSuccess }: IngestFormProps) {
  const [formData, setFormData] = useState({
    interaction_id: '',
    prompt: '',
    response: '',
    score: 85,
    latency_ms: 200,
    flags: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setMessage('Please log in to ingest evaluations');
        return;
      }

      const res = await fetch('/api/evals/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      
      if (res.ok) {
        setMessage('✅ Evaluation ingested successfully!');
        // Reset form
        setFormData({
          interaction_id: '',
          prompt: '',
          response: '',
          score: 85,
          latency_ms: 200,
          flags: []
        });
        // Call success callback
        if (onSuccess) onSuccess();
      } else {
        setMessage(`❌ Error: ${result.error || 'Failed to ingest evaluation'}`);
      }
    } catch (error) {
      setMessage('❌ Network error - please try again');
      console.error('Ingest error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFlag = () => {
    const flag = prompt('Enter a flag:');
    if (flag) {
      setFormData({
        ...formData,
        flags: [...formData.flags, flag]
      });
    }
  };

  const removeFlag = (index: number) => {
    setFormData({
      ...formData,
      flags: formData.flags.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Interaction ID */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Interaction ID *
        </label>
        <input
          type="text"
          placeholder="e.g., chat_001, session_abc123"
          value={formData.interaction_id}
          onChange={(e) => setFormData({...formData, interaction_id: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Prompt */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Prompt *
        </label>
        <textarea
          placeholder="Enter the user prompt or question..."
          value={formData.prompt}
          onChange={(e) => setFormData({...formData, prompt: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          rows={4}
          required
        />
      </div>

      {/* Response */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          AI Response *
        </label>
        <textarea
          placeholder="Enter the AI model's response..."
          value={formData.response}
          onChange={(e) => setFormData({...formData, response: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          rows={4}
          required
        />
      </div>

      {/* Score & Latency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Score: {formData.score}/100
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.score}
            onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Latency (ms) *
          </label>
          <input
            type="number"
            placeholder="Response time in milliseconds"
            value={formData.latency_ms}
            onChange={(e) => setFormData({...formData, latency_ms: parseInt(e.target.value) || 0})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>
      </div>

      {/* Flags */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Flags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.flags.map((flag, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {flag}
              <button
                type="button"
                onClick={() => removeFlag(index)}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={addFlag}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition"
        >
          + Add Flag
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Ingesting Evaluation...
          </span>
        ) : (
          '📥 Ingest Evaluation'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        * Required fields
      </p>
    </form>
  );
}