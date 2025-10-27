"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/simple-card";
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Activity,
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  totalTails: {
    last24h: number;
    last7d: number;
    last30d: number;
    allTime: number;
  };
  uniqueTailers: {
    last24h: number;
    last7d: number;
    last30d: number;
    allTime: number;
  };
  averageTailsPerBet: number;
  tailWindowConversionRate: number;
  topSportsbooks: Array<{ sportsbook: string; count: number }>;
  topLeagues: Array<{ league: string; count: number }>;
  timeToFirst10Tails: number;
  betPerformance: Array<{
    betId: string;
    title: string;
    views: number;
    inWindowTails: number;
    outOfWindowTails: number;
    conversionRate: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, challengeId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (challengeId) params.append("challengeId", challengeId);
      if (timeRange) params.append("timeRange", timeRange);
      
      const response = await fetch(`/api/analytics?${params.toString()}`);
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeRangeData = () => {
    if (!analytics) return { tails: 0, tailers: 0 };
    
    switch (timeRange) {
      case "24h":
        return { tails: analytics.totalTails.last24h, tailers: analytics.uniqueTailers.last24h };
      case "7d":
        return { tails: analytics.totalTails.last7d, tailers: analytics.uniqueTailers.last7d };
      case "30d":
        return { tails: analytics.totalTails.last30d, tailers: analytics.uniqueTailers.last30d };
      case "all":
        return { tails: analytics.totalTails.allTime, tailers: analytics.uniqueTailers.allTime };
      default:
        return { tails: 0, tailers: 0 };
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--accent-cyan)]"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const currentData = getTimeRangeData();

  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        {/* Header */}
        <div className="bg-black/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.2' }}>Analytics Dashboard</h1>
              <p className="text-[#B0B0B0] text-sm" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>Track your betting challenge performance</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg p-2 border border-white/10">
                <Calendar className="h-4 w-4 text-[#808080]" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-transparent text-white border-none outline-none cursor-pointer"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              
              <button 
                onClick={fetchAnalytics}
                className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#00D9FF]/10 transition-all duration-200 cursor-pointer border border-white/10"
              >
                <RefreshCw className="h-4 w-4 text-[#808080]" />
              </button>
              
              <button className="w-10 h-10 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#00D9FF]/10 transition-all duration-200 cursor-pointer border border-white/10">
                <Download className="h-4 w-4 text-[#808080]" />
              </button>
              
              <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-white/10">
                <div className="w-8 h-8 bg-[#00D9FF] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">U</span>
                </div>
                <span className="text-white font-medium text-sm hidden sm:inline">Uxisrat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:p-8 w-full mt-16">
          <div className="max-w-7xl mx-auto pb-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-16 mt-12">
            <Card className="card animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent-cyan)] rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">{formatNumber(currentData.tails)}</p>
                      <p className="text-[var(--text-secondary)] text-sm mt-1">Total Tails</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[var(--status-success)]">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent-blue)] rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">{formatNumber(currentData.tailers)}</p>
                      <p className="text-[var(--text-secondary)] text-sm mt-1">Unique Tailers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[var(--status-success)]">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent-purple)] rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">{analytics?.averageTailsPerBet.toFixed(1) || 0}</p>
                      <p className="text-[var(--text-secondary)] text-sm mt-1">Avg Per Bet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[var(--status-error)]">
                      <TrendingUp className="h-4 w-4 rotate-180" />
                      <span className="text-sm font-medium">-3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent-teal)] rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">{((analytics?.tailWindowConversionRate || 0) * 100).toFixed(1)}%</p>
                      <p className="text-[var(--text-secondary)] text-sm mt-1">Conversion Rate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[var(--status-success)]">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spacing between metric cards and detailed analytics */}
          <div className="h-6"></div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Sportsbooks */}
            <Card className="card animate-slide-in">
              <CardHeader>
                <CardTitle className="text-[var(--text-primary)] flex items-center gap-3 text-heading-3">
                  <Trophy className="h-5 w-5 text-[var(--accent-cyan)]" />
                  Top Sportsbooks
                </CardTitle>
                <CardDescription className="text-[var(--text-secondary)]">
                  Most popular sportsbooks by tail count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.topSportsbooks.map((sportsbook, index) => (
                    <div key={sportsbook.sportsbook} className="flex items-center justify-between py-3 px-4 bg-[var(--bg-surface)] rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-all duration-200 border border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--accent-cyan)] rounded-[var(--radius-md)] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] font-semibold text-base">{sportsbook.sportsbook}</p>
                          <p className="text-[var(--text-secondary)] text-xs mt-0.5">{sportsbook.count} tails</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden border border-[rgba(255,255,255,0.05)]">
                          <div 
                            className="bg-[var(--accent-cyan)] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,217,255,0.5)]" 
                            style={{ width: `${(sportsbook.count / (analytics?.topSportsbooks[0]?.count || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[var(--text-tertiary)] text-xs">{Math.round((sportsbook.count / (analytics?.topSportsbooks[0]?.count || 1)) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Leagues */}
            <Card className="card animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-[var(--text-primary)] flex items-center gap-3 text-heading-3">
                  <Activity className="h-5 w-5 text-[var(--accent-blue)]" />
                  Top Leagues
                </CardTitle>
                <CardDescription className="text-[var(--text-secondary)]">
                  Most engaged leagues by tail count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.topLeagues.map((league, index) => (
                    <div key={league.league} className="flex items-center justify-between py-3 px-4 bg-[var(--bg-surface)] rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-all duration-200 border border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--accent-blue)] rounded-[var(--radius-md)] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] font-semibold text-base">{league.league}</p>
                          <p className="text-[var(--text-secondary)] text-xs mt-0.5">{league.count} tails</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden border border-[rgba(255,255,255,0.05)]">
                          <div 
                            className="bg-[var(--accent-blue)] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            style={{ width: `${(league.count / (analytics?.topLeagues[0]?.count || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[var(--text-tertiary)] text-xs">{Math.round((league.count / (analytics?.topLeagues[0]?.count || 1)) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spacing between detailed analytics and bet performance */}
          <div className="h-6"></div>

          {/* Bet Performance */}
          <Card className="card mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--text-primary)] flex items-center gap-3 text-heading-3">
                    <BarChart3 className="h-5 w-5 text-[var(--accent-purple)]" />
                    Bet Performance
                  </CardTitle>
                  <CardDescription className="text-[var(--text-secondary)]">
                    Individual bet performance metrics
                  </CardDescription>
                </div>
                <button className="text-[var(--accent-cyan)] text-sm font-medium hover:underline">
                  View all
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.05)]">
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Bet ID</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Title</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Date</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Views</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">In Window</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Out Window</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Conversion</th>
                      <th className="text-left py-3 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.betPerformance.map((bet) => (
                      <tr key={bet.betId} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[var(--bg-surface)]/30 transition-colors">
                        <td className="py-3 px-4 text-[var(--text-primary)] font-medium">{bet.betId.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-[var(--text-primary)]">{bet.title}</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)] text-sm">Apr 14</td>
                        <td className="py-3 px-4 text-[var(--text-primary)]">{bet.views}</td>
                        <td className="py-3 px-4 text-[var(--status-success)]">{bet.inWindowTails}</td>
                        <td className="py-3 px-4 text-[var(--status-error)]">{bet.outOfWindowTails}</td>
                        <td className="py-3 px-4 text-[var(--accent-teal)]">{(bet.conversionRate * 100).toFixed(1)}%</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${bet.conversionRate > 0.3 ? 'badge-success' : bet.conversionRate > 0.15 ? 'badge-warning' : 'badge-error'}`}>
                            {bet.conversionRate > 0.3 ? 'High' : bet.conversionRate > 0.15 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Spacing between bet performance and time range comparison */}
          <div className="h-6"></div>

          {/* Time Range Comparison */}
          <Card className="card animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-[var(--text-primary)] flex items-center gap-3 text-heading-3">
                <Clock className="h-5 w-5 text-[var(--accent-teal)]" />
                Time Range Comparison
              </CardTitle>
              <CardDescription className="text-[var(--text-secondary)]">
                Compare performance across different time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface)] transition-all duration-200">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">Last 24 Hours</p>
                  <p className="text-2xl font-semibold text-[var(--accent-cyan)]">{formatNumber(analytics?.totalTails.last24h || 0)}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{analytics?.uniqueTailers.last24h || 0} tailers</p>
                </div>
                
                <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface)] transition-all duration-200">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">Last 7 Days</p>
                  <p className="text-2xl font-semibold text-[var(--accent-blue)]">{formatNumber(analytics?.totalTails.last7d || 0)}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{analytics?.uniqueTailers.last7d || 0} tailers</p>
                </div>
                
                <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface)] transition-all duration-200">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">Last 30 Days</p>
                  <p className="text-2xl font-semibold text-[var(--accent-purple)]">{formatNumber(analytics?.totalTails.last30d || 0)}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{analytics?.uniqueTailers.last30d || 0} tailers</p>
                </div>
                
                <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-surface)] transition-all duration-200">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">All Time</p>
                  <p className="text-2xl font-semibold text-[var(--accent-teal)]">{formatNumber(analytics?.totalTails.allTime || 0)}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{analytics?.uniqueTailers.allTime || 0} tailers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
