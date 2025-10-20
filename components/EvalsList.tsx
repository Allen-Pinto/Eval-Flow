'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface EvaluationRecord {
  id: string;
  interaction_id: string;
  score: number;
  latency_ms: number;
  flags: string[];
  created_at: string;
  prompt: string;
}

export function EvalsList() {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 50;

  useEffect(() => {
    fetchEvaluations();
  }, [page]);

  async function fetchEvaluations() {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count } = await supabase
        .from('evaluations')
        .select('id, interaction_id, score, latency_ms, flags, created_at, prompt', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      setEvaluations(data || []);
      setTotal(count || 0);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-8 text-gray-600">Loading evaluations...</div>;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Interaction ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Latency</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Flags</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((record) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">{record.interaction_id}</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.score >= 80
                          ? 'bg-green-100 text-green-800'
                          : record.score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{record.latency_ms}ms</td>
                  <td className="px-6 py-3 text-sm">
                    {record.flags.length > 0 ? (
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {record.flags.length} flag{record.flags.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <Link
                      href={`/dashboard/evals/${record.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            Previous
          </button>
        )}
        <span className="px-4 py-2 text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <button onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            Next
          </button>
        )}
      </div>
    </div>
  );
}