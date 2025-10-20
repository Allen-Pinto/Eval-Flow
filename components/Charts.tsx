'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Chart Container Component (without ResponsiveContainer)
export function ChartContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{title}</h3>
      {children}
    </div>
  );
}

// KPI Card Component
export function KpiCard({ label, value, icon, trend }: { 
  label: string; 
  value: string; 
  icon?: string;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-blue-600 mb-2">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend.positive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend.positive ? '↗' : '↘'}</span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
}

// Daily Trends Line Chart
export function DailyTrendsChart({ data }: { data: any[] }) {
  return (
    <ChartContainer title="📈 Daily Score Trends">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#999" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line 
            type="monotone" 
            dataKey="avg_score" 
            stroke="#4285F4" 
            strokeWidth={3}
            dot={{ fill: '#4285F4', r: 4 }}
            activeDot={{ r: 6 }}
            name="Avg Score" 
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Daily Volumes Bar Chart
export function DailyVolumesChart({ data }: { data: any[] }) {
  return (
    <ChartContainer title="📊 Daily Evaluation Volumes">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#999" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Bar 
            dataKey="count" 
            fill="#4285F4" 
            radius={[8, 8, 0, 0]} 
            name="Eval Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Latency Trend Line Chart
export function LatencyTrendChart({ data }: { data: any[] }) {
  return (
    <ChartContainer title="⚡ Latency Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#999" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line 
            type="monotone" 
            dataKey="avg_latency" 
            stroke="#FBBC04" 
            strokeWidth={3}
            dot={{ fill: '#FBBC04', r: 4 }}
            activeDot={{ r: 6 }}
            name="Latency (ms)" 
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Success Rate Line Chart
export function SuccessRateChart({ data }: { data: any[] }) {
  const formattedData = data.map(d => ({
    ...d,
    success_rate: d.count > 0 ? ((d.success_count / d.count) * 100).toFixed(1) : 0
  }));

  return (
    <ChartContainer title="✅ Success Rate Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#999" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: any) => [`${value}%`, 'Success Rate']}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line 
            type="monotone" 
            dataKey="success_rate" 
            stroke="#34A853" 
            strokeWidth={3}
            dot={{ fill: '#34A853', r: 4 }}
            activeDot={{ r: 6 }}
            name="Success %" 
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Score Distribution Bar Chart
export function ScoreDistributionChart({ data }: { data: any[] }) {
  // Group scores into buckets: 0-20, 21-40, 41-60, 61-80, 81-100
  const buckets = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 },
  ];

  data.forEach(d => {
    const score = d.avg_score || 0;
    if (score <= 20) buckets[0].count++;
    else if (score <= 40) buckets[1].count++;
    else if (score <= 60) buckets[2].count++;
    else if (score <= 80) buckets[3].count++;
    else buckets[4].count++;
  });

  return (
    <ChartContainer title="📊 Score Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={buckets}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="range" stroke="#999" style={{ fontSize: '12px' }} />
          <YAxis stroke="#999" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#4285F4" 
            radius={[8, 8, 0, 0]} 
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Combined Stats Component
export function StatsGrid({ 
  totalEvals, 
  avgScore, 
  avgLatency, 
  successRate, 
  piiRedactions 
}: {
  totalEvals: number;
  avgScore: number;
  avgLatency: number;
  successRate: number;
  piiRedactions: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <KpiCard 
        label="Total Evaluations" 
        value={totalEvals.toLocaleString()} 
        icon="📋"
      />
      <KpiCard 
        label="Average Score" 
        value={`${avgScore.toFixed(1)}/100`} 
        icon="⭐"
      />
      <KpiCard 
        label="Avg Latency" 
        value={`${avgLatency}ms`} 
        icon="⚡"
      />
      <KpiCard 
        label="Success Rate" 
        value={`${successRate.toFixed(1)}%`} 
        icon="✅"
      />
      <KpiCard 
        label="PII Redacted" 
        value={piiRedactions.toLocaleString()} 
        icon="🔒"
      />
    </div>
  );
}