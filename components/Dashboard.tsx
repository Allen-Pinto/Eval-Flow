'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  StatsGrid, 
  DailyTrendsChart, 
  DailyVolumesChart,
  LatencyTrendChart,
  SuccessRateChart 
} from './Charts';
import { IngestForm } from './IngestForm';

interface Metrics {
  total_evals: number;
  avg_score: number;
  avg_latency_ms: number;
  success_rate_pct: number;
  pii_redactions_total: number;
  trend_daily: any[];
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);
  const [showIngestForm, setShowIngestForm] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('No session found:', sessionError);
        return;
      }

      const res = await fetch(`/api/metrics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metrics: ${res.status}`);
      }
      
      const metrics = await res.json();
      setMetrics(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleIngestSuccess = () => {
    // Refresh metrics after successful ingest
    fetchMetrics();
    setShowIngestForm(false);
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">𛱩</div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
          <p className="text-gray-600">Monitor your AI evaluation performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowIngestForm(!showIngestForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {showIngestForm ? '📋 View Dashboard' : '➕ Ingest Evaluation'}
          </button>
          <button
            onClick={() => setPeriod('7d')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              period === '7d' 
                ? 'bg-[#4285F4] text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#4285F4]'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              period === '30d' 
                ? 'bg-[#4285F4] text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#4285F4]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Ingest Form or Dashboard Content */}
      {showIngestForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ingest New Evaluation</h3>
            <p className="text-gray-600">Add a new AI evaluation to your dashboard</p>
          </div>
          <IngestForm onSuccess={handleIngestSuccess} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <StatsGrid
            totalEvals={metrics.total_evals}
            avgScore={metrics.avg_score}
            avgLatency={metrics.avg_latency_ms}
            successRate={metrics.success_rate_pct}
            piiRedactions={metrics.pii_redactions_total}
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DailyTrendsChart data={metrics.trend_daily} />
            <DailyVolumesChart data={metrics.trend_daily} />
            <LatencyTrendChart data={metrics.trend_daily} />
            <SuccessRateChart data={metrics.trend_daily} />
          </div>

          {/* Empty State for No Data */}
          {metrics.total_evals === 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center mt-8">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Data Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by ingesting your first evaluation to see your dashboard come to life!
              </p>
              <button
                onClick={() => setShowIngestForm(true)}
                className="px-8 py-3 bg-[#4285F4] text-white rounded-lg font-semibold hover:bg-[#1967D2] transition shadow-md"
              >
                ➕ Ingest Your First Evaluation
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}