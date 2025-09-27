import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Sparkles, ArrowRight, Mail } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out Voxly",
      features: [
        "1,000 characters per week",
        "4 preset voices",
        "Basic audio quality",
        "Standard processing speed",
        "Community support",
        "Personal use only"
      ],
      limitations: [
        "Limited voice selection",
        "Basic audio format",
        "Community support only"
      ],
      buttonText: "Get Started Free",
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Pro",
      price: "$1",
      period: "per week",
      description: "Affordable professional voice synthesis",
      features: [
        "50,000 characters per week",
        "20+ premium voices",
        "High-quality audio (44.1kHz)",
        "Fast processing priority",
        "Voice cloning (3 custom voices)",
        "Commercial use license",
        "Email support",
        "Multiple audio formats",
        "Batch processing",
        "API access"
      ],
      limitations: [],
      buttonText: "Start Pro Trial",
      popular: true,
      color: "from-purple-600 to-blue-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and large-scale projects",
      features: [
        "Unlimited characters",
        "All premium voices",
        "Ultra-high quality audio",
        "Dedicated processing",
        "Unlimited voice cloning",
        "White-label solution",
        "Priority support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced analytics"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      popular: false,
      color: "from-yellow-600 to-orange-600"
    }
  ];

  const faqs = [
    {
      question: "Why only $1 per week?",
      answer: "We believe AI voice technology should be accessible to everyone. Our affordable pricing makes professional voice synthesis available to creators, small businesses, and individuals without breaking the bank."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your current billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "Is there a free trial for Pro?",
      answer: "Yes! New users get a 7-day free trial of the Pro plan with full access to all features. No credit card required to start your trial."
    },
    {
      question: "What's included in voice cloning?",
      answer: "Voice cloning allows you to create custom voices from audio samples. Pro users can create up to 3 custom voices, while Enterprise users have unlimited voice cloning capabilities."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with Voxly, contact us for a full refund within 30 days of purchase."
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
              Simple Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Professional AI voice synthesis for just $1 per week. No hidden fees, no surprises.
            </p>
            <div className="flex items-center justify-center space-x-4 text-lg">
              <Check className="text-green-400" size={24} />
              <span>7-day free trial</span>
              <Check className="text-green-400" size={24} />
              <span>Cancel anytime</span>
              <Check className="text-green-400" size={24} />
              <span>30-day money-back guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 ${
                plan.popular ? 'ring-2 ring-purple-400 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full flex items-center">
                    <Star className="mr-2 text-yellow-400" size={16} />
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="mr-3 text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full bg-gradient-to-r ${plan.color} px-6 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center`}>
                {plan.buttonText}
                {plan.name === "Enterprise" ? (
                  <Mail className="ml-2" size={20} />
                ) : (
                  <ArrowRight className="ml-2" size={20} />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Why Choose Voxly?</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get professional-quality AI voices at a fraction of the cost of traditional voice actors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20"
          >
            <Zap className="mx-auto mb-4 text-yellow-400" size={48} />
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-300">
              Generate high-quality voice content in seconds, not hours. Perfect for tight deadlines and rapid prototyping.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20"
          >
            <Crown className="mx-auto mb-4 text-purple-400" size={48} />
            <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
            <p className="text-gray-300">
              Studio-quality audio with natural intonation and emotion. Indistinguishable from human voices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20"
          >
            <Sparkles className="mx-auto mb-4 text-blue-400" size={48} />
            <h3 className="text-xl font-bold mb-3">Affordable</h3>
            <p className="text-gray-300">
              Professional voice synthesis for just $1/week. Save thousands compared to hiring voice actors.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-300">
            Everything you need to know about Voxly pricing and features
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-3 text-purple-400">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your needs. 
            Contact us for personalized recommendations and enterprise solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="mr-3 text-purple-400" size={24} />
              <a 
                href="mailto:yahiaahmednabil@gmail.com" 
                className="text-lg hover:text-purple-400 transition-colors"
              >
                yahiaahmednabil@gmail.com
              </a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center">
              Contact Sales <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
