import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  Search,
  Filter,
  Building,
  Globe,
  Zap,
  Coffee,
  Gamepad2,
  Plane,
  GraduationCap,
  Award,
  Target,
  Rocket
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  featured?: boolean;
}

interface CompanyValue {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  const departments = [
    { id: 'all', name: 'All Departments', color: '#8b5cf6' },
    { id: 'engineering', name: 'Engineering', color: '#3b82f6' },
    { id: 'ai-research', name: 'AI Research', color: '#10b981' },
    { id: 'product', name: 'Product', color: '#f59e0b' },
    { id: 'design', name: 'Design', color: '#ef4444' },
    { id: 'marketing', name: 'Marketing', color: '#8b5cf6' },
    { id: 'sales', name: 'Sales', color: '#06b6d4' }
  ];

  const companyValues: CompanyValue[] = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible in voice AI technology',
      color: '#3b82f6'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborative Culture',
      description: 'We believe the best ideas come from diverse teams working together',
      color: '#10b981'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Impact Driven',
      description: 'Every project we work on has the potential to change how people interact with technology',
      color: '#f59e0b'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'People First',
      description: 'We prioritize the well-being and growth of our team members above all else',
      color: '#ef4444'
    }
  ];

  const benefits: Benefit[] = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Competitive Salary',
      description: 'Top-tier compensation packages with equity options',
      color: '#10b981'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and unlimited PTO',
      color: '#f59e0b'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Learning Budget',
      description: '$5,000 annual budget for courses, conferences, and books',
      color: '#3b82f6'
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: 'Travel Stipend',
      description: 'Annual travel allowance for team retreats and conferences',
      color: '#8b5cf6'
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: 'Wellness Program',
      description: 'Gym memberships, mental health support, and team activities',
      color: '#ef4444'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Stock Options',
      description: 'Equity participation in our growing company',
      color: '#06b6d4'
    }
  ];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Mock job data
      const mockJobs: JobListing[] = [
        {
          id: '1',
          title: 'Senior AI Engineer',
          department: 'ai-research',
          location: 'San Francisco, CA / Remote',
          type: 'full-time',
          experience: '5+ years',
          salary: '$180k - $250k',
          description: 'Join our AI research team to develop cutting-edge voice synthesis models and push the boundaries of what\'s possible in artificial intelligence.',
          requirements: [
            'PhD or Masters in Computer Science, AI, or related field',
            '5+ years experience in machine learning and deep learning',
            'Experience with PyTorch, TensorFlow, or similar frameworks',
            'Strong background in NLP and speech processing',
            'Published research in top-tier conferences (ICML, NeurIPS, etc.)'
          ],
          benefits: [
            'Competitive salary and equity',
            'Flexible work arrangements',
            'Top-tier health insurance',
            'Learning and development budget'
          ],
          posted: '2 days ago',
          featured: true
        },
        {
          id: '2',
          title: 'Frontend Engineer',
          department: 'engineering',
          location: 'New York, NY / Remote',
          type: 'full-time',
          experience: '3+ years',
          salary: '$120k - $180k',
          description: 'Build beautiful, responsive user interfaces for our voice synthesis platform using React, TypeScript, and cutting-edge 3D technologies.',
          requirements: [
            'Bachelor\'s degree in Computer Science or equivalent experience',
            '3+ years of React and TypeScript experience',
            'Experience with Three.js or other 3D libraries',
            'Strong understanding of modern web technologies',
            'Experience with state management (Redux, Zustand, etc.)'
          ],
          benefits: [
            'Competitive salary and equity',
            'Remote-first culture',
            'Latest MacBook Pro and equipment',
            'Unlimited PTO'
          ],
          posted: '1 week ago'
        },
        {
          id: '3',
          title: 'Product Designer',
          department: 'design',
          location: 'London, UK / Remote',
          type: 'full-time',
          experience: '4+ years',
          salary: '£60k - £90k',
          description: 'Design intuitive and beautiful user experiences for our voice AI platform, working closely with engineering and product teams.',
          requirements: [
            'Bachelor\'s degree in Design, HCI, or related field',
            '4+ years of product design experience',
            'Proficiency in Figma, Sketch, or similar tools',
            'Experience with design systems and component libraries',
            'Strong portfolio showcasing UX/UI design work'
          ],
          benefits: [
            'Competitive salary and equity',
            'Design conference budget',
            'Latest design tools and software',
            'Flexible working hours'
          ],
          posted: '3 days ago'
        }
      ];

      setJobs(mockJobs);
      toast.success('Jobs loaded successfully!');
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleApply = (job: JobListing) => {
    toast.success(`Application started for ${job.title}!`);
    // In a real app, this would redirect to application form
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading Careers...</p>
        </div>
      </div>
    );
  }

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
          <Scene3D environment="space" performance="high">
            <AudioVisualizer3D
              isPlaying={false}
              type="circular"
              color="#8b5cf6"
              intensity={0.6}
              size={1.8}
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
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Join Our Team
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Help us build the future of voice AI technology. Work with brilliant minds on cutting-edge projects that impact millions of users worldwide.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => {
                  const isActive = selectedDepartment === dept.id;
                  
                  return (
                    <motion.button
                      key={dept.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isActive ? dept.color : undefined,
                        boxShadow: isActive ? `0 0 20px ${dept.color}40` : undefined
                      }}
                    >
                      <span className="text-sm font-medium">{dept.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Company Values */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-xl text-gray-300">What drives us every day</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${value.color}20` }}
                  >
                    <div style={{ color: value.color }}>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Work With Us</h2>
              <p className="text-xl text-gray-300">Comprehensive benefits and perks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${benefit.color}20` }}
                    >
                      <div style={{ color: benefit.color }}>
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Job Listings */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-white">Open Positions</h2>
              <div className="text-gray-400">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No positions found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border transition-all cursor-pointer ${
                      job.featured 
                        ? 'border-purple-500/50 shadow-lg shadow-purple-500/25' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    {job.featured && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Featured Position</span>
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                          <span 
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${departments.find(d => d.id === job.department)?.color || '#8b5cf6'}20`,
                              color: departments.find(d => d.id === job.department)?.color || '#8b5cf6'
                            }}
                          >
                            {departments.find(d => d.id === job.department)?.name || job.department}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{job.description}</p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="capitalize">{job.type.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 lg:mt-0 lg:ml-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg flex items-center space-x-2"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Don't See Your Dream Role?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your resume and let us know how you'd like to contribute to the future of voice AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Send General Application</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Join Our Talent Network</span>
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Job Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedJob(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span>{selectedJob.location}</span>
                      <span>•</span>
                      <span className="capitalize">{selectedJob.type.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{selectedJob.experience}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Job Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">What We Offer</h3>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApply(selectedJob)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>Apply for this Position</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-xl font-semibold border border-white/20 flex items-center justify-center space-x-2"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Save Job</span>
                    </motion.button>
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

// Force server-side rendering to prevent prerendering errors
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CareersPage;
