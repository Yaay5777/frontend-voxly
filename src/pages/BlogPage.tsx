import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Mic, Zap, Brain, Sparkles } from 'lucide-react';

const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Voice Synthesis: How AI is Revolutionizing Audio Content",
      excerpt: "Explore how artificial intelligence is transforming the way we create and consume audio content, from podcasts to audiobooks and beyond.",
      author: "Yahia Ahmed",
      date: "2024-01-15",
      category: "AI Technology",
      readTime: "5 min read",
      image: "🎤",
      featured: true
    },
    {
      id: 2,
      title: "Building Voxly: The Journey from Concept to Production",
      excerpt: "A behind-the-scenes look at how we built Voxly from the ground up, including the technical challenges and breakthroughs along the way.",
      author: "Development Team",
      date: "2024-01-10",
      category: "Company",
      readTime: "8 min read",
      image: "🚀",
      featured: true
    },
    {
      id: 3,
      title: "Voice Cloning Ethics: Responsible AI in Speech Synthesis",
      excerpt: "Discussing the ethical considerations and responsible practices in voice cloning technology and how we ensure user privacy and consent.",
      author: "AI Research Team",
      date: "2024-01-05",
      category: "Ethics",
      readTime: "6 min read",
      image: "🛡️",
      featured: false
    },
    {
      id: 4,
      title: "10 Creative Ways to Use AI Voice Generation in Your Projects",
      excerpt: "Discover innovative applications for AI-generated voices in content creation, education, accessibility, and entertainment.",
      author: "Yahia Ahmed",
      date: "2024-01-01",
      category: "Tutorials",
      readTime: "7 min read",
      image: "💡",
      featured: false
    },
    {
      id: 5,
      title: "The Science Behind Natural-Sounding AI Voices",
      excerpt: "Deep dive into the neural networks, training data, and algorithms that make modern AI voices sound increasingly human-like.",
      author: "AI Research Team",
      date: "2023-12-28",
      category: "Technology",
      readTime: "10 min read",
      image: "🧠",
      featured: false
    },
    {
      id: 6,
      title: "Accessibility and AI Voices: Breaking Down Barriers",
      excerpt: "How AI voice technology is making content more accessible for people with visual impairments and reading difficulties.",
      author: "Accessibility Team",
      date: "2023-12-20",
      category: "Accessibility",
      readTime: "4 min read",
      image: "♿",
      featured: false
    }
  ];

  const categories = ["All", "AI Technology", "Company", "Ethics", "Tutorials", "Technology", "Accessibility"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Voxly Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and updates from the world of AI voice synthesis
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-8 flex items-center"
        >
          <Sparkles className="mr-3 text-yellow-400" size={32} />
          Featured Posts
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {blogPosts.filter(post => post.featured).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/20"
            >
              <div className="p-8">
                <div className="text-6xl mb-6 text-center">{post.image}</div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="mr-2 text-blue-400" size={16} />
                    <span className="text-sm text-gray-400">{post.author}</span>
                    <Calendar className="ml-4 mr-2 text-green-400" size={16} />
                    <span className="text-sm text-gray-400">{post.date}</span>
                  </div>
                  <button className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                    Read More <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* All Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-8 flex items-center"
        >
          <Brain className="mr-3 text-blue-400" size={32} />
          Latest Articles
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/20"
            >
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{post.image}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-500/30 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-400">
                    <User className="mr-1" size={12} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="mr-1" size={12} />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <Mic className="mx-auto mb-6 text-purple-400" size={48} />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights on AI voice technology, 
            product updates, and exclusive tutorials.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center">
              Subscribe <Zap className="ml-2" size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
