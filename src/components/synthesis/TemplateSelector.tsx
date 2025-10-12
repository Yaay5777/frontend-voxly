import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { textTemplates, templateCategories, searchTemplates, getPopularTemplates, getTemplatesByCategory } from '../../data/textTemplates';
import { showToast } from '../../utils/toast';

interface TemplateSelectorProps {
  onTemplateSelected: (text: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelected }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered templates
  const getFilteredTemplates = () => {
    if (searchQuery.trim()) {
      return searchTemplates(searchQuery);
    }
    if (selectedCategory === 'all') {
      return textTemplates;
    }
    if (selectedCategory === 'popular') {
      return getPopularTemplates();
    }
    return getTemplatesByCategory(selectedCategory);
  };

  const filteredTemplates = getFilteredTemplates();

  const handleSelectTemplate = (text: string, title: string) => {
    onTemplateSelected(text);
    showToast.success(`Template "${title}" inserted!`);
    setShowTemplates(false);
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
      >
        <FileText className="w-5 h-5" />
        <span className="font-semibold">Use Professional Template</span>
        {showTemplates ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Templates Panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All ({textTemplates.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('popular');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    selectedCategory === 'popular'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Popular
                </button>
                {templateCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Templates List */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No templates found. Try a different search or category.
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                      onClick={() => handleSelectTemplate(template.text, template.title)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {template.title}
                            {template.popular && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Use
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {template.text}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Helper Text */}
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                💡 Click any template to insert it into the text editor above
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateSelector;
