import React, { Suspense, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  Globe, 
  Heart,
  Rocket,
  Star,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Trophy,
  ArrowRight,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { Avatar3D } from '../3d/Avatar3D';
import { useScene3DStore } from '../hooks/use3D';

const AboutPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('story');

  // Company values with 3D visualization
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing the boundaries of AI voice technology with revolutionary 3D experiences",
      color: "#f59e0b",
      position: [4, 2, 0] as [number, number, number]
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making advanced voice synthesis accessible to creators worldwide",
      color: "#ef4444",
      position: [-4, 2, 0] as [number, number, number]
    },
    {
      icon: Shield,
      title: "Quality",
      description: "Delivering premium voice quality with cutting-edge AI technology",
      color: "#10b981",
      position: [0, 4, -2] as [number, number, number]
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Connecting cultures through multilingual voice synthesis",
      color: "#3b82f6",
      position: [0, 0, 4] as [number, number, number]
    }
  ];

  // Team members with 3D avatars
  const teamMembers = [
    {
      id: 'ceo',
      name: 'Alex Chen',
      role: 'CEO & Founder',
      avatar: '👨‍💼',
      bio: 'Visionary leader with 15+ years in AI and voice technology',
      specialties: ['AI Strategy', 'Product Vision', 'Team Leadership'],
      social: { linkedin: '#', twitter: '#' },
      color: '#8b5cf6'
    },
    {
      id: 'cto',
      name: 'Sarah Rodriguez',
      role: 'CTO & Co-Founder',
      avatar: '👩‍💻',
      bio: 'Technical genius behind our revolutionary 3D voice synthesis platform',
      specialties: ['3D Graphics', 'AI Engineering', 'System Architecture'],
      social: { linkedin: '#', github: '#' },
      color: '#ec4899'
    },
    {
      id: 'head-ai',
      name: 'Dr. Marcus Johnson',
      role: 'Head of AI Research',
      avatar: '🧠',
      bio: 'PhD in Machine Learning, pioneering next-gen voice synthesis algorithms',
      specialties: ['Deep Learning', 'Voice AI', 'Research'],
      social: { linkedin: '#', twitter: '#' },
      color: '#10b981'
    },
    {
      id: 'head-design',
      name: 'Luna Martinez',
      role: 'Head of Design',
      avatar: '🎨',
      bio: 'Creative director crafting beautiful and intuitive user experiences',
      specialties: ['3D Design', 'UX/UI', 'Creative Direction'],
      social: { linkedin: '#', twitter: '#' },
      color: '#f59e0b'
    }
  ];

  // Company milestones
  const milestones = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize voice synthesis',
      icon: Rocket,
      color: '#8b5cf6'
    },
    {
      year: '2023',
      title: 'First 3D Voice Interface',
      description: 'Launched the world\'s first 3D voice synthesis platform',
      icon: Sparkles,
      color: '#ec4899'
    },
    {
      year: '2024',
      title: '43+ Voices Library',
      description: 'Expanded to comprehensive international voice collection',
      icon: Globe,
      color: '#10b981'
    },
    {
      year: '2024',
      title: '10K+ Users',
      description: 'Reached milestone of 10,000 active creators',
      icon: Users,
      color: '#f59e0b'
    }
  ];

  const sections = [
    { id: 'story', label: 'Our Story', icon: Heart },
    { id: 'mission', label: 'Mission & Values', icon: Target },
    { id: 'team', label: 'Meet the Team', icon: Users },
    { id: 'journey', label: 'Our Journey', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="nature" performance="high">
          <AudioVisualizer3D
            isPlaying={false}
            type="particles"
            color="#10b981"
            intensity={0.8}
            size={2}
          />
          
          {/* 3D Value Representations */}
          <Suspense fallback={null}>
            {values.map((value, index) => (
              <Avatar3D
                key={index}
                voice={{
                  id: `value-${index}`,
                  name: value.title,
                  avatar: '✨',
                  color: value.color,
                  category: 'concept'
                }}
                position={value.position}
                isActive={false}
                isSpeaking={false}
              />
            ))}
          </Suspense>
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
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  About Voxly
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Pioneering the future of voice synthesis with revolutionary 3D technology
              </p>
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap justify-center gap-4">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all backdrop-blur-sm ${
                      isActive
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {/* Our Story Section */}
            {activeSection === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="py-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-white mb-6">
                      Revolutionizing Voice Synthesis
                    </h2>
                    <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                      <p>
                        Voxly was born from a simple yet ambitious vision: to make advanced AI voice 
                        synthesis accessible to everyone while pushing the boundaries of what's possible 
                        with immersive 3D technology.
                      </p>
                      <p>
                        Our journey began when our founders realized that traditional voice synthesis 
                        platforms lacked the visual and interactive elements that could truly engage users. 
                        We set out to create not just another TTS service, but a complete 3D experience 
                        that brings voices to life.
                      </p>
                      <p>
                        Today, Voxly stands as the world's first and most advanced 3D voice synthesis 
                        platform, featuring 43+ unique voices, immersive environments, and cutting-edge 
                        AI technology that delivers unprecedented quality and user experience.
                      </p>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                  >
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                      <p className="text-gray-300 leading-relaxed">
                        "To create a world where anyone can bring their words to life through 
                        beautiful, immersive voice experiences that transcend traditional boundaries."
                      </p>
                      <div className="flex justify-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">43+</div>
                          <div className="text-sm text-gray-400">Voices</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">15+</div>
                          <div className="text-sm text-gray-400">Languages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">10K+</div>
                          <div className="text-sm text-gray-400">Users</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Mission & Values Section */}
            {activeSection === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="py-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-6">Our Mission & Values</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Guided by core principles that drive innovation and excellence
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all group"
                      >
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${value.color}20` }}
                        >
                          <Icon className="w-8 h-8" style={{ color: value.color }} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{value.description}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mission Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-md rounded-3xl p-12 border border-white/20 text-center"
                >
                  <Target className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                    To democratize advanced voice synthesis technology by creating the most intuitive, 
                    powerful, and visually stunning platform that empowers creators, educators, and 
                    innovators to bring their ideas to life through the magic of AI-generated voices 
                    in immersive 3D environments.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="py-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-6">Meet Our Team</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    The brilliant minds behind Voxly's revolutionary technology
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="flex items-start space-x-6">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${member.color}20` }}
                        >
                          {member.avatar}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                          <p className="text-lg font-medium mb-3" style={{ color: member.color }}>
                            {member.role}
                          </p>
                          <p className="text-gray-300 mb-4 leading-relaxed">{member.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {member.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="px-3 py-1 text-sm rounded-full"
                                style={{ 
                                  backgroundColor: `${member.color}20`, 
                                  color: member.color 
                                }}
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex space-x-3">
                            {member.social.linkedin && (
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={member.social.linkedin}
                                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                <Linkedin className="w-4 h-4" />
                              </motion.a>
                            )}
                            {member.social.twitter && (
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={member.social.twitter}
                                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                <Twitter className="w-4 h-4" />
                              </motion.a>
                            )}
                            {member.social.github && (
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={member.social.github}
                                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                              >
                                <Github className="w-4 h-4" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Journey Section */}
            {activeSection === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="py-12"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-6">Our Journey</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Key milestones in our mission to revolutionize voice synthesis
                  </p>
                </div>

                <div className="space-y-8">
                  {milestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`flex items-center gap-8 ${
                          index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        <div className="flex-1">
                          <motion.div
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all"
                          >
                            <div className="flex items-center space-x-4 mb-4">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${milestone.color}20` }}
                              >
                                <Icon className="w-6 h-6" style={{ color: milestone.color }} />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-white">{milestone.title}</div>
                                <div className="text-lg font-medium" style={{ color: milestone.color }}>
                                  {milestone.year}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                          </motion.div>
                        </div>
                        
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                        
                        <div className="flex-1" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Join Our Mission
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Be part of the voice synthesis revolution. Experience the future of AI-powered creativity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-green-500/25 flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Join Community</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
