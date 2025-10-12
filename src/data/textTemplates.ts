export interface TextTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  text: string;
  tags: string[];
  popular?: boolean;
}

export const templateCategories = [
  { id: 'phone', name: 'Phone Greetings', icon: '📱', color: 'blue' },
  { id: 'podcast', name: 'Podcast Intros', icon: '🎙️', color: 'purple' },
  { id: 'video', name: 'Video Voiceovers', icon: '📺', color: 'red' },
  { id: 'notification', name: 'Notifications', icon: '🔔', color: 'yellow' },
  { id: 'audiobook', name: 'Audiobook Samples', icon: '📖', color: 'green' },
  { id: 'educational', name: 'Educational', icon: '🎓', color: 'indigo' },
  { id: 'commercial', name: 'Commercials', icon: '📢', color: 'pink' },
  { id: 'announcement', name: 'Announcements', icon: '📣', color: 'orange' },
];

export const textTemplates: TextTemplate[] = [
  // Phone Greetings
  {
    id: 'phone-1',
    category: 'phone',
    title: 'Professional Voicemail',
    description: 'Standard professional voicemail greeting',
    text: 'Thank you for calling [Company Name]. We\'re currently unable to take your call, but your message is important to us. Please leave your name, number, and a brief message after the tone, and we\'ll get back to you as soon as possible.',
    tags: ['professional', 'business', 'voicemail'],
    popular: true,
  },
  {
    id: 'phone-2',
    category: 'phone',
    title: 'Out of Office',
    description: 'Out of office phone greeting',
    text: 'Hello, you\'ve reached [Your Name] at [Company Name]. I\'m currently out of the office until [Date]. For urgent matters, please press 0 to speak with a representative, or leave a message and I\'ll return your call as soon as I\'m back.',
    tags: ['out-of-office', 'professional'],
  },
  {
    id: 'phone-3',
    category: 'phone',
    title: 'Customer Service Queue',
    description: 'Hold message for customer service',
    text: 'Thank you for contacting [Company Name] customer support. Your call is important to us. All of our representatives are currently assisting other customers. Please stay on the line, and the next available agent will be with you shortly. Your estimated wait time is [X] minutes.',
    tags: ['customer-service', 'hold-message'],
    popular: true,
  },

  // Podcast Intros
  {
    id: 'podcast-1',
    category: 'podcast',
    title: 'Standard Podcast Intro',
    description: 'Professional podcast introduction',
    text: 'Welcome to [Podcast Name], the show where we explore [Topic]. I\'m your host, [Host Name], and in today\'s episode, we\'re diving into [Episode Topic]. Whether you\'re a longtime listener or just joining us for the first time, thanks for tuning in. Let\'s get started!',
    tags: ['podcast', 'introduction', 'host'],
    popular: true,
  },
  {
    id: 'podcast-2',
    category: 'podcast',
    title: 'Interview Podcast Intro',
    description: 'Introduction for interview-style podcasts',
    text: 'Hey everyone, and welcome back to [Podcast Name]. I\'m [Host Name], and today I have a very special guest joining me. [Guest Name] is a [Guest Title/Description], and we\'re going to be talking about [Topic]. This is going to be a great conversation, so let\'s jump right in!',
    tags: ['podcast', 'interview', 'guest'],
  },
  {
    id: 'podcast-3',
    category: 'podcast',
    title: 'News Podcast Intro',
    description: 'Introduction for news or current events podcasts',
    text: 'Good morning, good afternoon, or good evening, wherever you are in the world. This is [Podcast Name], bringing you the latest in [Topic/Industry]. I\'m [Host Name], and today is [Date]. Here\'s what we\'re covering in today\'s episode.',
    tags: ['news', 'current-events', 'daily'],
  },

  // Video Voiceovers
  {
    id: 'video-1',
    category: 'video',
    title: 'Tutorial Video Intro',
    description: 'Introduction for tutorial or how-to videos',
    text: 'Hey everyone, welcome back to the channel! In today\'s video, I\'m going to show you how to [Topic]. Whether you\'re a beginner or just looking to improve your skills, this tutorial is for you. Let\'s get started!',
    tags: ['tutorial', 'youtube', 'how-to'],
    popular: true,
  },
  {
    id: 'video-2',
    category: 'video',
    title: 'Product Demo',
    description: 'Product demonstration video script',
    text: 'Introducing [Product Name], the innovative solution designed to [Primary Benefit]. With its [Key Feature 1], [Key Feature 2], and [Key Feature 3], [Product Name] makes it easier than ever to [Main Use Case]. See it in action.',
    tags: ['product', 'demo', 'marketing'],
    popular: true,
  },
  {
    id: 'video-3',
    category: 'video',
    title: 'Explainer Video',
    description: 'Educational explainer video script',
    text: 'Have you ever wondered [Question]? In this video, we\'re going to break down [Topic] in a way that\'s easy to understand. By the end, you\'ll have a clear grasp of [Learning Outcome]. Let\'s dive in!',
    tags: ['explainer', 'educational', 'animated'],
  },

  // Notifications
  {
    id: 'notif-1',
    category: 'notification',
    title: 'New Message Alert',
    description: 'Simple new message notification',
    text: 'You have a new message. Please check your inbox.',
    tags: ['alert', 'message', 'simple'],
  },
  {
    id: 'notif-2',
    category: 'notification',
    title: 'Order Confirmation',
    description: 'E-commerce order confirmation',
    text: 'Thank you for your purchase! Your order number [Order Number] has been confirmed and is being processed. You\'ll receive a shipping notification once your items are on their way.',
    tags: ['ecommerce', 'order', 'confirmation'],
    popular: true,
  },
  {
    id: 'notif-3',
    category: 'notification',
    title: 'Appointment Reminder',
    description: 'Appointment or meeting reminder',
    text: 'This is a reminder that you have an appointment scheduled for [Date] at [Time] with [Person/Company]. Please confirm your attendance or contact us if you need to reschedule.',
    tags: ['reminder', 'appointment', 'calendar'],
  },

  // Audiobook Samples
  {
    id: 'audio-1',
    category: 'audiobook',
    title: 'Fiction Opening',
    description: 'Classic fiction opening',
    text: 'It was a dark and stormy night when everything changed. Sarah had no idea that the knock on her door would lead her into an adventure that would alter the course of her life forever. As she reached for the doorknob, her heart raced with anticipation.',
    tags: ['fiction', 'story', 'narrative'],
    popular: true,
  },
  {
    id: 'audio-2',
    category: 'audiobook',
    title: 'Non-Fiction Intro',
    description: 'Non-fiction book introduction',
    text: 'In the following chapters, we will explore the fundamental principles that have shaped [Topic]. Drawing from decades of research and real-world examples, this book provides a comprehensive guide to understanding [Subject Matter].',
    tags: ['non-fiction', 'educational', 'introduction'],
  },

  // Educational
  {
    id: 'edu-1',
    category: 'educational',
    title: 'Lesson Introduction',
    description: 'Introduction for educational lessons',
    text: 'Welcome to today\'s lesson on [Topic]. By the end of this session, you\'ll be able to [Learning Objective 1], [Learning Objective 2], and [Learning Objective 3]. Let\'s begin by reviewing what we covered in our last lesson.',
    tags: ['lesson', 'teaching', 'course'],
    popular: true,
  },
  {
    id: 'edu-2',
    category: 'educational',
    title: 'Quiz Instructions',
    description: 'Instructions for educational quizzes',
    text: 'Welcome to the quiz section. This assessment contains [Number] questions and should take approximately [Time] minutes to complete. Read each question carefully before selecting your answer. You may review your answers before submitting. Good luck!',
    tags: ['quiz', 'test', 'assessment'],
  },

  // Commercials
  {
    id: 'comm-1',
    category: 'commercial',
    title: '30-Second Radio Spot',
    description: 'Short radio commercial format',
    text: 'Tired of [Problem]? [Product Name] is here to help! With [Key Benefit], you can finally [Solution]. Visit [Website] or call [Phone Number] today. [Product Name] - [Tagline]. Limited time offer!',
    tags: ['radio', 'advertisement', '30-second'],
    popular: true,
  },
  {
    id: 'comm-2',
    category: 'commercial',
    title: 'Service Promotion',
    description: 'Service-based business promotion',
    text: 'Looking for [Service Type] you can trust? At [Company Name], we\'ve been serving [Location] for over [Number] years. Our team of certified professionals is dedicated to providing [Key Benefit]. Call us today for a free quote!',
    tags: ['service', 'local', 'promotion'],
  },

  // Announcements
  {
    id: 'announce-1',
    category: 'announcement',
    title: 'Store Hours',
    description: 'Business hours announcement',
    text: 'Welcome to [Business Name]. Our regular business hours are Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 4 PM. We\'re closed on Sundays and major holidays. Thank you for your patronage!',
    tags: ['hours', 'business', 'information'],
  },
  {
    id: 'announce-2',
    category: 'announcement',
    title: 'Event Announcement',
    description: 'Special event announcement',
    text: 'Join us for [Event Name] on [Date] at [Location]. This exciting event features [Highlights]. Tickets are [Price] and available now at [Website]. Don\'t miss out on this incredible opportunity!',
    tags: ['event', 'invitation', 'promotional'],
    popular: true,
  },
  {
    id: 'announce-3',
    category: 'announcement',
    title: 'Safety Alert',
    description: 'Safety or emergency announcement',
    text: 'Attention: This is an important safety announcement. [Situation Description]. Please [Action Required]. For more information or assistance, contact [Contact Information]. Your safety is our priority.',
    tags: ['safety', 'emergency', 'alert'],
  },
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string): TextTemplate[] => {
  return textTemplates.filter(template => template.category === category);
};

/**
 * Get popular templates
 */
export const getPopularTemplates = (): TextTemplate[] => {
  return textTemplates.filter(template => template.popular);
};

/**
 * Search templates
 */
export const searchTemplates = (query: string): TextTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return textTemplates.filter(template => 
    template.title.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    template.text.toLowerCase().includes(lowerQuery)
  );
};
