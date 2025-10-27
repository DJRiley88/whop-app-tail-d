"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/simple-button";
import { 
  ArrowLeft,
  Trophy,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
  Medal,
  Crown,
  Award,
  Clock,
  Target,
  Zap
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "ended" | "archived";
  startDate: string;
  endDate: string;
  totalPrizePool: string;
  totalBets: number;
  totalTails: number;
  uniqueTailers: number;
}


interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  rank: number;
  lastTailAt: string;
}

interface UserTailStats {
  userId: string;
  totalPoints: number;
  totalTails: number;
  validTails: number;
  rank?: number;
}

export default function ChallengeLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params?.challengeId as string;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserTailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!challengeId) return;
      
      try {
        setLoading(true);
        
        // Use mock challenge data for now
        const mockChallenge = {
          id: challengeId,
          title: "Sample Challenge",
          description: "This is a sample challenge for testing",
          status: "active" as const,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalPrizePool: "1000.00",
          totalBets: 25,
          totalTails: 156,
          uniqueTailers: 10
        };
        setChallenge(mockChallenge);


        // Use mock data for now (always set mock data)
        const mockLeaderboard = [
          {
            userId: "user_001",
            totalPoints: 245,
            rank: 1,
            lastTailAt: new Date().toISOString()
          },
          {
            userId: "user_042",
            totalPoints: 198,
            rank: 2,
            lastTailAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_156",
            totalPoints: 187,
            rank: 3,
            lastTailAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_289",
            totalPoints: 156,
            rank: 4,
            lastTailAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_334",
            totalPoints: 142,
            rank: 5,
            lastTailAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_445",
            totalPoints: 128,
            rank: 6,
            lastTailAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_567",
            totalPoints: 115,
            rank: 7,
            lastTailAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_678",
            totalPoints: 98,
            rank: 8,
            lastTailAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_789",
            totalPoints: 87,
            rank: 9,
            lastTailAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: "user_890",
            totalPoints: 76,
            rank: 10,
            lastTailAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setLeaderboard(mockLeaderboard);
        
        // Mock user stats
        setUserStats({
          userId: "current_user",
          totalPoints: 156,
          totalTails: 89,
          validTails: 78,
          rank: 4
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [challengeId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#10B981] text-white';
      case 'ended':
        return 'bg-[#F59E0B] text-white';
      case 'draft':
        return 'bg-[#3B82F6] text-white';
      default:
        return 'bg-[#808080] text-white';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-[#808080] font-bold">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF]"></div>
        </div>
      </AppLayout>
    );
  }

  if (error || !challenge) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Error</h3>
            <p className="text-[#808080] mb-4">{error || 'Challenge not found'}</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black px-6 py-2 rounded-lg"
            >
              Go Back
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-8 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/leaderboard')}
              className="bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-[#00D9FF]/30 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8 w-full mt-24" style={{ marginTop: '120px !important' }}>
        {/* Challenge Overview */}
        <div 
          className="relative overflow-hidden rounded-xl border shadow-lg"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            padding: '24px'
          }}
        >
          {/* Header with Status and Date */}
          <div className="flex justify-between items-start mb-6">
            <div className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide ${getStatusColor(challenge.status)}`} style={{ padding: '4px 8px', fontSize: '10px' }}>
              {challenge.status.toUpperCase()}
            </div>
            <div className="text-sm text-[#808080]" style={{ fontSize: '14px', fontWeight: '400' }}>
              {formatDateRange(challenge.startDate, challenge.endDate)}
            </div>
          </div>

          {/* Challenge Title */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4' }}>
              {challenge.title}
            </h3>
            <p className="text-[#B0B0B0] text-sm leading-relaxed" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.6' }}>
              {challenge.description}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                {leaderboard.length.toLocaleString()}
              </div>
              <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                PARTICIPANTS
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                {leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0).toLocaleString()}
              </div>
              <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                TOTAL POINTS
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                {challenge.totalBets.toLocaleString()}
              </div>
              <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                TOTAL BETS
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.1' }}>
                ${parseFloat(challenge.totalPrizePool).toLocaleString()}
              </div>
              <div className="text-xs text-[#808080] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: '500' }}>
                PRIZE POOL
              </div>
            </div>
          </div>
        </div>

        {/* SPACER ELEMENT - VISIBLE GAP */}
        <div style={{ 
          height: '32px', 
          width: '100%',
          backgroundColor: 'transparent',
          display: 'block'
        }}></div>

        {/* Leaderboard */}
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
              Leaderboard
            </h2>
          </div>
          
          {leaderboard.length > 0 ? (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="table min-w-full text-xs" style={{ width: '100%', maxWidth: '100vw' }}>
                <thead>
                  <tr>
                    <th className="w-8 px-1" style={{ width: '40px' }}>Rank</th>
                    <th className="px-1" style={{ width: '80px', minWidth: '80px' }}>Username</th>
                    <th className="w-12 px-1" style={{ width: '60px' }}>Points</th>
                    <th className="w-12 px-1" style={{ width: '60px' }}>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.userId === 'current_user';
                    
                    return (
                      <tr 
                        key={entry.userId} 
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
                              color: entry.rank === 1 ? '#FFD700' : 
                                     entry.rank === 2 ? '#C0C0C0' :
                                     entry.rank === 3 ? '#CD7F32' :
                                     isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-primary)'
                            }}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-1" style={{ width: '80px', minWidth: '80px' }}>
                          <div 
                            className="font-semibold text-xs truncate"
                            style={{ 
                              color: isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-primary)',
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                            title={`User ${entry.userId.slice(-8)}`}
                          >
                            User {entry.userId.slice(-8)}
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
                            {entry.totalPoints.toLocaleString()}
                          </div>
                        </td>
                        <td className="w-12 px-1" style={{ width: '60px' }}>
                          <div 
                            className="font-semibold text-xs"
                            style={{ 
                              color: isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                          >
                            {new Date(entry.lastTailAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-[#808080] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No participants yet</h3>
              <p className="text-[#808080]">Be the first to join this challenge!</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
