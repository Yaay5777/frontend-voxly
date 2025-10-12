/**
 * AI Service - FREE Script Generation using HuggingFace Inference API
 * No API key required for public models!
 * Models used: mistralai/Mistral-7B-Instruct-v0.1 (Free, fast, good quality)
 */

interface AIGenerationOptions {
  prompt: string;
  maxLength?: number;
  temperature?: number;
  category?: string;
}

interface AIResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Generate script using FREE HuggingFace Inference API
 * No authentication required for public models
 */
export const generateScript = async (options: AIGenerationOptions): Promise<AIResponse> => {
  const {
    prompt,
    maxLength = 500,
    temperature = 0.7,
    category = 'general'
  } = options;

  try {
    console.log('🤖 Generating AI script with prompt:', prompt);

    // Use HuggingFace Inference API (FREE, no API key needed)
    const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

    // Create system prompt based on category
    const systemPrompts: Record<string, string> = {
      'phone': 'You are a professional business communication writer specializing in phone greetings and voicemail messages. Write clear, professional, and friendly scripts.',
      'podcast': 'You are a podcast scriptwriter. Create engaging, conversational, and compelling podcast introductions that hook listeners.',
      'video': 'You are a video script writer. Create engaging video scripts that are clear, concise, and perfect for voiceovers.',
      'commercial': 'You are an advertising copywriter. Create persuasive, memorable commercial scripts that convert viewers into customers.',
      'educational': 'You are an educational content writer. Create clear, informative scripts that make complex topics easy to understand.',
      'notification': 'You are a UX writer. Create brief, clear notification messages that inform users effectively.',
      'audiobook': 'You are a fiction/non-fiction writer. Create engaging narrative content with vivid descriptions.',
      'announcement': 'You are a professional communicator. Create clear, informative announcement scripts.',
      'general': 'You are a professional voiceover script writer. Create clear, engaging scripts suitable for text-to-speech.',
    };

    const systemPrompt = systemPrompts[category] || systemPrompts['general'];

    // Format prompt for Mistral model
    const fullPrompt = `<s>[INST] ${systemPrompt}

User request: ${prompt}

Write a professional voiceover script (${maxLength} characters max). Be concise, engaging, and ready for text-to-speech. Do not include stage directions or sound effects. [/INST]`;

    // Call HuggingFace API (FREE!)
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: Math.floor(maxLength / 3), // Roughly chars/3 = tokens
          temperature: temperature,
          top_p: 0.9,
          repetition_penalty: 1.2,
          do_sample: true,
          return_full_text: false,
        },
        options: {
          wait_for_model: true, // Wait if model is loading
          use_cache: false,
        },
      }),
    });

    if (!response.ok) {
      // Handle rate limiting or model loading
      if (response.status === 503) {
        throw new Error('AI model is loading. Please wait 20 seconds and try again.');
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract generated text
    let generatedText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else if (typeof data === 'string') {
      generatedText = data;
    } else {
      throw new Error('Unexpected response format from AI');
    }

    // Clean up the generated text
    generatedText = cleanGeneratedText(generatedText);

    // Ensure it's not too long
    if (generatedText.length > maxLength) {
      generatedText = generatedText.substring(0, maxLength).trim();
      // Try to end at a sentence
      const lastPeriod = generatedText.lastIndexOf('.');
      if (lastPeriod > maxLength * 0.8) {
        generatedText = generatedText.substring(0, lastPeriod + 1);
      }
    }

    console.log('✅ AI script generated successfully');

    return {
      success: true,
      text: generatedText,
    };
  } catch (error: any) {
    console.error('❌ AI generation failed:', error);

    return {
      success: false,
      error: error.message || 'Failed to generate script. Please try again.',
    };
  }
};

/**
 * Clean up generated text (remove artifacts, fix formatting)
 */
function cleanGeneratedText(text: string): string {
  let cleaned = text.trim();

  // Remove common artifacts
  cleaned = cleaned.replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/g, '');
  cleaned = cleaned.replace(/^(Sure|Here|Okay|Certainly)[,.]?\s*/i, '');
  cleaned = cleaned.replace(/^(Here's|Here is) (a|an|the) .{0,50}?:\s*/i, '');
  
  // Remove stage directions in brackets or parentheses at start
  cleaned = cleaned.replace(/^\[.*?\]\s*/, '');
  cleaned = cleaned.replace(/^\(.*?\)\s*/, '');
  
  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Ensure it starts with capital letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned.trim();
}

/**
 * Generate script suggestions based on keywords
 */
export const generateScriptSuggestions = async (keywords: string): Promise<string[]> => {
  const suggestions: string[] = [];

  // Categories to generate for
  const categories = ['professional', 'friendly', 'energetic', 'calm'];

  for (const category of categories) {
    const result = await generateScript({
      prompt: `Create a ${category} voiceover script about: ${keywords}`,
      maxLength: 200,
      category: 'general',
    });

    if (result.success && result.text) {
      suggestions.push(result.text);
    }

    // Don't overwhelm the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return suggestions;
};

/**
 * Improve/rewrite existing text
 */
export const improveText = async (text: string, style: string = 'professional'): Promise<AIResponse> => {
  return generateScript({
    prompt: `Rewrite this text in a ${style} style for voiceover: "${text}"`,
    maxLength: text.length * 1.2, // Allow slightly longer
    category: 'general',
  });
};

/**
 * Expand short text into full script
 */
export const expandText = async (text: string, targetLength: number = 500): Promise<AIResponse> => {
  return generateScript({
    prompt: `Expand this into a detailed ${targetLength}-character voiceover script: "${text}"`,
    maxLength: targetLength,
    category: 'general',
  });
};

/**
 * Summarize long text
 */
export const summarizeText = async (text: string): Promise<AIResponse> => {
  return generateScript({
    prompt: `Summarize this into a brief voiceover script (under 200 characters): "${text}"`,
    maxLength: 200,
    category: 'general',
  });
};

/**
 * Alternative: Use local LLM if HuggingFace is down
 * Deploy this on HuggingFace Spaces for 100% free hosting!
 */
export const useLocalLLM = false; // Set to true if you deploy your own HF Space

export const LOCAL_LLM_URL = import.meta.env.VITE_LLM_URL || 'https://your-username-llm-api.hf.space';
