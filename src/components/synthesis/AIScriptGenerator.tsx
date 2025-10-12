import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader, Wand2, Zap } from 'lucide-react';
import { generateScript } from '../../services/aiService';
import { showToast } from '../../utils/toast';

interface AIScriptGeneratorProps {
  onScriptGenerated: (script: string) => void;
}

const categories = [
  { id: 'general', name: 'General', icon: '✨', color: 'purple' },
  { id: 'phone', name: 'Phone Greeting', icon: '📱', color: 'blue' },
  { id: 'podcast', name: 'Podcast Intro', icon: '🎙️', color: 'red' },
  { id: 'video', name: 'Video Script', icon: '📺', color: 'pink' },
  { id: 'commercial', name: 'Commercial', icon: '📢', color: 'orange' },
  { id: 'educational', name: 'Educational', icon: '🎓', color: 'indigo' },
  { id: 'notification', name: 'Notification', icon: '🔔', color: 'yellow' },
  { id: 'announcement', name: 'Announcement', icon: '📣', color: 'green' },
];

export const AIScriptGenerator: React.FC<AIScriptGeneratorProps> = ({ onScriptGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast.warning('Please enter what you need a script for');
      return;
    }

    setIsGenerating(true);
    const toastId = showToast.loading('🤖 AI is crafting your script...');

    try {
      const result = await generateScript({
        prompt: prompt.trim(),
        category: selectedCategory,
        maxLength: 500,
        temperature: 0.7,
      });

      showToast.dismiss(toastId);

      if (result.success && result.text) {
        showToast.success('✨ Script generated successfully!');
        onScriptGenerated(result.text);
        setPrompt('');
        setShowGenerator(false);
      } else {
        showToast.error(result.error || 'Failed to generate script');
      }
    } catch (error: any) {
      showToast.dismiss(toastId);
      showToast.error('Failed to generate script: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => setShowGenerator(!showGenerator)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-semibold">Generate Script with AI</span>
        <Wand2 className="w-5 h-5" />
      </button>

      {/* AI Generator Panel */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700 space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCategory === cat.id
                          ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/50'
                          : 'border-gray-300 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {cat.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you need a voiceover for?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: A professional phone greeting for a law firm"
                  className="w-full h-24 p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isGenerating}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Generate with AI</span>
                  </>
                )}
              </button>

              {/* Helper Text */}
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                💡 Be specific for better results. AI will create a professional script in 2-5 seconds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIScriptGenerator;
