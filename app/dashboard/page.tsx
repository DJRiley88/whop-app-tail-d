"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { 
  Users, 
  Clock, 
  Flame,
  Medal,
  Star,
  User,
  TrendingUp,
  Award,
  Activity,
  BarChart3,
  Zap,
  Target,
  Trophy
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  handle: string;
  rank: number;
  wins: number;
  matches: number;
  points: number;
  victories: number;
  bestWin: string;
  spentTime: number;
  rewards: {
    trophy: number;
    diamond: number;
  };
  avatar: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export default function DashboardPage() {
  const [summaryStats, setSummaryStats] = useState({
    totalRegistered: 1277,
    totalParticipated: 255,
    timeRemaining: {
      days: 12,
      hours: 6,
      minutes: 42
    }
  });

  const [topPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Blademir Malina Tori",
      handle: "@popy_bob",
      rank: 1,
      wins: 443,
      matches: 778,
      points: 44872,
      victories: 43,
      bestWin: "1:05",
      spentTime: 778,
      rewards: {
        trophy: 32421,
        diamond: 17500
      },
      avatar: "👤",
      trend: 'up',
      change: 12.5
    },
    {
      id: "2", 
      name: "Robert Fox",
      handle: "@robert_fox",
      rank: 2,
      wins: 440,
      matches: 887,
      points: 42515,
      victories: 43,
      bestWin: "1:03",
      spentTime: 887,
      rewards: {
        trophy: 31001,
        diamond: 17421
      },
      avatar: "🎮",
      trend: 'up',
      change: 8.2
    },
    {
      id: "3",
      name: "Molida Glinda", 
      handle: "@molida_glinda",
      rank: 3,
      wins: 412,
      matches: 756,
      points: 40550,
      victories: 43,
      bestWin: "1:15",
      spentTime: 756,
      rewards: {
        trophy: 30987,
        diamond: 17224
      },
      avatar: "🎤",
      trend: 'down',
      change: -2.1
    }
  ]);

  // Full ranking list with top 10 + current user
  const [fullRankings] = useState<Player[]>([
    {
      id: "1",
      name: "Blademir Malina Tori",
      handle: "@popy_bob",
      rank: 1,
      wins: 443,
      matches: 778,
      points: 44872,
      victories: 43,
      bestWin: "1:05",
      spentTime: 778,
      rewards: { trophy: 32421, diamond: 17500 },
      avatar: "👤",
      trend: 'up',
      change: 12.5
    },
    {
      id: "2", 
      name: "Robert Fox",
      handle: "@robert_fox",
      rank: 2,
      wins: 440,
      matches: 887,
      points: 42515,
      victories: 43,
      bestWin: "1:03",
      spentTime: 887,
      rewards: { trophy: 31001, diamond: 17421 },
      avatar: "🎮",
      trend: 'up',
      change: 8.2
    },
    {
      id: "3",
      name: "Molida Glinda", 
      handle: "@molida_glinda",
      rank: 3,
      wins: 412,
      matches: 756,
      points: 40550,
      victories: 43,
      bestWin: "1:15",
      spentTime: 756,
      rewards: { trophy: 30987, diamond: 17224 },
      avatar: "🎤",
      trend: 'down',
      change: -2.1
    },
    {
      id: "4",
      name: "Alex Chen",
      handle: "@alex_chen",
      rank: 4,
      wins: 398,
      matches: 720,
      points: 38200,
      victories: 38,
      bestWin: "1:08",
      spentTime: 720,
      rewards: { trophy: 28500, diamond: 15200 },
      avatar: "⚡",
      trend: 'up',
      change: 5.3
    },
    {
      id: "5",
      name: "Sarah Johnson",
      handle: "@sarah_j",
      rank: 5,
      wins: 385,
      matches: 695,
      points: 36500,
      victories: 35,
      bestWin: "1:12",
      spentTime: 695,
      rewards: { trophy: 27200, diamond: 14500 },
      avatar: "🌟",
      trend: 'stable',
      change: 0.0
    },
    {
      id: "6",
      name: "Mike Rodriguez",
      handle: "@mike_rod",
      rank: 6,
      wins: 372,
      matches: 680,
      points: 34800,
      victories: 32,
      bestWin: "1:18",
      spentTime: 680,
      rewards: { trophy: 25800, diamond: 13800 },
      avatar: "🔥",
      trend: 'up',
      change: 3.7
    },
    {
      id: "7",
      name: "Emma Wilson",
      handle: "@emma_w",
      rank: 7,
      wins: 358,
      matches: 650,
      points: 33200,
      victories: 30,
      bestWin: "1:22",
      spentTime: 650,
      rewards: { trophy: 24500, diamond: 13100 },
      avatar: "💎",
      trend: 'down',
      change: -1.2
    },
    {
      id: "8",
      name: "David Kim",
      handle: "@david_kim",
      rank: 8,
      wins: 345,
      matches: 625,
      points: 31800,
      victories: 28,
      bestWin: "1:25",
      spentTime: 625,
      rewards: { trophy: 23200, diamond: 12400 },
      avatar: "🎯",
      trend: 'up',
      change: 2.1
    },
    {
      id: "9",
      name: "Lisa Zhang",
      handle: "@lisa_z",
      rank: 9,
      wins: 332,
      matches: 600,
      points: 30200,
      victories: 25,
      bestWin: "1:28",
      spentTime: 600,
      rewards: { trophy: 21800, diamond: 11700 },
      avatar: "🚀",
      trend: 'stable',
      change: 0.0
    },
    {
      id: "10",
      name: "Tom Anderson",
      handle: "@tom_a",
      rank: 10,
      wins: 318,
      matches: 575,
      points: 28500,
      victories: 22,
      bestWin: "1:32",
      spentTime: 575,
      rewards: { trophy: 20500, diamond: 11000 },
      avatar: "⚔️",
      trend: 'down',
      change: -0.8
    },
    {
      id: "current",
      name: "Uxisrat",
      handle: "@uxisrat",
      rank: 47,
      wins: 245,
      matches: 420,
      points: 18900,
      victories: 15,
      bestWin: "1:45",
      spentTime: 420,
      rewards: { trophy: 12500, diamond: 6800 },
      avatar: "👑",
      trend: 'up',
      change: 1.5
    }
  ]);

    return (
      <AppLayout>
        <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
          {/* Header */}
          <div className="bg-black/95 backdrop-blur-sm border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1" style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.2' }}>Dashboard</h1>
                <p className="text-[#B0B0B0] text-sm" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>Real-time performance analytics & rankings</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
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
          <div className="p-6 lg:p-8 space-y-4 sm:space-y-6 w-full mt-16">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 w-full">
            {/* Total Registered */}
            <div className="card card-glow-cyan animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="metric-icon metric-icon-glow"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--status-success), var(--accent-teal))',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Users className="h-6 w-6 text-white relative z-10" />
                    </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: 'var(--status-success)' }} />
                  <span 
                    className="text-small font-semibold"
                    style={{ color: 'var(--status-success)' }}
                  >
                    +12.5%
                  </span>
                </div>
              </div>
              <div 
                className="metric-value"
                style={{ 
                  background: 'linear-gradient(135deg, var(--text-primary), var(--accent-cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {summaryStats.totalRegistered.toLocaleString()}
              </div>
              <div 
                className="metric-label"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Total Registered
              </div>
        </div>

            {/* Total Participated */}
            <div className="card card-glow-purple animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="metric-icon"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Activity className="h-6 w-6 text-white relative z-10" />
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />
                  <span 
                    className="text-small font-semibold"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    +8.2%
                  </span>
                </div>
                      </div>
              <div 
                className="metric-value"
                style={{ 
                  background: 'linear-gradient(135deg, var(--text-primary), var(--accent-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {summaryStats.totalParticipated.toLocaleString()}
                      </div>
              <div 
                className="metric-label"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Total Participated
                  </div>
                </div>

            {/* Timer */}
            <div className="card card-glow-teal animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="metric-icon metric-icon-glow"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b35, #f7931e) !important',
                    boxShadow: '0 0 20px rgba(255, 107, 53, 0.4) !important'
                  }}
                >
                  <Flame className="h-6 w-6 text-white relative z-10" />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--accent-teal)' }} />
                  <span 
                    className="text-small font-semibold"
                    style={{ color: 'var(--accent-teal)' }}
                  >
                    Active
                  </span>
                </div>
              </div>
              <div 
                className="metric-value"
                style={{ 
                  background: 'linear-gradient(135deg, var(--text-primary), var(--accent-teal))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {summaryStats.timeRemaining.days} : {summaryStats.timeRemaining.hours} : {summaryStats.timeRemaining.minutes}
                    </div>
              <div 
                className="metric-label"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Remaining time for completion
              </div>
              <div 
                className="text-tiny mb-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                DAYS HRS MINS
                  </div>
              <div 
                className="text-tiny"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Only the first three positions will be awarded prizes
                    </div>
                  </div>
                </div>

          {/* Top 3 Players */}
          <div className="mt-8 sm:mt-12" style={{ marginTop: '32px' }}>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8" style={{ marginBottom: '24px' }}>🏆 Top 3 Players</h2>
            <div className="card card-elevated animate-fade-in p-4 sm:p-6" style={{ marginBottom: '32px' }}>
              <div 
                className="top-3-grid"
                style={{
                  display: 'flex !important',
                  flexDirection: 'row' as const,
                  gap: '1rem !important',
                  width: '100% !important',
                  justifyContent: 'space-between !important',
                  alignItems: 'flex-start !important'
                }}
              >
                {topPlayers.map((player, index) => {
                  const medalColors = [
                    { bg: '#FFD700', text: '#000000', border: '#FFA500' }, // Gold
                    { bg: '#C0C0C0', text: '#000000', border: '#808080' }, // Silver  
                    { bg: '#CD7F32', text: '#FFFFFF', border: '#8B4513' }  // Bronze
                  ];
                  const medal = medalColors[index];
                  const medalIcons = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <div key={player.id} className="text-center" style={{ flex: '1 !important', minWidth: '0 !important', width: '33.33% !important' }}>
                      {/* Medal */}
                      <div className="mb-8 flex justify-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 shadow-lg"
                          style={{ 
                            backgroundColor: medal.bg,
                            color: medal.text,
                            borderColor: medal.border
                          }}
                        >
                          {medalIcons[index]}
                        </div>
                      </div>
                      
                      {/* Player Info */}
                      <div className="mb-3">
                        <div 
                          className="font-semibold text-sm truncate max-w-full mb-3"
                          style={{ color: 'var(--text-primary)' }}
                          title={player.name}
                        >
                          {player.name}
                        </div>
                        <div 
                          className="text-xs truncate max-w-full mb-5"
                          style={{ color: 'var(--text-tertiary)' }}
                          title={player.handle}
                        >
                          {player.handle}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-5">
                          <TrendingUp className="h-3 w-3" style={{
                            color: player.trend === 'up' ? 'var(--status-success)' : 'var(--status-error)'
                          }} />
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color: player.trend === 'up' ? 'var(--status-success)' : 'var(--status-error)'
                            }}
                          >
                            {player.change > 0 ? '+' : ''}{player.change}%
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div>
                        <div className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                          POINTS
                        </div>
                        <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                          {player.points.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Global Ranking Table */}
          <div 
            className="card card-elevated animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <div 
              className="p-8 border-b"
              style={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))'
              }}
            >
              <h2 
                className="text-heading-2"
                style={{ 
                  background: 'linear-gradient(135deg, var(--text-primary), var(--accent-cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Global Ranking
              </h2>
          </div>
          
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="table min-w-full text-xs" style={{ width: '100%', maxWidth: '100vw' }}>
                <thead>
                  <tr>
                    <th className="w-8 px-1" style={{ width: '40px' }}>Rank</th>
                    <th className="px-1" style={{ width: '80px', minWidth: '80px' }}>Username</th>
                    <th className="w-12 px-1" style={{ width: '60px' }}>Points</th>
                    <th className="w-12 px-1" style={{ width: '60px' }}>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {fullRankings.map((player, index) => {
                    // Calculate reward based on rank (top 3 get payouts)
                    const reward = player.rank <= 3 ? (player.rank === 1 ? '$500' : player.rank === 2 ? '$300' : '$200') : '--';
                    const hasReward = player.rank <= 3;
                    const isCurrentUser = player.id === 'current';
                    
                    return (
                      <tr 
                        key={player.id} 
                        className={`hover:bg-gradient-to-r hover:from-transparent hover:to-rgba(255,255,255,0.02) ${isCurrentUser ? 'border-t-2 border-b-2' : ''}`}
                        style={isCurrentUser ? { 
                          borderColor: 'var(--accent-cyan)', 
                          backgroundColor: 'rgba(0, 217, 255, 0.05)' 
                        } : {}}
                      >
                        <td className="w-8 px-1" style={{ width: '40px' }}>
                          <span 
                            className="text-xs font-bold"
                            style={{ 
                              color: player.rank === 1 ? '#FFD700' : 
                                     player.rank === 2 ? '#C0C0C0' :
                                     player.rank === 3 ? '#CD7F32' :
                                     isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-primary)'
                            }}
                          >
                            {player.rank}
                          </span>
                        </td>
                        <td className="px-1" style={{ width: '80px', minWidth: '80px' }}>
                          <div 
                            className="font-semibold text-xs truncate"
                            style={{ 
                              color: isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-primary)',
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                            title={player.handle}
                          >
                            {player.handle}
                            {isCurrentUser && ' (You)'}
                          </div>
                        </td>
                        <td className="w-12 px-1" style={{ width: '60px' }}>
                          <div 
                            className="font-semibold text-xs"
                            style={{ 
                              color: isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-primary)',
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                          >
                            {player.points.toLocaleString()}
                          </div>
                        </td>
                        <td className="w-12 px-1" style={{ width: '60px' }}>
                          <div 
                            className="font-semibold text-xs"
                            style={{ 
                              color: hasReward ? 'var(--status-success)' : isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                          >
                            {reward}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </AppLayout>
    );
  }