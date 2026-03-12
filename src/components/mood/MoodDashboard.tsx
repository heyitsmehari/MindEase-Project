import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Calendar, BarChart3, Trash2, Table2 } from 'lucide-react';
import { getAllMoodEntries, clearAllEntries, type MoodEntry } from '../../services/storageService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const moodEmojis: Record<string, string> = {
    'Distressed': '😟',
    'Low Mood': '😔',
    'Neutral': '🙂',
    'Positive': '😊',
    'Very Positive': '🤩',
};

const moodColors: Record<string, string> = {
    'Distressed': 'text-red-600 bg-red-50',
    'Low Mood': 'text-amber-600 bg-amber-50',
    'Neutral': 'text-blue-600 bg-blue-50',
    'Positive': 'text-emerald-600 bg-emerald-50',
    'Very Positive': 'text-green-600 bg-green-50',
};

const MoodDashboard: React.FC = () => {
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEntries = async () => {
        setLoading(true);
        const data = await getAllMoodEntries();
        setEntries(data);
        setLoading(false);
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const handleClear = async () => {
        if (window.confirm('Are you sure you want to clear all mood data? This cannot be undone.')) {
            await clearAllEntries();
            setEntries([]);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-20">
                <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">No Data Yet</h3>
                <p className="text-gray-400">Start logging your mood to see charts and insights here.</p>
            </div>
        );
    }

    // Prepare data — chronological order (oldest first for charts)
    const chronological = [...entries].reverse();
    const labels = chronological.map((e) => {
        const d = new Date(e.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    // Weekly summary (last 7 entries)
    const recentEntries = entries.slice(0, 7);
    const avgMoodScore = Math.round(recentEntries.reduce((s, e) => s + e.moodScore, 0) / recentEntries.length);
    const avgSleep = (recentEntries.reduce((s, e) => s + e.sleep, 0) / recentEntries.length).toFixed(1);
    const avgStress = (recentEntries.reduce((s, e) => s + e.workloadStress, 0) / recentEntries.length).toFixed(1);
    const avgEnergy = (recentEntries.reduce((s, e) => s + e.energy, 0) / recentEntries.length).toFixed(1);

    // Dominant mood
    const moodCounts: Record<string, number> = {};
    recentEntries.forEach((e) => {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Chart common options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { font: { family: 'Inter' }, usePointStyle: true } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 } } },
        },
    };

    // 1. Mood Score Over Time
    const moodScoreData = {
        labels,
        datasets: [
            {
                label: 'Mood Score',
                data: chronological.map((e) => e.moodScore),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const moodScoreOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: { ...chartOptions.scales.y, min: 0, max: 100 },
        },
    };

    // 2. Emotion Breakdown (average of key metrics)
    const avgMetrics = {
        Energy: (chronological.reduce((s, e) => s + e.energy, 0) / chronological.length).toFixed(1),
        Sleep: (chronological.reduce((s, e) => s + e.sleep, 0) / chronological.length).toFixed(1),
        Focus: (chronological.reduce((s, e) => s + e.focus, 0) / chronological.length).toFixed(1),
        Calm: (chronological.reduce((s, e) => s + e.calm, 0) / chronological.length).toFixed(1),
        Hopeful: (chronological.reduce((s, e) => s + e.hopeful, 0) / chronological.length).toFixed(1),
        Connected: (chronological.reduce((s, e) => s + e.connected, 0) / chronological.length).toFixed(1),
        Stress: (chronological.reduce((s, e) => s + e.workloadStress, 0) / chronological.length).toFixed(1),
        Irritation: (chronological.reduce((s, e) => s + e.irritation, 0) / chronological.length).toFixed(1),
        Lonely: (chronological.reduce((s, e) => s + e.lonely, 0) / chronological.length).toFixed(1),
    };

    const emotionBreakdownData = {
        labels: Object.keys(avgMetrics),
        datasets: [
            {
                label: 'Average Score',
                data: Object.values(avgMetrics).map(Number),
                backgroundColor: [
                    'rgba(245,158,11,0.7)',  // Energy - amber
                    'rgba(99,102,241,0.7)',  // Sleep - indigo
                    'rgba(37,99,235,0.7)',   // Focus - blue
                    'rgba(236,72,153,0.7)',  // Calm - pink
                    'rgba(234,179,8,0.7)',   // Hopeful - yellow
                    'rgba(8,145,178,0.7)',   // Connected - cyan
                    'rgba(220,38,38,0.7)',   // Stress - red
                    'rgba(239,68,68,0.7)',   // Irritation - red lighter
                    'rgba(71,85,105,0.7)',   // Lonely - slate
                ],
                borderRadius: 8,
            },
        ],
    };

    const emotionBreakdownOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: { ...chartOptions.scales.y, min: 0, max: 10 },
        },
    };

    // 3. Key indicators over time (multi-line)
    const trendData = {
        labels,
        datasets: [
            {
                label: 'Energy',
                data: chronological.map((e) => e.energy),
                borderColor: '#f59e0b',
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Stress',
                data: chronological.map((e) => e.workloadStress),
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Sleep',
                data: chronological.map((e) => e.sleep),
                borderColor: '#6366f1',
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Connected',
                data: chronological.map((e) => e.connected),
                borderColor: '#0891b2',
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    const trendOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: { ...chartOptions.scales.y, min: 0, max: 10 },
        },
    };

    // Check for low mood streak
    const lowMoodStreak = entries.slice(0, 3).every(e => e.moodScore <= 50);

    return (
        <div className="space-y-8">
            {/* Low mood warning */}
            {lowMoodStreak && entries.length >= 3 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 mb-1">We noticed you've been having a tough few days</h4>
                        <p className="text-sm text-red-700">
                            Your mood has been low for the past 3 entries. Remember — it's okay to ask for help.
                            Would you like to talk to a campus counselor? Reach out anytime.
                        </p>
                    </div>
                </div>
            )}

            {/* Weekly Summary - New Pink/Rose Gradient */}
            <div className="rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 45%,#7B1D4A 100%)' }}>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Weekly Summary</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                Insights from last {recentEntries.length} logs
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-2xl transition-all border border-white/10"
                    >
                        <Trash2 size={12} />
                        Reset Data
                    </button>
                </div>

                {/* The grid of cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
                    <SummaryCard label="Avg Score" value={`${avgMoodScore}`} />
                    <SummaryCard label="Top Mood" value={`${moodEmojis[dominantMood] || ''} ${dominantMood}`} />
                    <SummaryCard label="Avg Sleep" value={`${avgSleep}`} />
                    <SummaryCard label="Avg Stress" value={`${avgStress}`} />
                    <SummaryCard label="Avg Energy" value={`${avgEnergy}`} />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood Score Over Time */}
                <ChartCard title="Mood Score Over Time" icon={<TrendingUp size={18} className="text-blue-500" />}>
                    <div className="h-64">
                        <Line data={moodScoreData} options={moodScoreOptions} />
                    </div>
                </ChartCard>

                {/* Emotion Breakdown */}
                <ChartCard title="Average Emotion Breakdown" icon={<BarChart3 size={18} className="text-purple-500" />}>
                    <div className="h-64">
                        <Bar data={emotionBreakdownData} options={emotionBreakdownOptions} />
                    </div>
                </ChartCard>

                {/* Key Indicators Trend */}
                <ChartCard title="Key Indicators Trend" icon={<TrendingUp size={18} className="text-emerald-500" />}>
                    <div className="h-64">
                        <Line data={trendData} options={trendOptions} />
                    </div>
                </ChartCard>

                {/* Mood History Table */}
                <ChartCard title="Mood History" icon={<Table2 size={18} className="text-indigo-500" />}>
                    <div className="h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-2 text-gray-500 font-semibold text-xs uppercase">Date</th>
                                    <th className="text-left py-2 px-2 text-gray-500 font-semibold text-xs uppercase">Mood</th>
                                    <th className="text-center py-2 px-2 text-gray-500 font-semibold text-xs uppercase">Score</th>
                                    <th className="text-right py-2 px-2 text-gray-500 font-semibold text-xs uppercase">Key</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.slice(0, 15).map((entry, i) => {
                                    const d = new Date(entry.date);
                                    const dateStr = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                                    // Find most notable indicator
                                    const indicators = [
                                        { label: 'Stressed', val: entry.workloadStress, type: 'neg' },
                                        { label: 'Tired', val: entry.tiredness, type: 'neg' },
                                        { label: 'Lonely', val: entry.lonely, type: 'neg' },
                                        { label: 'Energized', val: entry.energy, type: 'pos' },
                                        { label: 'Focused', val: entry.focus, type: 'pos' },
                                    ];
                                    const notable = indicators.sort((a, b) => {
                                        const aScore = a.type === 'neg' ? a.val : 10 - a.val;
                                        const bScore = b.type === 'neg' ? b.val : 10 - b.val;
                                        return bScore - aScore;
                                    })[0];

                                    return (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-2.5 px-2 text-gray-700 font-medium">{dateStr}</td>
                                            <td className="py-2.5 px-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${moodColors[entry.mood] || 'text-gray-600 bg-gray-50'}`}>
                                                    {moodEmojis[entry.mood] || ''} {entry.mood}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-2 text-center font-bold text-gray-800">{entry.moodScore}</td>
                                            <td className="py-2.5 px-2 text-right text-xs text-gray-500">{notable?.label}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
};

// Helper components
const SummaryCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
        <p className="text-2xl font-extrabold">{value}</p>
        <p className="text-xs text-white/70 mt-1">{label}</p>
    </div>
);

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    title,
    icon,
    children,
}) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h4 className="font-bold text-gray-800">{title}</h4>
        </div>
        {children}
    </div>
);

export default MoodDashboard;
