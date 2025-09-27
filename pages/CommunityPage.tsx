import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Play, 
  Pause,
  Download,
  Star,
  Trophy,
  Zap,
  Globe,
  Headphones,
  Mic,
  Volume2,
  UserPlus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Crown,
  Sparkles,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { useScene3DStore } from '../src/hooks/use3D';
import { toast } from 'react-hot-toast';

interface CommunityPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    tier: 'free' | 'pro' | 'premium';
    followers: number;
    verified: boolean;
  };
  content: {
    text: string;
    audioUrl?: string;
    voiceId: string;
    voiceName: string;
    duration?: number;
    waveform?: number[];
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    plays: number;
  };
  tags: string[];
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface CommunityUser {
  id: string;
  name: string;
  avatar: string;
  tier: 'free' | 'pro' | 'premium';
  followers: number;
  following: number;
  totalPlays: number;
  verified: boolean;
  specialties: string[];
  joinedAt: string;
  isFollowing: boolean;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [topCreators, setTopCreators] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'trending' | 'recent' | 'following' | 'popular'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingPost, setPlayingPost] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Posts', icon: Globe, color: '#8b5cf6' },
    { id: 'music', name: 'Music', icon: Headphones, color: '#ec4899' },
    { id: 'storytelling', name: 'Stories', icon: MessageCircle, color: '#10b981' },
    { id: 'education', name: 'Education', icon: Award, color: '#f59e0b' },
    { id: 'entertainment', name: 'Entertainment', icon: Sparkles, color: '#ef4444' },
    { id: 'business', name: 'Business', icon: Trophy, color: '#3b82f6' }
  ];

  const filters = [
    { id: 'trending', name: 'Trending', icon: TrendingUp, description: 'Hot content right now' },
    { id: 'recent', name: 'Recent', icon: Zap, description: 'Latest posts' },
    { id: 'popular', name: 'Popular', icon: Star, description: 'Most liked content' },
    { id: 'following', name: 'Following', icon: Users, description: 'From people you follow' }
  ];

  useEffect(() => {
    loadCommunityData();
  }, [selectedFilter, selectedCategory]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          user: {
            id: 'user1',
            name: 'Sarah Chen',
            avatar: '👩‍🎤',
            tier: 'premium',
            followers: 15420,
            verified: true
          },
          content: {
            text: 'Just created this amazing storytelling piece using Emma\'s voice! The emotional depth is incredible. 🎭✨',
            voiceId: 'emma_american_female',
            voiceName: 'Emma',
            duration: 45,
            waveform: Array.from({ length: 50 }, () => Math.random())
          },
          stats: {
            likes: 1247,
            comments: 89,
            shares: 156,
            plays: 3421
          },
          tags: ['storytelling', 'emotional', 'emma'],
          createdAt: '2024-01-15T10:30:00Z',
          isLiked: false,
          isBookmarked: true
        },
        {
          id: '2',
          user: {
            id: 'user2',
            name: 'Marcus Rodriguez',
            avatar: '🎵',
            tier: 'pro',
            followers: 8930,
            verified: false
          },
          content: {
            text: 'Experimenting with the new AI voices for my podcast intro. The quality is mind-blowing! 🚀',
            voiceId: 'james_british_male',
            voiceName: 'James',
            duration: 32,
            waveform: Array.from({ length: 50 }, () => Math.random())
          },
          stats: {
            likes: 892,
            comments: 45,
            shares: 78,
            plays: 2156
          },
          tags: ['podcast', 'professional', 'james'],
          createdAt: '2024-01-15T08:15:00Z',
          isLiked: true,
          isBookmarked: false
        }
      ];

      const mockCreators: CommunityUser[] = [
        {
          id: 'creator1',
          name: 'Alex Thompson',
          avatar: '🎭',
          tier: 'premium',
          followers: 25600,
          following: 342,
          totalPlays: 156789,
          verified: true,
          specialties: ['Voice Acting', 'Storytelling', 'Character Voices'],
          joinedAt: '2023-06-15T00:00:00Z',
          isFollowing: false
        },
        {
          id: 'creator2',
          name: 'Luna Martinez',
          avatar: '🎤',
          tier: 'pro',
          followers: 18900,
          following: 189,
          totalPlays: 98432,
          verified: true,
          specialties: ['Music', 'Singing', 'Audio Production'],
          joinedAt: '2023-08-22T00:00:00Z',
          isFollowing: true
        }
      ];

      setPosts(mockPosts);
      setTopCreators(mockCreators);
      toast.success('Community data loaded!');
    } catch (error) {
      console.error('Failed to load community data:', error);
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            stats: { 
              ...post.stats, 
              likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1 
            }
          }
        : post
    ));
    toast.success(posts.find(p => p.id === postId)?.isLiked ? 'Unliked!' : 'Liked!');
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
    toast.success(posts.find(p => p.id === postId)?.isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
  };

  const handleFollow = (userId: string) => {
    setTopCreators(topCreators.map(creator =>
      creator.id === userId
        ? { 
            ...creator, 
            isFollowing: !creator.isFollowing,
            followers: creator.isFollowing ? creator.followers - 1 : creator.followers + 1
          }
        : creator
    ));
    toast.success(topCreators.find(c => c.id === userId)?.isFollowing ? 'Unfollowed' : 'Following!');
  };

  const handlePlayAudio = (postId: string) => {
    if (playingPost === postId) {
      setPlayingPost(null);
    } else {
      setPlayingPost(postId);
      // Simulate audio playback
      setTimeout(() => setPlayingPost(null), 5000);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading Community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="cyber" performance="high">
          <AudioVisualizer3D
            isPlaying={!!playingPost}
            type="particles"
            color="#ec4899"
            intensity={1.2}
            size={1.5}
          />
        </Scene3D>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Voice Community
                </h1>
                <p className="text-gray-300 mt-1">Connect, share, and discover amazing voice creations</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-purple-500/25 flex items-center space-x-2"
              >
                <Mic className="w-5 h-5" />
                <span>Create Post</span>
              </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search community posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = selectedFilter === filter.id;
                  
                  return (
                    <motion.button
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{filter.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm text-sm ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isActive ? category.color : undefined,
                      boxShadow: isActive ? `0 0 20px ${category.color}40` : undefined
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{category.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Posts Feed */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          {post.user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-semibold">{post.user.name}</h3>
                            {post.user.verified && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              post.user.tier === 'premium' ? 'bg-yellow-500/20 text-yellow-300' :
                              post.user.tier === 'pro' ? 'bg-purple-500/20 text-purple-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {post.user.tier.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{post.user.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-200 mb-3">{post.content.text}</p>
                      
                      {/* Audio Player */}
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePlayAudio(post.id)}
                              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white"
                            >
                              {playingPost === post.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </motion.button>
                            <div>
                              <p className="text-white font-medium">{post.content.voiceName}</p>
                              <p className="text-gray-400 text-sm">{post.content.duration}s</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">{post.stats.plays.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Waveform Visualization */}
                        <div className="h-16 flex items-end space-x-1">
                          {post.content.waveform?.map((height, i) => (
                            <motion.div
                              key={i}
                              className={`w-1 rounded-full ${
                                playingPost === post.id ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 'bg-gray-600'
                              }`}
                              style={{ height: `${height * 60 + 10}%` }}
                              animate={playingPost === post.id ? {
                                scaleY: [1, 1.5, 1],
                              } : {}}
                              transition={{
                                duration: 0.5,
                                repeat: playingPost === post.id ? Infinity : 0,
                                delay: i * 0.05
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 ${
                            post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                          } transition-colors`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.stats.likes.toLocaleString()}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-sm">{post.stats.comments}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">{post.stats.shares}</span>
                        </motion.button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleBookmark(post.id)}
                          className={`p-2 rounded-full ${
                            post.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          } transition-colors`}
                        >
                          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Creators */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Top Creators
                </h2>
                
                <div className="space-y-4">
                  {topCreators.map((creator, index) => (
                    <div key={creator.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                            {creator.avatar}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="text-white font-medium text-sm">{creator.name}</p>
                            {creator.verified && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <p className="text-gray-400 text-xs">{creator.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFollow(creator.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          creator.isFollowing
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {creator.isFollowing ? 'Following' : 'Follow'}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trending Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Trending Tags
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {['storytelling', 'podcast', 'music', 'education', 'comedy', 'drama', 'audiobook', 'commercial'].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                  Community Stats
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Posts</span>
                    <span className="text-white font-semibold">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-semibold">3,421</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Plays</span>
                    <span className="text-white font-semibold">1.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Voices Used</span>
                    <span className="text-white font-semibold">43+</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Force server-side rendering to prevent prerendering errors
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CommunityPage;
