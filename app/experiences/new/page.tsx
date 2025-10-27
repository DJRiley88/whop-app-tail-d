"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, DollarSign, Percent, Users, Clock } from "lucide-react";

export default function CreateChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    totalPrizePool: "",
    firstPlacePercentage: "70",
    secondPlacePercentage: "20",
    thirdPlacePercentage: "10",
    tieHandling: "split" as "split" | "tiebreaker"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalPrizePool: parseFloat(formData.totalPrizePool),
          firstPlacePercentage: parseInt(formData.firstPlacePercentage),
          secondPlacePercentage: parseInt(formData.secondPlacePercentage),
          thirdPlacePercentage: parseInt(formData.thirdPlacePercentage),
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        }),
      });

      const result = await response.json();

      if (result.challenge) {
        alert("Challenge created successfully!");
        router.push("/dashboard");
      } else {
        alert(result.error || "Failed to create challenge");
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px', paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-lg border transition-colors" style={{ 
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#B0B0B0'
            }}>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Create Challenge</h1>
            <p className="text-[#B0B0B0]">Set up a new competition for your community</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Challenge Info */}
          <div className="rounded-xl border p-8" style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255,255,255,0.1)'
          }}>
            <h2 className="text-2xl font-bold text-white mb-6">Challenge Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="e.g. NBA Playoffs Challenge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D9FF] resize-none"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="Describe your challenge and what participants will compete in..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="rounded-xl border p-8" style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255,255,255,0.1)'
          }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Prize Pool
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Prize Pool ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.totalPrizePool}
                  onChange={(e) => setFormData({ ...formData, totalPrizePool: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  placeholder="1000.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Payout Percentages (%) *</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">1st Place</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.firstPlacePercentage}
                      onChange={(e) => setFormData({ ...formData, firstPlacePercentage: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">2nd Place</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.secondPlacePercentage}
                      onChange={(e) => setFormData({ ...formData, secondPlacePercentage: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">3rd Place</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.thirdPlacePercentage}
                      onChange={(e) => setFormData({ ...formData, thirdPlacePercentage: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Total: {parseInt(formData.firstPlacePercentage || '0') + parseInt(formData.secondPlacePercentage || '0') + parseInt(formData.thirdPlacePercentage || '0')}% 
                  {(parseInt(formData.firstPlacePercentage || '0') + parseInt(formData.secondPlacePercentage || '0') + parseInt(formData.thirdPlacePercentage || '0') !== 100) && (
                    <span className="text-red-500"> (Must equal 100%)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tie Handling */}
          <div className="rounded-xl border p-8" style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255,255,255,0.1)'
          }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Tie Handling
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-[#1E1E1E] transition-colors" style={{ 
                borderColor: formData.tieHandling === 'split' ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.tieHandling === 'split' ? 'rgba(0, 217, 255, 0.1)' : 'transparent'
              }}>
                <input
                  type="radio"
                  name="tieHandling"
                  value="split"
                  checked={formData.tieHandling === 'split'}
                  onChange={(e) => setFormData({ ...formData, tieHandling: e.target.value as "split" | "tiebreaker" })}
                  className="mr-2"
                />
                <div>
                  <div className="font-semibold text-white">Split Payout</div>
                  <div className="text-sm text-gray-400">Tied players split the combined payout amount</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-[#1E1E1E] transition-colors" style={{ 
                borderColor: formData.tieHandling === 'tiebreaker' ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                backgroundColor: formData.tieHandling === 'tiebreaker' ? 'rgba(0, 217, 255, 0.1)' : 'transparent'
              }}>
                <input
                  type="radio"
                  name="tieHandling"
                  value="tiebreaker"
                  checked={formData.tieHandling === 'tiebreaker'}
                  onChange={(e) => setFormData({ ...formData, tieHandling: e.target.value as "split" | "tiebreaker" })}
                  className="mr-2"
                />
                <div>
                  <div className="font-semibold text-white">Tiebreaker</div>
                  <div className="text-sm text-gray-400">Earliest last valid tail wins higher rank</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <button
                type="button"
                className="px-6 py-3 rounded-lg border font-semibold transition-colors text-white"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(135deg, #00D9FF 0%, #14B8A6 100%)',
                color: 'white',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
              }}
            >
              {loading ? "Creating..." : "Create Challenge"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

