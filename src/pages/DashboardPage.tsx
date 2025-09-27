import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Globe, 
  Clock,
  Activity,
  DollarSign,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Calendar,
  Eye,
  Volume2,
  Cpu,
  Server,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Play,
  Pause
} from 'lucide-react';

import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalRequests: number;
  activeUsers: number;
  revenue: number;
  uptime: number;
  avgLatency: number;
  successRate: number;
}

interface ChartData {
  label: string;
  value: number;
  change: number;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'synthesis' | 'user' | 'error' | 'payment';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    activeUsers: 0,
    revenue: 0,
    uptime: 0,
    avgLatency: 0,
    successRate: 0
  });

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLive, setIsLive] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('requests');
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app, this would come from API
      setStats({
        totalRequests: 1247892,
        activeUsers: 8934,
        revenue: 45678,
        uptime: 99.98,
        avgLatency: 247,
        successRate: 99.94
      });

      setRecentActivity([
        {
          id: '1',
          type: 'synthesis',
          message: 'Voice synthesis completed for user @sarah_dev',
          timestamp: '2 minutes ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'user',
          message: 'New user registration from San Francisco',
          timestamp: '5 minutes ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'error',
          message: 'Rate limit exceeded for API key abc123',
          timestamp: '8 minutes ago',
          status: 'warning'
        },
        {
          id: '4',
          type: 'payment',
          message: 'Payment received: $149 (Business Plan)',
          timestamp: '12 minutes ago',
          status: 'success'
        }
      ]);

      if (isLive) {
        toast.success('Dashboard updated');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const chartData: ChartData[] = [
    { label: 'API Requests', value: 1247892, change: 12.5, color: '#3b82f6' },
    { label: 'Active Users', value: 8934, change: 8.2, color: '#10b981' },
    { label: 'Revenue', value: 45678, change: 15.7, color: '#f59e0b' },
    { label: 'Success Rate', value: 99.94, change: 0.1, color: '#8b5cf6' }
  ];

  const systemHealth = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.98%', color: '#10b981' },
    { name: 'TTS Engine', status: 'healthy', uptime: '99.95%', color: '#10b981' },
    { name: 'Database', status: 'healthy', uptime: '99.99%', color: '#10b981' },
    { name: 'CDN', status: 'warning', uptime: '98.50%', color: '#f59e0b' }
  ];

  const topVoices = [
    { name: 'Sarah (Professional)', usage: 23456, change: 5.2 },
    { name: 'Marcus (Casual)', usage: 18923, change: -2.1 },
    { name: 'Emma (Energetic)', usage: 15678, change: 8.7 },
    { name: 'David (Calm)', usage: 12345, change: 3.4 },
    { name: 'Lisa (Friendly)', usage: 9876, change: 12.1 }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="cyber" performance="high">
          <AudioVisualizer3D
            isPlaying={isLive}
            type="spectrum"
            color="#3b82f6"
            intensity={0.8}
            size={2.5}
          />
        </Scene3D>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-xl text-gray-300">
                  Real-time analytics and system monitoring
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-6 lg:mt-0">
                {/* Time Range Selector */}
                <div className="flex bg-white/10 rounded-xl p-1">
                  {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                    <motion.button
                      key={range}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeRange === range
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {range}
                    </motion.button>
                  ))}
                </div>

                {/* Live Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLive(!isLive)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isLive
                      ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-gray-300 border border-white/20'
                  }`}
                >
                  {isLive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span>{isLive ? 'Live' : 'Paused'}</span>
                </motion.button>

                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadDashboardData}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartData.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer"
                onClick={() => setSelectedMetric(metric.label.toLowerCase().replace(' ', '_'))}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    {metric.label === 'API Requests' && <Zap className="w-6 h-6" style={{ color: metric.color }} />}
                    {metric.label === 'Active Users' && <Users className="w-6 h-6" style={{ color: metric.color }} />}
                    {metric.label === 'Revenue' && <DollarSign className="w-6 h-6" style={{ color: metric.color }} />}
                    {metric.label === 'Success Rate' && <CheckCircle className="w-6 h-6" style={{ color: metric.color }} />}
                  </div>
                  
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-gray-400 text-sm font-medium">{metric.label}</h3>
                  <div className="text-3xl font-bold text-white">
                    {metric.label === 'Revenue' ? `$${metric.value.toLocaleString()}` :
                     metric.label === 'Success Rate' ? `${metric.value}%` :
                     metric.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    vs previous {timeRange}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Real-time</span>
                </div>
              </div>

              {/* Mock Chart Area */}
              <div className="h-64 bg-black/30 rounded-xl p-4 flex items-end justify-between">
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.random() * 80 + 20}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t w-8"
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">1.2M</div>
                  <div className="text-sm text-gray-400">Total Requests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">247ms</div>
                  <div className="text-sm text-gray-400">Avg Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">System Health</h2>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">All Systems Operational</span>
                </div>
              </div>

              <div className="space-y-4">
                {systemHealth.map((system, index) => (
                  <motion.div
                    key={system.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: system.color }}
                      />
                      <div>
                        <div className="text-white font-medium">{system.name}</div>
                        <div className="text-sm text-gray-400 capitalize">{system.status}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">{system.uptime}</div>
                      <div className="text-sm text-gray-400">Uptime</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-3 rounded-xl font-medium border border-blue-500/50 transition-all"
              >
                View Detailed Health Report
              </motion.button>
            </motion.div>
          </div>

          {/* Top Voices and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Voices */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Top Voices</h2>
                <Volume2 className="w-6 h-6 text-orange-400" />
              </div>

              <div className="space-y-4">
                {topVoices.map((voice, index) => (
                  <motion.div
                    key={voice.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/40 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-orange-400">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{voice.name}</div>
                        <div className="text-sm text-gray-400">{voice.usage.toLocaleString()} uses</div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 text-sm ${
                      voice.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {voice.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      <span>{Math.abs(voice.change)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-black/30 rounded-xl"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-green-600/20' :
                      activity.status === 'warning' ? 'bg-yellow-600/20' :
                      'bg-red-600/20'
                    }`}>
                      {activity.type === 'synthesis' && <Volume2 className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-green-400" />}
                      {activity.type === 'error' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-400" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white text-sm">{activity.message}</div>
                      <div className="text-gray-400 text-xs mt-1">{activity.timestamp}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium border border-white/20 transition-all"
              >
                View All Activity
              </motion.button>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Performance Overview</h2>
              <p className="text-gray-300">Real-time system performance and optimization metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { label: 'CPU Usage', value: '23%', icon: <Cpu className="w-6 h-6" />, color: '#3b82f6' },
                { label: 'Memory', value: '67%', icon: <Server className="w-6 h-6" />, color: '#10b981' },
                { label: 'Network', value: '45%', icon: <Globe className="w-6 h-6" />, color: '#f59e0b' },
                { label: 'Storage', value: '34%', icon: <BarChart3 className="w-6 h-6" />, color: '#8b5cf6' },
                { label: 'Latency', value: '247ms', icon: <Clock className="w-6 h-6" />, color: '#ef4444' },
                { label: 'Throughput', value: '1.2K/s', icon: <TrendingUp className="w-6 h-6" />, color: '#06b6d4' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <div style={{ color: metric.color }}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
