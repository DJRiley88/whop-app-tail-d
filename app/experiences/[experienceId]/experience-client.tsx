"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Trophy, Users, Target } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalPrizePool: string;
  firstPlacePercentage: number;
  secondPlacePercentage: number;
  thirdPlacePercentage: number;
  status: "draft" | "active" | "ended" | "archived";
  totalBets: number;
  totalTails: number;
  uniqueTailers: number;
}

interface Bet {
  id: string;
  title: string;
  caption?: string;
  tailLink: string;
  imageUrl?: string;
  sportsbook: string;
  league: string;
  tailWindowMinutes: number;
  tailWindowEndsAt: string;
  status: "open" | "closed" | "hidden";
  totalTails: number;
  validTails: number;
  timeRemaining: number;
  isExpired: boolean;
}

interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  rank: number;
  lastTailAt: string;
}

interface UserStats {
  userId: string;
  totalPoints: number;
  totalTails: number;
  validTails: number;
  rank?: number;
}

export default function ExperienceClient({
  experienceId,
  accessLevel,
}: {
  experienceId: string;
  accessLevel: "admin" | "customer" | "no_access";
}) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailing, setTailing] = useState<Set<string>>(new Set());
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    fetchChallengeData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchChallengeData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Immediate redirect if no challenge
  useEffect(() => {
    if (!loading && !challenge && !redirecting) {
      setRedirecting(true);
      window.location.href = "/dashboard";
    }
  }, [loading, challenge, redirecting]);

  const fetchChallengeData = async () => {
    try {
      // First check if challenge exists
      const challengeRes = await fetch(`/api/challenges/${experienceId}`);
      const challengeData = await challengeRes.json();
      
      // Check if challenge exists or if there's an error
      if (!challengeData.challenge || challengeRes.status === 404) {
        console.log("[Experiences] Challenge not found, redirecting to dashboard");
        setRedirecting(true);
        window.location.href = "/dashboard";
        return;
      }
      
      // If challenge exists, fetch the rest of the data
      const [betsRes, leaderboardRes, userStatsRes] = await Promise.all([
        fetch(`/api/bets?challengeId=${experienceId}`),
        fetch(`/api/leaderboard/${experienceId}?limit=10`),
        fetch(`/api/leaderboard/${experienceId}?userId=current`)
      ]);

      const betsData = await betsRes.json();
      const leaderboardData = await leaderboardRes.json();
      const userStatsData = await userStatsRes.json();

      setChallenge(challengeData.challenge);
      setBets(betsData.bets || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      setUserStats(userStatsData.userStats);
    } catch (error) {
      console.error("[Experiences] Error fetching challenge data:", error);
      // Redirect to dashboard on error
      setRedirecting(true);
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  const handleTailBet = async (betId: string) => {
    if (tailing.has(betId)) return;
    
    setTailing(prev => new Set(prev).add(betId));
    
    try {
      const response = await fetch("/api/tails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data to show updated stats
        await fetchChallengeData();
        
        // Show success message
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error tailing bet:", error);
      alert("Failed to tail bet. Please try again.");
    } finally {
      setTailing(prev => {
        const newSet = new Set(prev);
        newSet.delete(betId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Expired";
    if (minutes < 60) return `${minutes}m left`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m left`;
  };

  const getSportsbookColor = (sportsbook: string) => {
    const colors: Record<string, string> = {
      prizepicks: "bg-purple-100 text-purple-800",
      underdog: "bg-orange-100 text-orange-800",
      draftkings: "bg-blue-100 text-blue-800",
      fanduel: "bg-green-100 text-green-800",
      betmgm: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[sportsbook] || colors.other;
  };

  const getLeagueColor = (league: string) => {
    const colors: Record<string, string> = {
      nfl: "bg-orange-100 text-orange-800",
      nba: "bg-orange-100 text-orange-800",
      nhl: "bg-blue-100 text-blue-800",
      mlb: "bg-green-100 text-green-800",
      ncaaf: "bg-red-100 text-red-800",
      ncaab: "bg-red-100 text-red-800",
      soccer: "bg-green-100 text-green-800",
      tennis: "bg-yellow-100 text-yellow-800",
      golf: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[league] || colors.other;
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF] mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00D9FF]"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no challenge and not loading, show redirect message
  if (!challenge) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF] mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Access Level Badge */}
        <div className="mb-4">
          {accessLevel === "admin" && (
            <Badge className="bg-blue-500 text-white">Admin Access</Badge>
          )}
          {accessLevel === "customer" && (
            <Badge className="bg-green-500 text-white">Member</Badge>
          )}
        </div>

        {/* Challenge Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {challenge.description}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {challenge.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatCurrency(challenge.totalPrizePool)}</div>
                <div className="text-sm text-gray-600">Prize Pool</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{challenge.totalBets}</div>
                <div className="text-sm text-gray-600">Total Bets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{challenge.totalTails}</div>
                <div className="text-sm text-gray-600">Total Tails</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{challenge.uniqueTailers}</div>
                <div className="text-sm text-gray-600">Unique Tailers</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Payout Structure</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">1st Place</div>
                  <div className="text-sm text-blue-800">{challenge.firstPlacePercentage}%</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">2nd Place</div>
                  <div className="text-sm text-blue-800">{challenge.secondPlacePercentage}%</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">3rd Place</div>
                  <div className="text-sm text-blue-800">{challenge.thirdPlacePercentage}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        {userStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.validTails}</div>
                  <div className="text-sm text-gray-600">Valid Tails</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.totalTails}</div>
                  <div className="text-sm text-gray-600">Total Tails</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userStats.rank ? `#${userStats.rank}` : "Unranked"}
                  </div>
                  <div className="text-sm text-gray-600">Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bets Feed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Bets</h2>
          {bets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bets</h3>
                <p className="text-gray-600">Check back later for new betting opportunities</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bets.map((bet) => (
                <Card key={bet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{bet.title}</CardTitle>
                        {bet.caption && (
                          <CardDescription className="mt-1">{bet.caption}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSportsbookColor(bet.sportsbook)}>
                          {bet.sportsbook}
                        </Badge>
                        <Badge className={getLeagueColor(bet.league)}>
                          {bet.league.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bet.imageUrl && (
                        <img 
                          src={bet.imageUrl} 
                          alt={bet.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className={`text-sm font-medium ${
                            bet.isExpired ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatTimeRemaining(bet.timeRemaining)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {bet.validTails} valid tails • {bet.totalTails} total
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          asChild 
                          className="flex-1"
                          disabled={bet.isExpired || tailing.has(bet.id)}
                        >
                          <a 
                            href={bet.tailLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => handleTailBet(bet.id)}
                          >
                            {tailing.has(bet.id) ? (
                              "Tailing..."
                            ) : bet.isExpired ? (
                              "Expired"
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Tail for Points
                              </>
                            )}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No participants yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userId} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">User #{entry.userId.slice(-4)}</div>
                        <div className="text-sm text-gray-600">
                          {entry.totalPoints} points
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Last tail: {new Date(entry.lastTailAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

