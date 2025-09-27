import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Code, 
  Book, 
  Play, 
  Copy, 
  Check, 
  ExternalLink,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Terminal,
  Zap,
  Key,
  Globe,
  Shield,
  Cpu,
  Database,
  Settings
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  parameters?: Parameter[];
  requestBody?: any;
  responses?: Response[];
  examples?: CodeExample[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

interface Response {
  status: number;
  description: string;
  example?: any;
}

interface CodeExample {
  language: string;
  code: string;
  title: string;
}

const ApiDocsPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('voices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));

  const categories = [
    { id: 'all', name: 'All Endpoints', color: '#8b5cf6' },
    { id: 'voices', name: 'Voices', color: '#3b82f6' },
    { id: 'synthesis', name: 'Synthesis', color: '#10b981' },
    { id: 'auth', name: 'Authentication', color: '#f59e0b' },
    { id: 'analytics', name: 'Analytics', color: '#ef4444' }
  ];

  const endpoints: ApiEndpoint[] = [
    {
      id: 'voices',
      method: 'GET',
      path: '/api/voices',
      title: 'Get All Voices',
      description: 'Retrieve a list of all available voices with their metadata',
      category: 'voices',
      parameters: [
        { name: 'category', type: 'string', required: false, description: 'Filter by voice category', example: 'professional' },
        { name: 'language', type: 'string', required: false, description: 'Filter by language', example: 'en-US' },
        { name: 'limit', type: 'number', required: false, description: 'Number of voices to return', example: 10 }
      ],
      responses: [
        { status: 200, description: 'Success', example: { voices: [], total: 43 } },
        { status: 400, description: 'Bad Request' },
        { status: 401, description: 'Unauthorized' }
      ],
      examples: [
        {
          language: 'javascript',
          title: 'Fetch Voices',
          code: `const response = await fetch('https://api.voxly.ai/voices', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.voices);`
        },
        {
          language: 'python',
          title: 'Python Example',
          code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.voxly.ai/voices', headers=headers)
voices = response.json()['voices']`
        }
      ]
    },
    {
      id: 'synthesize',
      method: 'POST',
      path: '/api/synthesize',
      title: 'Synthesize Speech',
      description: 'Convert text to speech using a selected voice',
      category: 'synthesis',
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to synthesize', example: 'Hello world!' },
        { name: 'voice_id', type: 'string', required: true, description: 'Voice ID to use', example: 'sarah-professional' },
        { name: 'speed', type: 'number', required: false, description: 'Speech speed (0.5-2.0)', example: 1.0 },
        { name: 'pitch', type: 'number', required: false, description: 'Voice pitch (0.5-2.0)', example: 1.0 }
      ],
      responses: [
        { status: 200, description: 'Success - Returns audio file URL' },
        { status: 400, description: 'Invalid parameters' },
        { status: 401, description: 'Unauthorized' },
        { status: 429, description: 'Rate limit exceeded' }
      ],
      examples: [
        {
          language: 'javascript',
          title: 'Synthesize Text',
          code: `const response = await fetch('https://api.voxly.ai/synthesize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello, welcome to Voxly!',
    voice_id: 'sarah-professional',
    speed: 1.0,
    pitch: 1.0
  })
});

const result = await response.json();
console.log('Audio URL:', result.audio_url);`
        }
      ]
    }
  ];

  const quickStart = {
    steps: [
      {
        title: 'Get API Key',
        description: 'Sign up and get your API key from the dashboard',
        code: 'API_KEY="your_api_key_here"'
      },
      {
        title: 'Make First Request',
        description: 'Test the API with a simple voices request',
        code: `curl -H "Authorization: Bearer $API_KEY" \\
     https://api.voxly.ai/voices`
      },
      {
        title: 'Synthesize Speech',
        description: 'Convert your first text to speech',
        code: `curl -X POST \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Hello World","voice_id":"sarah-professional"}' \\
  https://api.voxly.ai/synthesize`
      }
    ]
  };

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={Math.min(window.devicePixelRatio, 2)}
          gl={{ 
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true
          }}
          camera={{
            position: [0, 5, 15],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
        >
          <Scene3D environment="cyber" performance="high">
            <AudioVisualizer3D
              isPlaying={false}
              type="particles"
              color="#10b981"
              intensity={0.5}
              size={1.2}
            />
          </Scene3D>
        </Canvas>
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
                  API Documentation
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Complete guide to integrating Voxly's voice synthesis API into your applications
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Navigation</h2>
                
                {/* Getting Started */}
                <div className="mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleSection('getting-started')}
                    className="flex items-center justify-between w-full text-left text-white font-medium mb-3"
                  >
                    <span>Getting Started</span>
                    {expandedSections.has('getting-started') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </motion.button>
                  
                  <AnimatePresence>
                    {expandedSections.has('getting-started') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 ml-4"
                      >
                        {quickStart.steps.map((step, index) => (
                          <button
                            key={index}
                            className="block text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            {step.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* API Endpoints */}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleSection('endpoints')}
                    className="flex items-center justify-between w-full text-left text-white font-medium mb-3"
                  >
                    <span>API Endpoints</span>
                    {expandedSections.has('endpoints') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </motion.button>
                  
                  <AnimatePresence>
                    {expandedSections.has('endpoints') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 ml-4"
                      >
                        {filteredEndpoints.map((endpoint) => (
                          <motion.button
                            key={endpoint.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedEndpoint(endpoint.id)}
                            className={`block w-full text-left text-sm transition-colors ${
                              selectedEndpoint === endpoint.id
                                ? 'text-green-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className={`inline-block w-12 text-xs font-mono mr-2 ${
                              endpoint.method === 'GET' ? 'text-blue-400' :
                              endpoint.method === 'POST' ? 'text-green-400' :
                              endpoint.method === 'PUT' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {endpoint.method}
                            </span>
                            {endpoint.title}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Main Documentation Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedEndpoint === 'getting-started' ? (
                  <motion.div
                    key="getting-started"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <h2 className="text-3xl font-bold text-white mb-6">Quick Start Guide</h2>
                      
                      {quickStart.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-8 last:mb-0"
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                              <p className="text-gray-400">{step.description}</p>
                            </div>
                          </div>
                          
                          <div className="bg-black/50 rounded-xl p-4 relative">
                            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                              <code>{step.code}</code>
                            </pre>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(step.code, `step-${index}`)}
                              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                            >
                              {copiedCode === `step-${index}` ? 
                                <Check className="w-4 h-4 text-green-400" /> : 
                                <Copy className="w-4 h-4 text-gray-400" />
                              }
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : selectedEndpointData ? (
                  <motion.div
                    key={selectedEndpoint}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="space-y-8"
                  >
                    {/* Endpoint Header */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                          selectedEndpointData.method === 'GET' ? 'bg-blue-600 text-white' :
                          selectedEndpointData.method === 'POST' ? 'bg-green-600 text-white' :
                          selectedEndpointData.method === 'PUT' ? 'bg-yellow-600 text-black' :
                          'bg-red-600 text-white'
                        }`}>
                          {selectedEndpointData.method}
                        </span>
                        <code className="text-lg font-mono text-green-400">{selectedEndpointData.path}</code>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-white mb-4">{selectedEndpointData.title}</h2>
                      <p className="text-gray-300 text-lg">{selectedEndpointData.description}</p>
                    </div>

                    {/* Parameters */}
                    {selectedEndpointData.parameters && (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">Parameters</h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/20">
                                <th className="text-left py-3 text-white font-semibold">Name</th>
                                <th className="text-left py-3 text-white font-semibold">Type</th>
                                <th className="text-left py-3 text-white font-semibold">Required</th>
                                <th className="text-left py-3 text-white font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedEndpointData.parameters.map((param, index) => (
                                <tr key={index} className="border-b border-white/10">
                                  <td className="py-3 text-green-400 font-mono">{param.name}</td>
                                  <td className="py-3 text-blue-400 font-mono">{param.type}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      param.required ? 'bg-red-600/20 text-red-400' : 'bg-gray-600/20 text-gray-400'
                                    }`}>
                                      {param.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="py-3 text-gray-300">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Code Examples */}
                    {selectedEndpointData.examples && (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">Code Examples</h3>
                        
                        <div className="space-y-6">
                          {selectedEndpointData.examples.map((example, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-white">{example.title}</h4>
                                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-sm font-mono">
                                  {example.language}
                                </span>
                              </div>
                              
                              <div className="bg-black/50 rounded-xl p-4 relative">
                                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(example.code, `example-${index}`)}
                                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                                >
                                  {copiedCode === `example-${index}` ? 
                                    <Check className="w-4 h-4 text-green-400" /> : 
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  }
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    {selectedEndpointData.responses && (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6">Responses</h3>
                        
                        <div className="space-y-4">
                          {selectedEndpointData.responses.map((response, index) => (
                            <div key={index} className="border border-white/20 rounded-xl p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={`px-3 py-1 rounded text-sm font-bold ${
                                  response.status < 300 ? 'bg-green-600 text-white' :
                                  response.status < 400 ? 'bg-yellow-600 text-black' :
                                  'bg-red-600 text-white'
                                }`}>
                                  {response.status}
                                </span>
                                <span className="text-white font-medium">{response.description}</span>
                              </div>
                              
                              {response.example && (
                                <div className="bg-black/30 rounded-lg p-3 mt-3">
                                  <pre className="text-blue-400 font-mono text-sm">
                                    <code>{JSON.stringify(response.example, null, 2)}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
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

export default ApiDocsPage;
