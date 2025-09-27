import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface VoiceCloneStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  className?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Choose Voice",
    description: "Select a voice personality or upload your own sample",
    icon: "🎭"
  },
  {
    id: 2,
    title: "Enter Text",
    description: "Type or paste the text you want to convert to speech",
    icon: "✍️"
  },
  {
    id: 3,
    title: "Customize",
    description: "Adjust settings like language and voice parameters",
    icon: "⚙️"
  },
  {
    id: 4,
    title: "Generate",
    description: "Create your AI-generated speech with realistic voice cloning",
    icon: "🎵"
  }
];

export const VoiceCloningStepper: React.FC<VoiceCloneStepperProps> = ({
  currentStep,
  onStepChange,
  className = ''
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const isStepCompleted = (stepId: number) => stepId < currentStep;
  const isStepActive = (stepId: number) => stepId === currentStep;
  const isStepAccessible = (stepId: number) => stepId <= currentStep;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <motion.button
              key={step.id}
              onClick={() => isStepAccessible(step.id) && onStepChange(step.id)}
              onHoverStart={() => setHoveredStep(step.id)}
              onHoverEnd={() => setHoveredStep(null)}
              disabled={!isStepAccessible(step.id)}
              className={`
                relative w-10 h-10 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 text-sm font-medium
                ${isStepCompleted(step.id)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white'
                  : isStepActive(step.id)
                  ? 'bg-white border-purple-500 text-purple-500 shadow-lg'
                  : isStepAccessible(step.id)
                  ? 'bg-white border-gray-300 text-gray-500 hover:border-purple-300 hover:text-purple-400'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              whileHover={isStepAccessible(step.id) ? { scale: 1.1 } : {}}
              whileTap={isStepAccessible(step.id) ? { scale: 0.95 } : {}}
            >
              {isStepCompleted(step.id) ? (
                <span>✓</span>
              ) : (
                <span>{step.id}</span>
              )}
              
              {/* Pulse animation for active step */}
              {isStepActive(step.id) && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-300"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className={`
              p-4 rounded-xl border transition-all duration-300 cursor-pointer
              ${isStepActive(step.id)
                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md'
                : isStepCompleted(step.id)
                ? 'bg-green-50 border-green-200'
                : isStepAccessible(step.id)
                ? 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'
                : 'bg-gray-50 border-gray-100 opacity-60'
              }
            `}
            onClick={() => isStepAccessible(step.id) && onStepChange(step.id)}
            whileHover={isStepAccessible(step.id) ? { y: -2 } : {}}
            layout
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{step.icon}</div>
              <h3 className={`font-medium text-sm mb-1 ${
                isStepActive(step.id) ? 'text-purple-700' : 
                isStepCompleted(step.id) ? 'text-green-700' : 'text-gray-700'
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
              
              {/* Status indicator */}
              <div className="mt-2">
                {isStepCompleted(step.id) && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <span>✓</span> Complete
                  </span>
                )}
                {isStepActive(step.id) && (
                  <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ●
                    </motion.span>
                    Active
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mt-6">
        <motion.button
          onClick={() => currentStep > 1 && onStepChange(currentStep - 1)}
          disabled={currentStep <= 1}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${currentStep > 1
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={currentStep > 1 ? { x: -2 } : {}}
          whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
        >
          ← Previous
        </motion.button>

        <div className="text-xs text-gray-500">
          Step {currentStep} of {steps.length}
        </div>

        <motion.button
          onClick={() => currentStep < steps.length && onStepChange(currentStep + 1)}
          disabled={currentStep >= steps.length}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${currentStep < steps.length
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={currentStep < steps.length ? { x: 2 } : {}}
          whileTap={currentStep < steps.length ? { scale: 0.98 } : {}}
        >
          Next →
        </motion.button>
      </div>

      {/* Helpful Tips */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-sm">💡</span>
            <div className="text-xs text-blue-700">
              {currentStep === 1 && "Choose from our preset voices or upload a 10-30 second audio sample for custom voice cloning."}
              {currentStep === 2 && "Keep your text under 10,000 characters for free tier. Premium users have unlimited characters."}
              {currentStep === 3 && "Select the appropriate language for best results. Voice parameters can fine-tune the output."}
              {currentStep === 4 && "Generation typically takes 2-5 seconds. Longer texts may be processed in the background."}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
