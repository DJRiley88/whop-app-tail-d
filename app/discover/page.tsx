"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/simple-button";
import { Trophy, Users, Clock, Target, ExternalLink, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

interface Bet {
  id: string;
  challengeId: string;
  title: string;
  caption?: string;
  tailLink: string;
  imageUrl?: string;
  sportsbook: "prizepicks" | "underdog" | "draftkings" | "fanduel" | "betmgm" | "other";
  league: "nfl" | "nba" | "nhl" | "mlb" | "ncaaf" | "ncaab" | "soccer" | "tennis" | "golf" | "other";
  tailWindowMinutes: number;
  tailWindowEndsAt: string;
  status: "open" | "closed" | "hidden";
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  challengeTitle: string;
  challengeDescription: string;
  challengeStatus: "draft" | "active" | "ended" | "archived";
  totalTails: number;
  validTails: number;
  timeRemaining: number;
  isExpired: boolean;
}

export default function DiscoverPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseTime = new Date('2024-01-15T10:00:00Z').getTime();
    const mockBets: Bet[] = [
      {
        id: "1",
        challengeId: "challenge-1",
        title: "Lakers vs Warriors Over 225.5",
        caption: "High-scoring game expected with both teams in good form",
        tailLink: "https://prizepicks.com/bet/123",
        sportsbook: "prizepicks",
        league: "nba",
        tailWindowMinutes: 45,
        tailWindowEndsAt: new Date(baseTime + 45 * 60 * 1000).toISOString(),
        status: "open",
        postedBy: "user123",
        createdAt: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseTime).toISOString(),
        challengeTitle: "NBA Playoffs Challenge",
        challengeDescription: "Pick the winners in NBA playoff games",
        challengeStatus: "active",
        totalTails: 47,
        validTails: 42,
        timeRemaining: 45,
        isExpired: false
      },
      {
        id: "2",
        challengeId: "challenge-2",
        title: "Chiefs -3.5 vs Bills",
        caption: "Chiefs at home with Mahomes looking sharp",
        tailLink: "https://draftkings.com/bet/456",
        sportsbook: "draftkings",
        league: "nfl",
        tailWindowMinutes: 30,
        tailWindowEndsAt: new Date(baseTime + 30 * 60 * 1000).toISOString(),
        status: "open",
        postedBy: "user456",
        createdAt: new Date(baseTime - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(baseTime).toISOString(),
        challengeTitle: "NFL Sunday Challenge",
        challengeDescription: "Pick NFL games for Sunday",
        challengeStatus: "active",
        totalTails: 23,
        validTails: 19,
        timeRemaining: 30,
        isExpired: false
      }
    ];
    
    setTimeout(() => {
      setBets(mockBets);
      setLoading(false);
    }, 500);
  }, []);

  const getLeagueIcon = (league: string) => {
    const icons: Record<string, string> = {
      nba: "🏀",
      nfl: "🏈",
      mlb: "⚾",
      nhl: "🏒",
      soccer: "⚽",
      tennis: "🎾",
      golf: "⛳",
      ncaaf: "🏈",
      ncaab: "🏀"
    };
    return icons[league] || "🎲";
  };

  const getTimeRemaining = (minutes: number, expired: boolean) => {
    if (expired) return "Expired";
    if (minutes < 60) return `${minutes}m left`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m left`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-300">Loading bets...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        {/* Header */}
                 <div className="bg-black/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.2' }}>Discover Bets</h1>
              <p className="text-[#B0B0B0] text-sm" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>Browse all betting slips posted by members across different challenges</p>
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
        <div className="p-6 lg:p-8 w-full mt-16">
          <div className="max-w-7xl mx-auto">
            {/* Bets List */}
            {bets.length === 0 ? (
              <div 
                className="rounded-xl p-24 text-center border shadow-lg"
                style={{ 
                  backgroundColor: '#1A1A1A',
                  borderColor: 'rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
              >
                <TrendingUp className="h-24 w-24 mx-auto mb-8" style={{ color: '#00D9FF' }} />
                <h3 className="text-4xl font-bold mb-6" style={{ color: '#00D9FF', fontWeight: '700' }}>
                  No Bets Available
                </h3>
                <p className="mb-12 text-xl" style={{ color: '#B0B0B0' }}>
                  There are currently no betting slips posted. Check back later for new opportunities!
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{ 
                    background: 'linear-gradient(135deg, #00D9FF 0%, #14B8A6 100%)',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
                  }}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" style={{ marginLeft: '40px' }}>
                {bets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="group relative overflow-hidden rounded-xl border shadow-lg transition-all duration-200 hover:-translate-y-2 hover:shadow-xl"
                    style={{ 
                      backgroundColor: '#1A1A1A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                      padding: '24px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 217, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)';
                    }}
                  >
                    {/* Header with badges and time */}
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-3">
                          <span 
                            className="px-4 py-2 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: 'rgba(139, 92, 246, 0.2)',
                              color: '#8B5CF6',
                              padding: '8px 16px'
                            }}
                          >
                            {bet.sportsbook.toUpperCase()}
                          </span>
                          <span 
                            className="px-4 py-2 rounded-full text-xs font-medium border"
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#B0B0B0',
                              borderColor: 'rgba(255,255,255,0.1)',
                              padding: '8px 16px'
                            }}
                          >
                            {getLeagueIcon(bet.league)} {bet.league.toUpperCase()}
                          </span>
                        </div>
                        <div 
                          className="text-sm font-medium px-4 py-2 rounded-lg"
                          style={{ 
                            color: bet.isExpired ? '#EF4444' : '#00D9FF',
                            backgroundColor: bet.isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 217, 255, 0.1)',
                            padding: '8px 16px'
                          }}
                        >
                          {getTimeRemaining(bet.timeRemaining, bet.isExpired)}
                        </div>
                      </div>
                      
                      {/* Title and description */}
                      <h3 className="text-2xl font-bold text-white mb-6" style={{ fontWeight: '700', marginBottom: '32px', marginTop: '20px' }}>
                        {bet.title}
                      </h3>
                      {bet.caption && (
                        <p className="text-base mb-8" style={{ color: '#B0B0B0', marginBottom: '20px' }}>
                          {bet.caption}
                        </p>
                      )}
                    </div>

                    {/* Challenge Info */}
                    <div className="pt-8" style={{ paddingTop: '20px' }}>
                      <div 
                        className="rounded-xl p-6 border"
                        style={{ 
                          backgroundColor: 'rgba(0, 217, 255, 0.1)',
                          borderColor: 'rgba(0, 217, 255, 0.2)',
                          padding: '24px'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold" style={{ color: '#00D9FF' }}>
                              {bet.challengeTitle}
                            </div>
                            <div className="text-sm" style={{ color: '#B0B0B0' }}>Challenge</div>
                          </div>
                          <Trophy className="h-6 w-6" style={{ color: '#00D9FF' }} />
                        </div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="pt-8" style={{ paddingTop: '20px' }}>
                      <div className="grid grid-cols-2 gap-6">
                        <div 
                          className="rounded-lg p-6 text-center"
                          style={{ backgroundColor: '#1E1E1E' }}
                        >
                          <div className="text-3xl font-bold mb-1" style={{ color: '#10B981' }}>
                            {bet.totalTails}
                          </div>
                          <div className="text-sm" style={{ color: '#808080' }}>Total Tails</div>
                        </div>
                        <div 
                          className="rounded-lg p-6 text-center"
                          style={{ backgroundColor: '#1E1E1E' }}
                        >
                          <div className="text-3xl font-bold mb-1" style={{ color: '#00D9FF' }}>
                            {bet.validTails}
                          </div>
                          <div className="text-sm" style={{ color: '#808080' }}>Valid Tails</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-8 mt-6">
                      <button
                        onClick={() => window.open(bet.tailLink, '_blank')}
                        className="w-full py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                        style={{ 
                          background: 'linear-gradient(135deg, #00D9FF 0%, #14B8A6 100%)',
                          color: 'white',
                          boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
                        }}
                      >
                        Tail This Bet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}