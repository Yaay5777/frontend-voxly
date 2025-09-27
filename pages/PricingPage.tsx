import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Rocket,
  ArrowRight,
  Calculator,
  Users,
  Building,
  Sparkles,
  Shield,
  Headphones,
  Clock,
  Globe,
  Cpu,
  BarChart3
} from 'lucide-react';

import { Scene3D } from '../src/3d/Scene3D';
import { AudioVisualizer3D } from '../src/3d/AudioVisualizer3D';
import { toast } from 'react-hot-toast';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  icon: React.ReactNode;
  color: string;
  gradient: string;
  popular?: boolean;
  enterprise?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: string;
  }[];
  stats: {
    requests: string;
    voices: string;
    languages: string;
    support: string;
  };
}

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    requests: 1000,
    users: 1
  });

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      price: {
        monthly: 0,
        yearly: 0
      },
      icon: <Rocket className="w-8 h-8" />,
      color: '#10b981',
      gradient: 'from-green-600 to-emerald-600',
      features: [
        { name: 'Voice Synthesis API', included: true, limit: '1,000 requests/month' },
        { name: 'Basic Voice Models', included: true, limit: '5 voices' },
        { name: 'Standard Quality', included: true },
        { name: 'Community Support', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Multi-language Support', included: false },
        { name: 'Custom Voice Training', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'White-label Solution', included: false }
      ],
      stats: {
        requests: '1K/month',
        voices: '5 voices',
        languages: '3 languages',
        support: 'Community'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses and developers',
      price: {
        monthly: 49,
        yearly: 490
      },
      icon: <Star className="w-8 h-8" />,
      color: '#3b82f6',
      gradient: 'from-blue-600 to-indigo-600',
      popular: true,
      features: [
        { name: 'Voice Synthesis API', included: true, limit: '50,000 requests/month' },
        { name: 'Premium Voice Models', included: true, limit: '25 voices' },
        { name: 'High Quality Audio', included: true },
        { name: 'Email Support', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Multi-language Support', included: true, limit: '15 languages' },
        { name: 'Voice Customization', included: true },
        { name: 'API Rate Limiting', included: true },
        { name: 'Custom Voice Training', included: false },
        { name: 'White-label Solution', included: false }
      ],
      stats: {
        requests: '50K/month',
        voices: '25 voices',
        languages: '15 languages',
        support: 'Email'
      }
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Advanced features for scaling companies',
      price: {
        monthly: 149,
        yearly: 1490
      },
      icon: <Building className="w-8 h-8" />,
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-violet-600',
      features: [
        { name: 'Voice Synthesis API', included: true, limit: '200,000 requests/month' },
        { name: 'All Voice Models', included: true, limit: '43+ voices' },
        { name: 'Studio Quality Audio', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Advanced Analytics & Insights', included: true },
        { name: 'Multi-language Support', included: true, limit: '25+ languages' },
        { name: 'Voice Customization', included: true },
        { name: 'Custom Voice Training', included: true, limit: '5 custom voices' },
        { name: 'Team Management', included: true },
        { name: 'White-label Solution', included: false }
      ],
      stats: {
        requests: '200K/month',
        voices: '43+ voices',
        languages: '25+ languages',
        support: 'Priority'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: {
        monthly: 0,
        yearly: 0
      },
      icon: <Crown className="w-8 h-8" />,
      color: '#f59e0b',
      gradient: 'from-yellow-600 to-orange-600',
      enterprise: true,
      features: [
        { name: 'Unlimited API Requests', included: true },
        { name: 'All Voice Models + Custom', included: true },
        { name: 'Ultra-High Quality Audio', included: true },
        { name: 'Dedicated Support Manager', included: true },
        { name: 'Custom Analytics Dashboard', included: true },
        { name: 'All Languages + Custom', included: true },
        { name: 'Unlimited Voice Training', included: true },
        { name: 'White-label Solution', included: true },
        { name: 'On-premise Deployment', included: true },
        { name: 'SLA Guarantee', included: true }
      ],
      stats: {
        requests: 'Unlimited',
        voices: 'Unlimited',
        languages: 'All + Custom',
        support: 'Dedicated'
      }
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      toast.success(`Selected ${plan.name} plan!`);
    }
  };

  const calculateEstimatedCost = () => {
    const { requests, users } = calculatorInputs;
    
    if (requests <= 1000) return { plan: 'Starter', cost: 0 };
    if (requests <= 50000) return { plan: 'Professional', cost: billingCycle === 'yearly' ? 490 : 49 * 12 };
    if (requests <= 200000) return { plan: 'Business', cost: billingCycle === 'yearly' ? 1490 : 149 * 12 };
    
    return { plan: 'Enterprise', cost: 'Custom' };
  };

  const estimatedCost = calculateEstimatedCost();

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
          <Scene3D environment="studio" performance="high">
            <AudioVisualizer3D
              isPlaying={false}
              type="circular"
              color="#f59e0b"
              intensity={0.7}
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
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Simple Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your voice synthesis needs. Start free, scale as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-16 h-8 rounded-full transition-all ${
                  billingCycle === 'yearly' ? 'bg-orange-600' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 32 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </motion.button>
              <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  Save 17%
                </motion.span>
              )}
            </div>

            {/* Cost Calculator Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 flex items-center space-x-2 mx-auto mb-8"
            >
              <Calculator className="w-5 h-5" />
              <span>Cost Calculator</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Cost Calculator */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 backdrop-blur-md border-b border-white/10"
            >
              <div className="max-w-4xl mx-auto p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Calculate Your Estimated Costs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="block text-white font-medium">
                      Monthly API Requests
                    </label>
                    <input
                      type="number"
                      value={calculatorInputs.requests}
                      onChange={(e) => setCalculatorInputs(prev => ({ ...prev, requests: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                      placeholder="1000"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-white font-medium">
                      Number of Users
                    </label>
                    <input
                      type="number"
                      value={calculatorInputs.users}
                      onChange={(e) => setCalculatorInputs(prev => ({ ...prev, users: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                      placeholder="1"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-white font-medium">
                      Recommended Plan
                    </label>
                    <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                      <div className="text-xl font-bold text-orange-400">
                        {estimatedCost.plan}
                      </div>
                      <div className="text-gray-300">
                        {typeof estimatedCost.cost === 'number' 
                          ? `$${estimatedCost.cost}${billingCycle === 'yearly' ? '/year' : '/month'}`
                          : estimatedCost.cost
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -10 }}
                className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border transition-all ${
                  plan.popular 
                    ? 'border-blue-500/50 shadow-lg shadow-blue-500/25' 
                    : 'border-white/20 hover:border-white/40'
                } ${selectedPlan === plan.id ? 'ring-2 ring-white/50' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </motion.div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20` }}
                  >
                    <div style={{ color: plan.color }}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {plan.enterprise ? (
                      <div>
                        <div className="text-4xl font-bold text-white">Custom</div>
                        <div className="text-gray-400">Contact us for pricing</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-white">
                          ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                        </div>
                        <div className="text-gray-400">
                          {plan.price.monthly === 0 ? 'Free forever' : `per ${billingCycle === 'yearly' ? 'year' : 'month'}`}
                        </div>
                        {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                          <div className="text-sm text-green-400 mt-1">
                            Save ${(plan.price.monthly * 12) - plan.price.yearly}/year
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: plan.color }}>
                        {plan.stats.requests}
                      </div>
                      <div className="text-xs text-gray-400">Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: plan.color }}>
                        {plan.stats.voices}
                      </div>
                      <div className="text-xs text-gray-400">Voices</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: plan.color }}>
                        {plan.stats.languages}
                      </div>
                      <div className="text-xs text-gray-400">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: plan.color }}>
                        {plan.stats.support}
                      </div>
                      <div className="text-xs text-gray-400">Support</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className={`mt-0.5 ${feature.included ? 'text-green-400' : 'text-gray-500'}`}>
                        {feature.included ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${feature.included ? 'text-white' : 'text-gray-500'}`}>
                          {feature.name}
                        </div>
                        {feature.limit && (
                          <div className="text-xs text-gray-400 mt-1">
                            {feature.limit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                      : plan.enterprise
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <span>
                    {plan.enterprise ? 'Contact Sales' : plan.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Compare All Features
              </h2>
              <p className="text-xl text-gray-300">
                See what's included in each plan
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-6 text-white font-semibold">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center p-6">
                          <div className="text-white font-semibold">{plan.name}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            {plan.enterprise ? 'Custom' : `$${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}`}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Voice Synthesis API',
                      'Multi-language Support',
                      'Voice Customization',
                      'Custom Voice Training',
                      'Advanced Analytics',
                      'Priority Support',
                      'White-label Solution',
                      'Team Management',
                      'On-premise Deployment',
                      'SLA Guarantee'
                    ].map((featureName, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-6 text-white font-medium">{featureName}</td>
                        {plans.map((plan) => {
                          const feature = plan.features.find(f => f.name === featureName);
                          return (
                            <td key={plan.id} className="p-6 text-center">
                              {feature?.included ? (
                                <Check className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-500 mx-auto" />
                              )}
                              {feature?.limit && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {feature.limit}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-300">
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing."
                },
                {
                  question: "What happens if I exceed my limits?",
                  answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional requests as needed."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee for all paid plans. No questions asked."
                },
                {
                  question: "Is there a free trial?",
                  answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers and businesses using Voxly to create amazing voice experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Start Free Trial</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 flex items-center justify-center space-x-2"
                >
                  <Headphones className="w-5 h-5" />
                  <span>Contact Sales</span>
                </motion.button>
              </div>
            </div>
          </motion.section>
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

export default PricingPage;
