import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '../utils/toast';
import { Mail, MapPin, Phone, Clock, Send, MessageCircle, HeadphonesIcon, Zap } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    // In a real app, this would send to your backend
    showToast.success('Thank you for your message! We\'ll get back to you soon.', { duration: 5000 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="text-purple-400" size={32} />,
      title: "Email Support",
      description: "Get help with technical issues and general inquiries",
      contact: "yahiaahmednabil@gmail.com",
      action: "mailto:yahiaahmednabil@gmail.com"
    },
    {
      icon: <MessageCircle className="text-blue-400" size={32} />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 24/7",
      action: "#"
    },
    {
      icon: <HeadphonesIcon className="text-green-400" size={32} />,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      contact: "+1 (555) 123-VOXLY",
      action: "tel:+15551234869"
    },
    {
      icon: <Clock className="text-yellow-400" size={32} />,
      title: "Response Time",
      description: "We typically respond within 2-4 hours",
      contact: "Business Hours: 9 AM - 6 PM EST",
      action: "#"
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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Have questions about Voxly? Need technical support? We're here to help you succeed with AI voice synthesis.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{method.icon}</div>
              <h3 className="text-xl font-bold mb-3">{method.title}</h3>
              <p className="text-gray-300 mb-4">{method.description}</p>
              <a 
                href={method.action}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                {method.contact}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Send className="mr-3 text-purple-400" size={32} />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Inquiry Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
              >
                Send Message <Send className="ml-2" size={20} />
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Zap className="mr-3 text-yellow-400" size={28} />
                Quick Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 text-purple-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-gray-300">yahiaahmednabil@gmail.com</p>
                    <p className="text-sm text-gray-400">Response within 2-4 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 text-blue-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-300">Global Remote Team</p>
                    <p className="text-sm text-gray-400">Serving customers worldwide</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mr-3 text-green-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-gray-300">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-sm text-gray-400">Emergency support available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-gray-300 mb-6">
                Check out our comprehensive documentation and FAQ section for quick answers to common questions.
              </p>
              <div className="space-y-3">
                <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  → API Documentation
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  → Getting Started Guide
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  → Troubleshooting
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  → Community Forum
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
