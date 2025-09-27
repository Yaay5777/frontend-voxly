import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowRight,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  TrendingUp,
  Star,
  Eye,
  Bookmark
} from 'lucide-react';

import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  coverImage?: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = [
    { id: 'all', name: 'All Posts', color: '#8b5cf6' },
    { id: 'ai-technology', name: 'AI Technology', color: '#3b82f6' },
    { id: 'voice-synthesis', name: 'Voice Synthesis', color: '#10b981' },
    { id: 'tutorials', name: 'Tutorials', color: '#f59e0b' },
    { id: 'company-news', name: 'Company News', color: '#ef4444' },
    { id: 'industry-insights', name: 'Industry Insights', color: '#8b5cf6' }
  ];

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    setLoading(true);
    try {
      // Mock blog posts data
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Voice Synthesis: How 3D Technology is Revolutionizing AI Voices',
          excerpt: 'Explore how our revolutionary 3D interface is transforming the way users interact with AI voice technology.',
          content: 'Full article content...',
          author: {
            name: 'Sarah Chen',
            avatar: '👩‍💻',
            role: 'CTO & Co-Founder'
          },
          publishedAt: '2024-01-15T10:00:00Z',
          readTime: 8,
          category: 'ai-technology',
          tags: ['AI', '3D Technology', 'Voice Synthesis', 'Innovation'],
          featured: true,
          stats: {
            views: 15420,
            likes: 892,
            comments: 156,
            shares: 234
          }
        },
        {
          id: '2',
          title: 'Building Immersive Voice Experiences: A Developer\'s Guide',
          excerpt: 'Learn how to integrate Voxly\'s 3D voice synthesis API into your applications for stunning user experiences.',
          content: 'Full article content...',
          author: {
            name: 'Marcus Rodriguez',
            avatar: '👨‍💼',
            role: 'Lead Developer'
          },
          publishedAt: '2024-01-12T14:30:00Z',
          readTime: 12,
          category: 'tutorials',
          tags: ['API', 'Development', 'Integration', 'Tutorial'],
          featured: false,
          stats: {
            views: 8930,
            likes: 445,
            comments: 89,
            shares: 123
          }
        }
      ];

      setPosts(mockPosts);
      toast.success('Blog posts loaded!');
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading Blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="studio" performance="high">
          <AudioVisualizer3D
            isPlaying={false}
            type="waveform"
            color="#f59e0b"
            intensity={0.6}
            size={1.5}
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
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  Voxly Blog
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Insights, tutorials, and updates from the world of 3D voice synthesis
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isActive ? category.color : undefined,
                        boxShadow: isActive ? `0 0 20px ${category.color}40` : undefined
                      }}
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Featured Post */}
          {featuredPost && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Featured Article</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{featuredPost.author.avatar}</span>
                        <span>{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime} min read</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPost(featuredPost)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 flex items-center space-x-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Read Article</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{featuredPost.stats.views.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{featuredPost.stats.likes}</div>
                        <div className="text-sm text-gray-400">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{featuredPost.stats.comments}</div>
                        <div className="text-sm text-gray-400">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{featuredPost.stats.shares}</div>
                        <div className="text-sm text-gray-400">Shares</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Regular Posts Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
              <div className="text-gray-400">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {regularPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No articles found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span 
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${categories.find(cat => cat.id === post.category)?.color || '#8b5cf6'}20`,
                            color: categories.find(cat => cat.id === post.category)?.color || '#8b5cf6'
                          }}
                        >
                          {categories.find(cat => cat.id === post.category)?.name || 'Article'}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>{post.stats.views.toLocaleString()}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{post.author.avatar}</span>
                          <div>
                            <div className="text-sm font-medium text-white">{post.author.name}</div>
                            <div className="text-xs text-gray-400">{post.author.role}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.stats.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Article Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">{selectedPost.title}</h2>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{selectedPost.author.avatar}</span>
                      <span>{selectedPost.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readTime} min read</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    {selectedPost.excerpt}
                  </p>

                  <div className="bg-white/5 rounded-xl p-6">
                    <p className="text-gray-300 leading-relaxed">
                      This is where the full article content would be displayed. 
                      The article would include detailed information about {selectedPost.title.toLowerCase()}, 
                      with code examples, images, and interactive elements to enhance the reading experience.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-orange-500/20 text-orange-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>{selectedPost.stats.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{selectedPost.stats.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;
