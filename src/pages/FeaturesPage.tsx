import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Zap, 
  Brain, 
  Globe, 
  Shield, 
  Sparkles, 
  Users, 
  Download, 
  Code, 
  Clock,
  Star,
  Heart,
  Volume2,
  Headphones,
  FileAudio,
  BarChart3
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: <Brain className="text-purple-400" size={48} />,
      title: "Advanced AI Models",
      description: "State-of-the-art neural networks trained on diverse voice data for natural-sounding speech synthesis.",
      features: [
        "Deep learning architecture",
        "Continuous model improvements",
        "Multi-language support",
        "Emotion and tone control"
      ]
    },
    {
      icon: <Mic className="text-blue-400" size={48} />,
      title: "Voice Cloning",
      description: "Create custom voices from audio samples with just a few minutes of training data.",
      features: [
        "Quick voice cloning",
        "High-quality reproduction",
        "Custom voice library",
        "Voice mixing capabilities"
      ],
      premium: true
    },
    {
      icon: <Zap className="text-yellow-400" size={48} />,
      title: "Lightning Fast",
      description: "Generate high-quality audio in seconds with our optimized processing pipeline.",
      features: [
        "Sub-3 second generation",
        "Real-time synthesis",
        "Batch processing",
        "Priority queuing"
      ]
    },
    {
      icon: <Globe className="text-green-400" size={48} />,
      title: "Multi-Language",
      description: "Support for 50+ languages and accents with native pronunciation and intonation.",
      features: [
        "50+ languages",
        "Regional accents",
        "Pronunciation control",
        "Cross-language voices"
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: <FileAudio className="text-purple-400" size={32} />,
      title: "High-Quality Audio",
      description: "Studio-grade 44.1kHz audio output with multiple format options",
      specs: ["44.1kHz sample rate", "16-bit depth", "WAV, MP3, OGG formats", "Lossless compression"]
    },
    {
      icon: <Code className="text-blue-400" size={32} />,
      title: "Developer-Friendly API",
      description: "RESTful API with comprehensive documentation and SDKs",
      specs: ["REST API", "Python & JS SDKs", "Webhook support", "Rate limiting"]
    },
    {
      icon: <Shield className="text-green-400" size={32} />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption and compliance",
      specs: ["End-to-end encryption", "SOC 2 compliant", "GDPR ready", "99.9% uptime SLA"]
    },
    {
      icon: <BarChart3 className="text-yellow-400" size={32} />,
      title: "Advanced Controls",
      description: "Fine-tune voice characteristics and speech parameters",
      specs: ["Speed control", "Pitch adjustment", "Emphasis markers", "Pause insertion"]
    }
  ];

  const useCases = [
    {
      icon: <Volume2 className="text-red-400" size={40} />,
      title: "Content Creation",
      description: "Perfect for podcasts, YouTube videos, audiobooks, and educational content.",
      examples: ["Podcast narration", "Video voiceovers", "Audiobook production", "E-learning courses"]
    },
    {
      icon: <Users className="text-blue-400" size={40} />,
      title: "Business Applications",
      description: "Enhance customer experience with AI-powered voice solutions.",
      examples: ["IVR systems", "Customer service", "Marketing videos", "Product demos"]
    },
    {
      icon: <Headphones className="text-green-400" size={40} />,
      title: "Accessibility",
      description: "Make content accessible to visually impaired users and reading difficulties.",
      examples: ["Screen readers", "Audio descriptions", "Reading assistance", "Language learning"]
    },
    {
      icon: <Sparkles className="text-purple-400" size={40} />,
      title: "Creative Projects",
      description: "Bring characters to life in games, animations, and interactive media.",
      examples: ["Game characters", "Animation voices", "Interactive stories", "Virtual assistants"]
    }
  ];

  const voiceGallery = [
    {
      name: "Emma",
      description: "Professional female voice, perfect for business and educational content",
      accent: "American English",
      age: "Young Adult",
      personality: "Professional, Clear"
    },
    {
      name: "Liam",
      description: "Warm male voice ideal for storytelling and narration",
      accent: "British English",
      age: "Adult",
      personality: "Warm, Engaging"
    },
    {
      name: "Noah",
      description: "Deep, authoritative voice for documentaries and presentations",
      accent: "American English",
      age: "Mature",
      personality: "Authoritative, Deep"
    },
    {
      name: "Olivia",
      description: "Energetic female voice perfect for marketing and entertainment",
      accent: "Australian English",
      age: "Young Adult",
      personality: "Energetic, Friendly"
    }
  ];

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
              Powerful Features
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover the cutting-edge capabilities that make Voxly the leading AI voice synthesis platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Core Capabilities</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Advanced AI technology meets intuitive design for professional voice synthesis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center mb-6">
                {feature.icon}
                <h3 className="text-2xl font-bold ml-4">{feature.title}</h3>
                {feature.premium && (
                  <div className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Star className="mr-1" size={12} />
                    PREMIUM
                  </div>
                )}
              </div>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <Star className="text-yellow-400 mr-3" size={16} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Technical Excellence</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Built for developers and enterprises with robust infrastructure and advanced controls
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300 mb-4 text-sm">{feature.description}</p>
              <ul className="space-y-1">
                {feature.specs.map((spec, specIndex) => (
                  <li key={specIndex} className="text-xs text-gray-400 flex items-center">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2" />
                    {spec}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Voice Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 flex items-center justify-center">
            <Mic className="mr-4 text-purple-400" size={40} />
            Voice Gallery
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Choose from our collection of professional AI voices, each with unique characteristics and personalities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {voiceGallery.map((voice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
                  {voice.name[0]}
                </div>
                <h3 className="text-xl font-bold">{voice.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Accent:</span>
                  <span className="text-gray-300">{voice.accent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Age:</span>
                  <span className="text-gray-300">{voice.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Style:</span>
                  <span className="text-gray-300">{voice.personality}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-4">{voice.description}</p>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center">
                <Volume2 className="mr-2" size={16} />
                Try Voice
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Use Cases</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover how Voxly can transform your projects across industries and applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center mb-6">
                {useCase.icon}
                <h3 className="text-2xl font-bold ml-4">{useCase.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{useCase.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {useCase.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="flex items-center">
                    <Heart className="text-red-400 mr-2" size={14} />
                    <span className="text-sm text-gray-300">{example}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Voxly?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Start creating professional AI voices today with our free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center">
              Start Free Trial
              <Zap className="ml-2" size={20} />
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 transition-all duration-300 flex items-center">
              View Pricing
              <Download className="ml-2" size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;
