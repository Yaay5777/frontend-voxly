import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  User,
  Building,
  Globe,
  Headphones,
  CheckCircle,
  AlertCircle,
  Loader,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Zap,
  Heart,
  Star
} from 'lucide-react';

import { Scene3D } from '../3d/Scene3D';
import { AudioVisualizer3D } from '../3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'sales' | 'support' | 'partnership';
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  color: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedOffice, setSelectedOffice] = useState('san-francisco');

  const contactInfo: ContactInfo[] = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['hello@voxly.ai', 'support@voxly.ai', 'sales@voxly.ai'],
      color: '#3b82f6'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: '#10b981'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: ['San Francisco, CA', 'New York, NY', 'London, UK'],
      color: '#f59e0b'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Business Hours',
      details: ['Mon-Fri: 9AM-6PM PST', 'Weekend: Emergency only'],
      color: '#8b5cf6'
    }
  ];

  const offices = [
    {
      id: 'san-francisco',
      name: 'San Francisco',
      address: '123 Innovation Drive, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@voxly.ai',
      timezone: 'PST',
      image: '🌉'
    },
    {
      id: 'new-york',
      name: 'New York',
      address: '456 Tech Avenue, New York, NY 10001',
      phone: '+1 (555) 987-6543',
      email: 'ny@voxly.ai',
      timezone: 'EST',
      image: '🗽'
    },
    {
      id: 'london',
      name: 'London',
      address: '789 AI Street, London, UK EC1A 1BB',
      phone: '+44 20 1234 5678',
      email: 'london@voxly.ai',
      timezone: 'GMT',
      image: '🇬🇧'
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, name: 'Twitter', url: '#', color: '#1da1f2' },
    { icon: <Linkedin className="w-5 h-5" />, name: 'LinkedIn', url: '#', color: '#0077b5' },
    { icon: <Github className="w-5 h-5" />, name: 'GitHub', url: '#', color: '#333' },
    { icon: <Youtube className="w-5 h-5" />, name: 'YouTube', url: '#', color: '#ff0000' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      setSubmitStatus('success');
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene3D environment="nature" performance="high">
          <AudioVisualizer3D
            isPlaying={false}
            type="particles"
            color="#10b981"
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
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about Voxly? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <MessageCircle className="w-8 h-8 text-green-400" />
                  <h2 className="text-3xl font-bold text-white">Send us a message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'general', label: 'General', icon: <MessageCircle className="w-4 h-4" /> },
                        { value: 'sales', label: 'Sales', icon: <Zap className="w-4 h-4" /> },
                        { value: 'support', label: 'Support', icon: <Headphones className="w-4 h-4" /> },
                        { value: 'partnership', label: 'Partnership', icon: <Heart className="w-4 h-4" /> }
                      ].map((type) => (
                        <motion.button
                          key={type.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value as any }))}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center space-y-2 ${
                            formData.inquiryType === type.value
                              ? 'bg-green-600/20 border-green-500/50 text-green-400'
                              : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {type.icon}
                          <span className="text-sm font-medium">{type.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company and Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-white font-medium mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-white font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    whileHover={{ scale: isFormValid && !isSubmitting ? 1.05 : 1 }}
                    whileTap={{ scale: isFormValid && !isSubmitting ? 0.95 : 1 }}
                    className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      isFormValid && !isSubmitting
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Message Sent!</span>
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span>Try Again</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        <div style={{ color: info.color }}>
                          {info.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 mb-1">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Office Locations */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6">Our Offices</h3>
                
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <motion.button
                      key={office.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedOffice(office.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedOffice === office.id
                          ? 'bg-blue-600/20 border-blue-500/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{office.image}</span>
                        <div>
                          <div className="text-white font-semibold">{office.name}</div>
                          <div className="text-sm text-gray-400">{office.timezone}</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedOffice === office.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <div className="space-y-2 text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{office.address}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{office.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{office.email}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div style={{ color: social.color }}>
                        {social.icon}
                      </div>
                      <span className="text-white font-medium">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6">Why Choose Voxly?</h3>
                
                <div className="space-y-4">
                  {[
                    { icon: <Star className="w-5 h-5" />, label: '99.9% Uptime', color: '#f59e0b' },
                    { icon: <Zap className="w-5 h-5" />, label: '<500ms Response', color: '#10b981' },
                    { icon: <Globe className="w-5 h-5" />, label: '25+ Languages', color: '#3b82f6' },
                    { icon: <Headphones className="w-5 h-5" />, label: '24/7 Support', color: '#8b5cf6' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                      <span className="text-white font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
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

export default ContactPage;
