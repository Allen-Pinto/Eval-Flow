export interface DailyMetric {
  date: string;
  count: number;
  avg_score: number;
  avg_latency: number;
  success_count: number;
}

export async function calculateMetrics(
  evaluations: any[],
  period: '7d' | '30d' = '7d'
) {
  if (evaluations.length === 0) {
    return {
      total_evals: 0,
      avg_score: 0,
      avg_latency_ms: 0,
      success_rate_pct: 0,
      pii_redactions_total: 0,
      trend_daily: [],
    };
  }

  const total = evaluations.length;
  const scores = evaluations.map((e) => e.score).filter((s) => s !== null);
  const latencies = evaluations.map((e) => e.latency_ms);
  const successCount = scores.filter((s) => s >= 70).length;
  const piiTotal = evaluations.reduce((sum, e) => sum + (e.pii_tokens_redacted || 0), 0);

  const grouped = new Map<string, DailyMetric>();

  evaluations.forEach((e) => {
    const date = new Date(e.created_at).toISOString().split('T')[0];
    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        count: 0,
        avg_score: 0,
        avg_latency: 0,
        success_count: 0,
      });
    }

    const metric = grouped.get(date)!;
    metric.count++;
    metric.avg_score += e.score || 0;
    metric.avg_latency += e.latency_ms;
    if ((e.score || 0) >= 70) metric.success_count++;
  });

  const trend = Array.from(grouped.values())
    .map((m) => ({
      ...m,
      avg_score: Math.round((m.avg_score / m.count) * 10) / 10,
      avg_latency: Math.round(m.avg_latency / m.count),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    total_evals: total,
    avg_score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    avg_latency_ms: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
    success_rate_pct: Math.round((successCount / total) * 1000) / 10,
    pii_redactions_total: piiTotal,
    trend_daily: trend,
  };
}
