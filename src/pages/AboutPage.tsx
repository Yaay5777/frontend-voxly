import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap, Heart, Mail, MapPin } from 'lucide-react';

const AboutPage: React.FC = () => {
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
              About Voxly
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Revolutionizing voice synthesis with cutting-edge AI technology, making professional voice generation accessible to everyone.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6 flex items-center">
              <Target className="mr-4 text-purple-400" size={40} />
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              At Voxly, we believe that everyone should have access to high-quality voice synthesis technology. 
              Our mission is to democratize voice generation, enabling creators, businesses, and individuals to 
              bring their content to life with natural-sounding AI voices.
            </p>
            <p className="text-lg text-gray-300">
              We're building the future of voice technology, one synthesis at a time.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Zap className="mx-auto mb-4 text-yellow-400" size={40} />
              <h3 className="text-2xl font-bold mb-2">Fast</h3>
              <p className="text-gray-300">Lightning-fast voice generation in seconds</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Heart className="mx-auto mb-4 text-red-400" size={40} />
              <h3 className="text-2xl font-bold mb-2">Natural</h3>
              <p className="text-gray-300">Human-like voices with emotional depth</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 flex items-center justify-center">
            <Users className="mr-4 text-blue-400" size={40} />
            Our Team
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We're a passionate team of AI researchers, engineers, and voice technology experts 
            dedicated to pushing the boundaries of what's possible with synthetic speech.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
              YA
            </div>
            <h3 className="text-xl font-bold mb-2">Yahia Ahmed</h3>
            <p className="text-purple-400 mb-4">CEO & Founder</p>
            <p className="text-gray-300">
              Visionary leader driving innovation in AI voice technology and user experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
              AI
            </div>
            <h3 className="text-xl font-bold mb-2">AI Research Team</h3>
            <p className="text-blue-400 mb-4">Machine Learning Engineers</p>
            <p className="text-gray-300">
              Cutting-edge researchers developing the next generation of voice synthesis models.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
              DT
            </div>
            <h3 className="text-xl font-bold mb-2">Development Team</h3>
            <p className="text-green-400 mb-4">Full-Stack Engineers</p>
            <p className="text-gray-300">
              Expert developers building scalable, user-friendly voice generation platforms.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            Have questions about Voxly? We'd love to hear from you!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <Mail className="mr-3 text-purple-400" size={24} />
              <a 
                href="mailto:yahiaahmednabil@gmail.com" 
                className="text-lg hover:text-purple-400 transition-colors"
              >
                yahiaahmednabil@gmail.com
              </a>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-3 text-blue-400" size={24} />
              <span className="text-lg">Global Remote Team</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
