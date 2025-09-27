import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Users, Zap, Heart, Star, Mail, ArrowRight } from 'lucide-react';

const CareersPage: React.FC = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior AI Research Engineer",
      department: "AI Research",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "Lead the development of next-generation voice synthesis models and neural networks.",
      requirements: [
        "PhD in Machine Learning, Computer Science, or related field",
        "5+ years experience with deep learning frameworks (PyTorch, TensorFlow)",
        "Experience with speech synthesis and audio processing",
        "Strong publication record in top-tier conferences"
      ],
      featured: true
    },
    {
      id: 2,
      title: "Full-Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$90k - $140k",
      description: "Build and maintain our web platform, API services, and user interfaces.",
      requirements: [
        "3+ years experience with React, TypeScript, and Node.js",
        "Experience with cloud platforms (AWS, GCP, Azure)",
        "Knowledge of database design and optimization",
        "Passion for clean, scalable code"
      ],
      featured: true
    },
    {
      id: 3,
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      salary: "$80k - $120k",
      description: "Design intuitive user experiences for our voice synthesis platform.",
      requirements: [
        "3+ years experience in product design",
        "Proficiency in Figma, Sketch, or similar tools",
        "Experience with user research and testing",
        "Portfolio showcasing complex product design"
      ],
      featured: false
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $150k",
      description: "Scale our infrastructure to handle millions of voice synthesis requests.",
      requirements: [
        "Experience with Kubernetes, Docker, and CI/CD",
        "Knowledge of cloud infrastructure and monitoring",
        "Experience with high-availability systems",
        "Strong automation and scripting skills"
      ],
      featured: false
    },
    {
      id: 5,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      salary: "$70k - $110k",
      description: "Drive growth and brand awareness for Voxly across digital channels.",
      requirements: [
        "3+ years experience in digital marketing",
        "Experience with content marketing and SEO",
        "Knowledge of analytics and growth metrics",
        "Creative thinking and data-driven approach"
      ],
      featured: false
    }
  ];

  const benefits = [
    {
      icon: <Heart className="text-red-400" size={32} />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipend"
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: "Flexible Work",
      description: "100% remote work, flexible hours, and unlimited PTO policy"
    },
    {
      icon: <Star className="text-purple-400" size={32} />,
      title: "Growth & Learning",
      description: "Learning budget, conference attendance, and mentorship programs"
    },
    {
      icon: <Users className="text-blue-400" size={32} />,
      title: "Team Culture",
      description: "Inclusive environment, team retreats, and collaborative culture"
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
              Join Voxly
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Help us build the future of voice technology. Work with cutting-edge AI and make an impact on millions of users worldwide.
            </p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center mx-auto"
            >
              View Open Positions <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Why Work at Voxly?</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We offer competitive compensation, amazing benefits, and the opportunity to work on groundbreaking AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20"
            >
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Openings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 flex items-center justify-center">
            <Briefcase className="mr-4 text-purple-400" size={40} />
            Open Positions
          </h2>
          <p className="text-lg text-gray-300">
            Join our team and help shape the future of AI voice technology
          </p>
        </motion.div>

        <div className="space-y-8">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 ${
                job.featured ? 'ring-2 ring-purple-400/50' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-2xl font-bold mr-4">{job.title}</h3>
                    {job.featured && (
                      <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 text-blue-400" size={16} />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-green-400" size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 text-yellow-400" size={16} />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 text-purple-400" size={16} />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center">
                  Apply Now <ArrowRight className="ml-2" size={16} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">{job.description}</p>

              <div>
                <h4 className="text-lg font-semibold mb-3">Requirements:</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. 
            Send us your resume and tell us how you'd like to contribute to Voxly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="mr-3 text-purple-400" size={24} />
              <a 
                href="mailto:yahiaahmednabil@gmail.com" 
                className="text-lg hover:text-purple-400 transition-colors"
              >
                careers@voxly.ai
              </a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center">
              Send Resume <Mail className="ml-2" size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareersPage;
