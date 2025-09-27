import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Play, Book, Zap, Shield, Globe, Check } from 'lucide-react';

const ApiDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/synthesize',
      description: 'Generate high-quality AI voice synthesis',
      auth: true,
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to synthesize (max 10,000 characters)' },
        { name: 'speaker_idx', type: 'string', required: false, description: 'Voice ID (emma, liam, noah, olivia)' },
        { name: 'language', type: 'string', required: false, description: 'Language code (default: en)' },
        { name: 'speaker_wav', type: 'file', required: false, description: 'Custom voice file for cloning' }
      ],
      response: 'Audio file (WAV format)',
      example: `curl -X POST "https://api.voxly.ai/synthesize" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "text=Hello, this is a test of AI voice synthesis" \\
  -F "speaker_idx=emma" \\
  -F "language=en" \\
  --output audio.wav`
    },
    {
      method: 'POST',
      path: '/demo',
      description: 'Generate demo audio without authentication',
      auth: false,
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to synthesize (max 200 characters)' },
        { name: 'speaker_idx', type: 'string', required: false, description: 'Voice ID (emma, liam, noah, olivia)' },
        { name: 'language', type: 'string', required: false, description: 'Language code (default: en)' }
      ],
      response: 'Audio file (WAV format)',
      example: `curl -X POST "https://api.voxly.ai/demo" \\
  -H "Content-Type: multipart/form-data" \\
  -F "text=Hello, this is a demo" \\
  -F "speaker_idx=emma" \\
  --output demo.wav`
    },
    {
      method: 'GET',
      path: '/speakers',
      description: 'Get list of available voices',
      auth: false,
      parameters: [],
      response: 'JSON array of voice objects',
      example: `curl -X GET "https://api.voxly.ai/speakers" \\
  -H "Accept: application/json"`
    },
    {
      method: 'GET',
      path: '/quota',
      description: 'Get user quota information',
      auth: true,
      parameters: [],
      response: 'JSON object with quota details',
      example: `curl -X GET "https://api.voxly.ai/quota" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`
    }
  ];

  const sdkExamples = {
    javascript: `// Install: npm install voxly-sdk
import { VoxlyClient } from 'voxly-sdk';

const client = new VoxlyClient('YOUR_API_KEY');

// Synthesize text
const audio = await client.synthesize({
  text: 'Hello, world!',
  voice: 'emma',
  language: 'en'
});

// Save audio file
const blob = new Blob([audio], { type: 'audio/wav' });
const url = URL.createObjectURL(blob);`,
    python: `# Install: pip install voxly-python
from voxly import VoxlyClient

client = VoxlyClient('YOUR_API_KEY')

# Synthesize text
audio_data = client.synthesize(
    text="Hello, world!",
    voice="emma",
    language="en"
)

# Save audio file
with open('output.wav', 'wb') as f:
    f.write(audio_data)`,
    curl: `# Basic synthesis
curl -X POST "https://api.voxly.ai/synthesize" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "text=Hello, world!" \\
  -F "speaker_idx=emma" \\
  --output output.wav`
  };

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
              API Documentation
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Integrate Voxly's powerful voice synthesis into your applications with our simple REST API
            </p>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center">
                <Zap className="text-yellow-400 mr-2" size={24} />
                <span>Fast Integration</span>
              </div>
              <div className="flex items-center">
                <Shield className="text-green-400 mr-2" size={24} />
                <span>Secure</span>
              </div>
              <div className="flex items-center">
                <Globe className="text-blue-400 mr-2" size={24} />
                <span>RESTful</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <Book size={20} /> },
            { id: 'endpoints', label: 'Endpoints', icon: <Code size={20} /> },
            { id: 'examples', label: 'Examples', icon: <Play size={20} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Get Your API Key</h3>
                  <p className="text-gray-300 mb-4">
                    Sign up for a Voxly account and get your API key from the dashboard.
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                    <span className="text-gray-400">Your API Key:</span> voxly_sk_1234567890abcdef...
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Base URL</h3>
                  <p className="text-gray-300 mb-4">
                    All API requests should be made to:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                    https://api.voxly.ai
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Authentication</h3>
                  <p className="text-gray-300 mb-4">
                    Include your API key in the Authorization header:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <Zap className="text-yellow-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-3">Fast Response</h3>
                <p className="text-gray-300">
                  Generate high-quality audio in under 3 seconds with our optimized processing pipeline.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <Shield className="text-green-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
                <p className="text-gray-300">
                  Enterprise-grade security with 99.9% uptime SLA and encrypted data transmission.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <Globe className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-3">Global CDN</h3>
                <p className="text-gray-300">
                  Low-latency access worldwide with our distributed infrastructure and edge caching.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'endpoints' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${
                    endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-purple-400">{endpoint.path}</code>
                  {endpoint.auth && (
                    <span className="ml-4 px-2 py-1 bg-yellow-600/30 rounded text-sm">
                      Auth Required
                    </span>
                  )}
                </div>

                <p className="text-gray-300 mb-6">{endpoint.description}</p>

                {endpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left py-2 text-gray-300">Name</th>
                            <th className="text-left py-2 text-gray-300">Type</th>
                            <th className="text-left py-2 text-gray-300">Required</th>
                            <th className="text-left py-2 text-gray-300">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, paramIndex) => (
                            <tr key={paramIndex} className="border-b border-white/10">
                              <td className="py-2 font-mono text-purple-400">{param.name}</td>
                              <td className="py-2 text-gray-300">{param.type}</td>
                              <td className="py-2">
                                {param.required ? (
                                  <Check className="text-green-400" size={16} />
                                ) : (
                                  <span className="text-gray-500">Optional</span>
                                )}
                              </td>
                              <td className="py-2 text-gray-300">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-3">Response</h4>
                  <p className="text-gray-300">{endpoint.response}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">Example</h4>
                    <button
                      onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {copiedCode === `endpoint-${index}` ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                      <span className="ml-2">{copiedCode === `endpoint-${index}` ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">{endpoint.example}</pre>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'examples' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {Object.entries(sdkExamples).map(([language, code], index) => (
              <div key={language} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold capitalize">{language}</h3>
                  <button
                    onClick={() => copyToClipboard(code, language)}
                    className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {copiedCode === language ? (
                      <Check size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                    <span className="ml-2">{copiedCode === language ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">{code}</pre>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our developer support team is here to help you integrate Voxly into your applications.
          </p>
          <a 
            href="mailto:yahiaahmednabil@gmail.com"
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 inline-flex items-center"
          >
            Contact Developer Support
            <Code className="ml-2" size={20} />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocsPage;
