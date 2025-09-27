import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Heart,
  ArrowUp,
  Shield,
  Globe,
  Zap
} from 'lucide-react';

const Footer3D: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Voices', path: '/voices' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'API Docs', path: '/api-docs' },
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Community', path: '/community' },
      { name: 'Status', path: '/status' },
      { name: 'Security', path: '/security' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' },
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/voxly', color: '#1da1f2' },
    { name: 'GitHub', icon: <Github className="w-5 h-5" />, url: 'https://github.com/voxly', color: '#333' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com/company/voxly', color: '#0077b5' },
    { name: 'Email', icon: <Mail className="w-5 h-5" />, url: 'mailto:hello@voxly.ai', color: '#ea4335' },
  ];

  const stats = [
    { label: 'Voices Generated', value: '1M+', icon: <Sparkles className="w-5 h-5" />, color: '#3b82f6' },
    { label: 'Languages', value: '25+', icon: <Globe className="w-5 h-5" />, color: '#10b981' },
    { label: 'Users Worldwide', value: '50K+', icon: <Zap className="w-5 h-5" />, color: '#f59e0b' },
    { label: 'Uptime', value: '99.9%', icon: <Shield className="w-5 h-5" />, color: '#8b5cf6' },
  ];

  return (
    <footer className="relative bg-black/50 backdrop-blur-xl border-t border-white/10 mt-20">
      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="absolute -top-6 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <div style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">Voxly</h3>
                  <p className="text-xs text-gray-400">Voice AI Revolution</p>
                </div>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionizing voice synthesis with cutting-edge AI technology. 
                Create natural, expressive voices for any application.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    style={{ '--hover-color': social.color } as React.CSSProperties}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Voxly
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on new voices, features, and AI breakthroughs delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4 md:mb-0">
            <span>© 2024 Voxly. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>for the future of voice AI</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div>Version 2.1.0</div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4 + i, 
            repeat: Infinity, 
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          className={`absolute w-${2 + i} h-${2 + i} bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full`}
          style={{
            top: `${20 + i * 15}%`,
            right: `${5 + i * 10}%`,
          }}
        />
      ))}
    </footer>
  );
};

export default Footer3D;
