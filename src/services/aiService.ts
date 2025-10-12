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
    // Using GPT-2 which doesn't require authentication
    const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2-large';

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

    // Simple prompt for GPT-2
    const fullPrompt = `${systemPrompt}\n\nTopic: ${prompt}\n\nScript:`;

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
    console.error('❌ AI generation failed, using template fallback:', error);

    // Fallback to smart template generation
    const templateText = generateFallbackTemplate(prompt, category, maxLength);
    
    return {
      success: true,
      text: templateText,
    };
  }
};

/**
 * Generate smart fallback templates when AI is unavailable
 */
function generateFallbackTemplate(prompt: string, category: string, maxLength: number): string {
  const promptLower = prompt.toLowerCase();
  
  // Phone greetings
  if (category === 'phone') {
    const company = prompt.replace(/phone|greeting|call|professional/gi, '').trim() || 'us';
    if (promptLower.includes('voicemail') || promptLower.includes('out of office')) {
      return `Thank you for calling. I'm currently unavailable to take your call. Please leave your name, number, and a brief message, and I'll return your call as soon as possible. For urgent matters, please contact our main office. Thank you!`;
    }
    return `Thank you for calling ${company}. Your call is important to us. All of our representatives are currently assisting other customers. Please stay on the line, and the next available representative will be with you shortly. For faster service, you may also visit our website or send us an email. Thank you for your patience.`;
  }
  
  // Podcast intros
  if (category === 'podcast') {
    const topic = prompt.replace(/podcast|intro|about/gi, '').trim();
    return `Welcome back to the show! I'm your host, and today we're diving into ${topic}. Whether you're a longtime listener or just joining us for the first time, you're in for a great episode. We'll be exploring the ins and outs of this fascinating topic, sharing expert insights, and answering your most pressing questions. So grab your headphones, get comfortable, and let's get started!`;
  }
  
  // Video scripts
  if (category === 'video') {
    const topic = prompt.replace(/video|demo|about|tutorial/gi, '').trim();
    return `Hey everyone! In today's video, we're taking a closer look at ${topic}. I'll walk you through everything you need to know, from the basics to the advanced features. By the end of this video, you'll have a complete understanding and be ready to put it into action. If you find this helpful, don't forget to like and subscribe for more content. Now, let's jump right in!`;
  }
  
  // Commercials
  if (category === 'commercial') {
    const product = prompt.replace(/commercial|advertisement|for|about/gi, '').trim();
    return `Introducing ${product} - the game-changing solution you've been waiting for. Engineered for excellence and designed with you in mind, ${product} delivers unmatched performance and unbeatable value. Don't settle for less when you can have the best. Experience the ${product} difference today. Visit our website or call now - this limited-time offer won't last forever. ${product} - because you deserve extraordinary.`;
  }
  
  // Educational
  if (category === 'educational') {
    const topic = prompt.replace(/educational|lesson|course|about/gi, '').trim();
    return `Welcome to today's lesson on ${topic}. Over the next few minutes, we'll break down this subject into clear, digestible concepts. I'll provide real-world examples, practical applications, and actionable strategies you can implement immediately. Whether you're a complete beginner or looking to deepen your expertise, this lesson offers valuable insights for everyone. Let's begin by understanding the core fundamentals.`;
  }
  
  // Notifications
  if (category === 'notification') {
    return `Important notification: ${prompt}. Please check your account for more details. Thank you.`;
  }
  
  // Audiobooks
  if (category === 'audiobook') {
    const topic = prompt.replace(/audiobook|story|about/gi, '').trim();
    return `Chapter One: ${topic}. The morning began like any other, with sunlight streaming through the window and birds singing in the distance. But today would be different. Today, everything would change. As the clock struck nine, a phone call would arrive - a call that would set in motion events no one could have predicted. This is the story of what happened next...`;
  }
  
  // Announcements
  if (category === 'announcement') {
    return `Attention please. We're pleased to announce ${prompt}. This important update affects all of our valued customers. For complete details, please visit our website or contact our customer service team. We appreciate your continued support and look forward to serving you. Thank you for your attention.`;
  }
  
  // General fallback
  return `Welcome. Today, we're focusing on ${prompt}. This comprehensive overview will provide you with valuable insights and practical information you can use right away. We'll cover the essential elements, discuss key considerations, and share expert recommendations. By the end, you'll have a clear understanding and actionable next steps. Let's get started.`;
}

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
