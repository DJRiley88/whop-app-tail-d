"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Palette, Database, LogOut, Link2, Globe, Search, Filter, ChevronDown } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        {/* Header */}
        <div className="bg-black/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.2' }}>Settings</h1>
              <p className="text-[#B0B0B0] text-sm" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.5' }}>Manage your account and preferences</p>
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
        <div className="p-6 lg:p-8 space-y-8 w-full mt-16">
        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Profile Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(20,184,166,0.2)] flex items-center justify-center">
                  <User className="h-6 w-6 text-[#14B8A6]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Profile</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Manage your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white font-medium"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center">
                  <Bell className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Notifications</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Configure notification preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                variant="outline" 
                className="w-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(239,68,68,0.2)] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[#EF4444]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Privacy</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Control your privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                variant="outline" 
                className="w-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] lg:mt-6"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(139,92,246,0.2)] flex items-center justify-center">
                  <Palette className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Appearance</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Customize the look and feel
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                variant="outline" 
                className="w-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Theme Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(245,158,11,0.2)] flex items-center justify-center">
                  <Database className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Data</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Manage your data and exports
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                variant="outline" 
                className="w-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Data Management
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Card */}
          <Card 
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: '16px' }}
          >
            <CardHeader style={{ padding: '24px 24px 16px 24px' }}>
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[rgba(128,128,128,0.2)] flex items-center justify-center">
                  <Settings className="h-6 w-6 text-[#808080]" />
                </div>
                <div>
                  <CardTitle className="text-white text-[16px]" style={{ fontSize: '16px', fontWeight: '600' }}>Advanced</CardTitle>
                  <CardDescription className="text-[#808080] text-[12px]" style={{ fontSize: '12px' }}>
                    Advanced configuration options
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: '0 24px 24px 24px' }}>
              <Button 
                variant="outline" 
                className="w-full border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}

