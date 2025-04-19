/**
 * Enhanced Response Classifier for BorderPlus WhatsApp Lead Manager
 * 
 * This utility provides sophisticated analysis of incoming WhatsApp responses 
 * from leads and classifies them into detailed categories for appropriate follow-up.
 * 
 * Advanced classification categories:
 * - positive: Expressing interest or asking for more information
 * - negative: Declining or showing no interest
 * - question: General questions about the service
 * - salary_question: Specific questions about compensation
 * - visa_question: Questions about visa/immigration process
 * - language_question: Questions about language requirements
 * - timeline_question: Questions about process timeline
 * - schedule: Requesting to schedule a call or meeting
 * - later: Interested but wants to be contacted later
 * - confirmation: Confirming receipt of message
 * - neutral: Generic responses that don't fit other categories
 * - unclear: Messages that cannot be clearly classified
 */

import { getRandomTemplate } from '../data/enhancedMessageTemplates';

/**
 * Enhanced system to classify message responses into appropriate categories
 * @param {string} messageText - The message text to classify
 * @returns {string} The response category
 */
export const classifyResponse = (messageText) => {
  if (!messageText) return 'unclear';
  
  // Convert to lowercase for case-insensitive matching
  const text = messageText.toLowerCase().trim();
  
  // Define AI patterns for major categories
  const patterns = {
    // Salary & compensation patterns
    salary_question: [
      /how much (is|will|would) (the|my) (salary|pay|compensation|income)/i,
      /what (is|will be|would be) (the|my) (salary|pay|compensation|income)/i,
      /salary (details|information|package|offer)/i,
      /how much (money|euros|dollars) (can i|will i|would i) (make|earn|get)/i,
      /(tell|inform) me.*(salary|pay|earn|income|wages)/i,
      /salary/i,
      /pay.*range/i,
      /how.*pay/i,
      /annual.*income/i,
      /compensation.*package/i
    ],
    
    // Visa & immigration patterns
    visa_question: [
      /(visa|immigration|work permit|resident permit|relocation) (process|requirement|procedure|details)/i,
      /how (can|do|would) i get a (visa|work permit|immigration status)/i,
      /will you (help|assist|support) with (visa|immigration|relocation|work permit)/i,
      /what (visa|document|paperwork) do i need/i,
      /visa.*process/i,
      /work permit/i,
      /immigration/i,
      /relocation.*help/i,
      /move to germany/i
    ],
    
    // Language patterns
    language_question: [
      /(german|language) (requirement|proficiency|skill|level)/i,
      /do i need (to|speak|know) (german|the language)/i,
      /how (much|good) german (do i need|is required|should i know)/i,
      /language.*(class|course|training|learn)/i,
      /learn german/i,
      /speak.*german/i,
      /german.*course/i,
      /language.*requirement/i,
      /german.*level/i,
      /proficiency/i
    ],
    
    // Timeline patterns
    timeline_question: [
      /how (long|much time) (does|will) (it|the process) take/i,
      /what (is|are) the (timeline|timeframe|steps|process)/i,
      /when (can|could|would) i (start|begin|move|relocate)/i,
      /timeline/i,
      /timeframe/i,
      /how.*long.*process/i,
      /steps involved/i,
      /start date/i,
      /process.*duration/i,
      /when.*move/i
    ],
    
    // Scheduling patterns
    schedule: [
      /(can|could) (we|you|i) (have|schedule|arrange|book) a (call|chat|meeting|conversation)/i,
      /(i|would|let|let's) (like|want|prefer) (to|a) (call|speak|talk|discuss)/i,
      /when (are|would) (you|we) (available|free) (for|to) (a|chat|talk|call)/i,
      /schedule.*call/i,
      /arrange.*meeting/i,
      /book.*appointment/i,
      /call me/i,
      /contact me/i,
      /let's talk/i,
      /discuss.*details/i
    ],
    
    // Later/not now patterns
    later: [
      /(contact|reach|message) me (later|again|next|another time)/i,
      /(busy|occupied|unavailable) (now|at the moment|currently)/i,
      /(not|isn't) (a good|the right) time/i,
      /get back to me (later|in|next)/i,
      /try (again|later|next)/i,
      /later/i,
      /next week/i,
      /not now/i,
      /another time/i,
      /in the future/i
    ],
    
    // Positive patterns
    positive: [
      /(yes|sure|certainly|absolutely|definitely) (i am|i'm|im|i) interested/i,
      /(would|want|like|love|keen) (to|more) (know|learn|hear|information)/i,
      /tell me more/i,
      /sounds (good|great|interesting|exciting)/i,
      /interested/i,
      /more.*details/i,
      /more.*information/i,
      /learn more/i,
      /sign me up/i,
      /how.*apply/i
    ],
    
    // Negative patterns
    negative: [
      /(no|not) (interested|looking|seeking|wanting)/i,
      /don't (contact|message|bother|disturb|call|text)/i,
      /(remove|delete|take) me (from|off) (your|the) (list|database)/i,
      /stop (messaging|sending|texting)/i,
      /not interested/i,
      /no thanks/i,
      /go away/i,
      /leave me alone/i,
      /unsubscribe/i,
      /stop.*message/i
    ],
    
    // General question patterns
    question: [
      /what (is|are) (the|your) (process|benefit|advantage|requirement|qualification)/i,
      /how (do|does|would) (the|this|your) (process|service|program) work/i,
      /can you (tell|explain|elaborate) (me|more) (about|on)/i,
      /process/i,
      /requirements/i,
      /qualifications/i,
      /how does it work/i,
      /what.*need/i,
      /explain/i,
      /tell me about/i
    ],
    
    // Confirmation patterns
    confirmation: [
      /(ok|okay|got it|understood|received|thanks|thank you|noted)/i,
      /(will|i'll) (consider|think about|check|review|read)/i,
      /thanks for (reaching|contacting|sending|sharing)/i,
      /received/i,
      /got it/i,
      /thank you/i,
      /thanks/i,
      /noted/i,
      /understood/i,
      /will check/i
    ]
  };
  
  // Check for direct pattern matches first (prioritizing specific categories)
  const categories = [
    'salary_question', 'visa_question', 'language_question', 
    'timeline_question', 'schedule', 'later', 'positive', 
    'negative', 'question', 'confirmation'
  ];
  
  for (const category of categories) {
    for (const pattern of patterns[category]) {
      if (pattern.test(text)) {
        return category;
      }
    }
  }
  
  // If no pattern matches, use keyword analysis as fallback
  const keywordAnalysis = analyzeKeywords(text);
  return keywordAnalysis;
};

/**
 * Keyword-based analysis for messages that don't match patterns
 * @param {string} text - Lowercase text to analyze
 * @returns {string} Category based on keyword analysis
 */
const analyzeKeywords = (text) => {
  // Define keywords for each category
  const categoryKeywords = {
    positive: [
      'yes', 'interested', 'tell me more', 'more information',
      'sounds good', 'would like', 'want to know', 'sign me up', 'apply',
      'how can i', 'next step', 'good', 'great', 'wonderful', 'amazing',
      'perfect', 'excellent', 'nice', 'helpful', 'useful', 'proceed',
      'let\'s do it', 'go ahead', 'send details', 'provide details'
    ],
    
    negative: [
      'no', 'not interested', 'sorry', 'don\'t contact', 'stop', 'unsubscribe',
      'remove me', 'go away', 'leave me alone', 'not now', 'not looking',
      'don\'t want', 'not for me', 'decline', 'reject', 'no thanks', 'nope',
      'pass', 'never', 'won\'t', 'cannot', 'not suitable', 'bad'
    ],
    
    question: [
      'what', 'how', 'where', 'when', 'why', 'who', 'which', 'is it',
      'do you', 'can i', 'would', 'could', 'should', 'requirements',
      'qualifications', 'eligibility', 'criteria', 'process', 'duration',
      'steps', 'procedure', 'work', 'job', 'position', 'role', 'function'
    ],
    
    schedule: [
      'call', 'meeting', 'discuss', 'talk', 'time', 'schedule', 'appointment',
      'meet', 'connect', 'contact', 'consultation', 'session', 'interview',
      'speak', 'chat', 'zoom', 'teams', 'skype', 'google meet', 'conference'
    ],
    
    later: [
      'later', 'not now', 'busy', 'another time', 'next week', 'next month',
      'after', 'future', 'postpone', 'delay', 'defer', 'not ready', 'remind',
      'get back', 'contact again', 'message again', 'check back', 'some time',
      'future', 'soon', 'tomorrow', 'next day', 'weekend'
    ],
    
    confirmation: [
      'ok', 'okay', 'received', 'got it', 'thanks', 'thank you', 'ty', 'thx',
      'acknowledge', 'noted', 'acknowledged', 'understood', 'understand',
      'noted', 'seen', 'viewed', 'read', 'known', 'clear', 'got your message'
    ]
  };
  
  // Count keyword matches for each category
  const counts = {};
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    counts[category] = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        counts[category]++;
      }
    }
  }
  
  // Find category with most matches
  let bestCategory = 'neutral';
  let bestCount = 0;
  
  for (const [category, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      bestCategory = category;
    }
    // In case of tie, prioritize in this order
    else if (count === bestCount && count > 0) {
      const priority = ['question', 'positive', 'schedule', 'later', 'negative', 'confirmation', 'neutral'];
      const currentIndex = priority.indexOf(bestCategory);
      const newIndex = priority.indexOf(category);
      
      if (newIndex !== -1 && (currentIndex === -1 || newIndex < currentIndex)) {
        bestCategory = category;
      }
    }
  }
  
  // If no significant matches, return neutral or unclear based on text length
  if (bestCount === 0) {
    return text.length < 10 ? 'unclear' : 'neutral';
  }
  
  return bestCategory;
};

/**
 * Get appropriate response template based on message classification
 * @param {string} category - The classified message category
 * @returns {object} A response template object
 */
export const getResponseTemplate = (category) => {
  return getRandomTemplate(category) || getRandomTemplate('neutral');
};

export default {
  classifyResponse,
  getResponseTemplate
};
