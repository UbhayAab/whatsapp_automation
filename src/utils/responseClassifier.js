/**
 * Response Classifier for WhatsApp Lead Manager
 * 
 * This utility analyzes incoming WhatsApp responses from leads
 * and classifies them into categories for appropriate follow-up.
 * 
 * Categories include:
 * - positive: Expressing interest or asking for more information
 * - negative: Declining or showing no interest
 * - question: Asking specific questions about the service
 * - schedule: Requesting to schedule a call or meeting
 * - later: Interested but wants to be contacted later
 * - neutral: Generic responses that don't fit other categories
 * - confirmation: Confirming receipt of message
 * - unclear: Messages that cannot be clearly classified
 */

/**
 * Classify a message response into appropriate categories
 * @param {string} messageText - The message text to classify
 * @returns {object} Classification result including category, confidence, keywords, and recommended template
 */
export const classifyResponse = (messageText) => {
  if (!messageText) return {
    category: 'unclear',
    confidence: 0,
    keywords: [],
    recommendedTemplate: 'Unable to classify empty message'
  };
  
  // Convert to lowercase for case-insensitive matching
  const text = messageText.toLowerCase();
  
  // Define keywords for each category
  const positiveKeywords = [
    'yes', 'sure', 'interested', 'tell me more', 'more information',
    'sounds good', 'would like', 'want to know', 'sign me up', 'apply',
    'how can i', 'next step', 'good', 'great', 'wonderful', 'amazing',
    'perfect', 'excellent', 'nice', 'helpful', 'useful', 'proceed',
    'let\'s do it', 'go ahead', 'send details', 'provide details'
  ];
  
  const negativeKeywords = [
    'no', 'not interested', 'sorry', 'don\'t contact', 'stop', 'unsubscribe',
    'remove me', 'go away', 'leave me alone', 'not now', 'not looking',
    'don\'t want', 'not for me', 'decline', 'reject', 'no thanks', 'nope',
    'pass', 'never', 'won\'t', 'cannot', 'not suitable', 'bad'
  ];
  
  const questionKeywords = [
    'what', 'how', 'where', 'when', 'why', 'who', 'which', 'is it',
    'do you', 'can i', 'would', 'could', 'should', 'requirements',
    'qualifications', 'eligibility', 'criteria', 'process', 'duration',
    'steps', 'procedure', 'work', 'job', 'position', 'role', 'function'
  ];
  
  const scheduleKeywords = [
    'call', 'meeting', 'discuss', 'talk', 'time', 'schedule', 'appointment',
    'meet', 'connect', 'contact', 'consultation', 'session', 'interview',
    'speak', 'chat', 'zoom', 'teams', 'skype', 'google meet', 'conference'
  ];
  
  const laterKeywords = [
    'later', 'not now', 'busy', 'another time', 'next week', 'next month',
    'after', 'future', 'postpone', 'delay', 'defer', 'not ready', 'remind',
    'get back', 'contact again', 'message again', 'check back', 'some time',
    'future', 'soon', 'tomorrow', 'next day', 'weekend'
  ];
  
  const confirmationKeywords = [
    'ok', 'okay', 'received', 'got it', 'thanks', 'thank you', 'ty', 'thx',
    'acknowledge', 'noted', 'acknowledged', 'understood', 'understand',
    'noted', 'seen', 'viewed', 'read', 'known', 'clear', 'got your message'
  ];

  const salaryKeywords = [
    'salary', 'pay', 'compensation', 'money', 'euros', 'dollars', 'income',
    'earnings', 'wage', 'payment', 'financial', 'stipend', 'remuneration',
    'benefits', 'package', 'offer', 'take home', 'net', 'gross', 'earn'
  ];
  
  const visaKeywords = [
    'visa', 'immigration', 'work permit', 'resident permit', 'residency',
    'migrate', 'moving', 'relocation', 'papers', 'documents', 'legal',
    'authorization', 'citizenship', 'passport', 'embassy', 'consulate'
  ];
  
  const languageKeywords = [
    'language', 'german', 'deutsch', 'speak', 'fluent', 'proficiency', 
    'course', 'learn', 'classes', 'training', 'level', 'requirement',
    'communication', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'goethe'
  ];
  
  const timelineKeywords = [
    'timeline', 'duration', 'how long', 'when', 'start date', 'time frame',
    'process time', 'waiting period', 'date', 'month', 'year', 'week',
    'schedule', 'deadline', 'timeframe', 'journey', 'roadmap', 'path'
  ];

  // Check for specific salary/compensation questions as these are high priority
  const salaryQuestionPatterns = [
    /how much (is|will|would) (the|my) (salary|pay|compensation|income)/i,
    /what (is|will be|would be) (the|my) (salary|pay|compensation|income)/i,
    /salary (details|information|package|offer)/i,
    /how much (money|euros|dollars) (can i|will i|would i) (make|earn|get)/i
  ];
  
  // Check for specific visa/immigration questions as these are also high priority
  const visaQuestionPatterns = [
    /(visa|immigration|work permit|resident permit|relocation) (process|requirement|procedure|details)/i,
    /how (can|do|would) i get a (visa|work permit|immigration status)/i,
    /will you (help|assist|support) with (visa|immigration|relocation|work permit)/i,
    /what (visa|document|paperwork) do i need/i
  ];
  
  // Check for language-related questions
  const languageQuestionPatterns = [
    /do i (need|require|have) to (speak|know|learn) (german|deutsch)/i,
    /what (level|proficiency) of (german|language) (is|will be) (required|needed)/i,
    /(german|language) (courses|classes|training|requirements)/i,
    /how (can|do|will) i learn (german|the language)/i
  ];
  
  // Check for timeline questions
  const timelineQuestionPatterns = [
    /how long (does|will) (it|the process) take/i,
    /what('s| is) the (timeline|timeframe|duration|process time)/i,
    /when (can|could|would) i (start|begin|move|relocate)/i,
    /how (soon|quickly|fast) can (i|the process) (start|begin|proceed)/i
  ];

  // Initialize result object
  let result = {
    category: 'unclear',
    confidence: 0,
    keywords: [],
    recommendedTemplate: 'General response template for unclear messages'
  };
  
  // Extract all matched keywords from the text
  const extractMatchedKeywords = (keywordList, text) => {
    return keywordList.filter(keyword => text.includes(keyword));
  };
  
  // Calculate confidence based on keyword matches (simple version)
  const calculateConfidence = (matches, threshold = 1) => {
    if (matches.length === 0) return 0;
    // Base confidence on number of matching keywords with diminishing returns
    return Math.min(Math.round((1 - (1 / (matches.length + 1))) * 100), 95);
  };
  
  // Check for specific question patterns first since they're highest priority
  if (salaryQuestionPatterns.some(pattern => pattern.test(messageText))) {
    const matchedKeywords = extractMatchedKeywords(salaryKeywords, text);
    return {
      category: 'salary_question',
      confidence: calculateConfidence(matchedKeywords, 1) + 5, // Boost confidence for pattern match
      keywords: matchedKeywords.length > 0 ? matchedKeywords : ['salary'],
      recommendedTemplate: 'Information about salary ranges and benefits for nurses in Germany'
    };
  }
  
  if (visaQuestionPatterns.some(pattern => pattern.test(messageText))) {
    const matchedKeywords = extractMatchedKeywords(visaKeywords, text);
    return {
      category: 'visa_question',
      confidence: calculateConfidence(matchedKeywords, 1) + 5,
      keywords: matchedKeywords.length > 0 ? matchedKeywords : ['visa'],
      recommendedTemplate: 'Information about visa process and relocation support'
    };
  }
  
  if (languageQuestionPatterns.some(pattern => pattern.test(messageText))) {
    const matchedKeywords = extractMatchedKeywords(languageKeywords, text);
    return {
      category: 'language_question',
      confidence: calculateConfidence(matchedKeywords, 1) + 5,
      keywords: matchedKeywords.length > 0 ? matchedKeywords : ['language'],
      recommendedTemplate: 'Information about language requirements and training opportunities'
    };
  }
  
  if (timelineQuestionPatterns.some(pattern => pattern.test(messageText))) {
    const matchedKeywords = extractMatchedKeywords(timelineKeywords, text);
    return {
      category: 'timeline_question',
      confidence: calculateConfidence(matchedKeywords, 1) + 5,
      keywords: matchedKeywords.length > 0 ? matchedKeywords : ['timeline'],
      recommendedTemplate: 'Information about the timeline and process duration'
    };
  }
  
  // Now process general categories
  const categoryMatches = {
    positive: extractMatchedKeywords(positiveKeywords, text),
    negative: extractMatchedKeywords(negativeKeywords, text),
    question: extractMatchedKeywords(questionKeywords, text),
    schedule: extractMatchedKeywords(scheduleKeywords, text),
    later: extractMatchedKeywords(laterKeywords, text),
    confirmation: extractMatchedKeywords(confirmationKeywords, text)
  };
  
  // Find the category with the most matches
  let bestCategory = 'unclear';
  let bestMatches = [];
  let highestCount = 0;
  
  for (const [category, matches] of Object.entries(categoryMatches)) {
    if (matches.length > highestCount) {
      highestCount = matches.length;
      bestCategory = category;
      bestMatches = matches;
    }
  }
  
  // Calculate confidence
  const confidence = calculateConfidence(bestMatches);
  
  // If we have a very low confidence, default to unclear
  if (confidence < 30) {
    bestCategory = 'unclear';
    // Check if message is very short or looks generic/neutral
    const neutralPattern = /^(hi|hello|hey|greetings|good day|good morning|good afternoon|good evening)/i;
    if (text.length < 10 || neutralPattern.test(text)) {
      bestCategory = 'neutral';
    }
  }
  
  // Prepare template recommendations based on category
  const templateRecommendations = {
    positive: 'Positive response template with next steps information',
    negative: 'Polite acknowledgment of declining interest',
    question: 'General information about the nursing program',
    schedule: 'Options for scheduling a consultation call',
    later: 'Confirmation of follow-up at a later time',
    confirmation: 'Acknowledgment of their confirmation',
    neutral: 'Engaging response to encourage more specific input',
    unclear: 'Request for clarification on their interests or questions'
  };
  
  return {
    category: bestCategory,
    confidence: confidence,
    keywords: bestMatches.length > 0 ? bestMatches : ['generic'],
    recommendedTemplate: templateRecommendations[bestCategory] || 'Generic response template'
  };
};

/**
 * Get an appropriate response template based on the message classification
 * @param {string} category - The classified message category
 * @returns {object} The response template object with text and metadata
 */
export const getResponseTemplate = (category) => {
  const templates = {
    positive: {
      id: 'positive_response',
      text: "That's great to hear, {{name}}! We're excited about your interest in nursing opportunities in Germany. Would you like to schedule a quick call to discuss specific roles that match your background and interests? We also have some detailed information about salary ranges, visa requirements, and the relocation process that I can share with you.",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    negative: {
      id: 'negative_response',
      text: "Thank you for your response, {{name}}. I understand that this opportunity might not be for you at the moment. If your situation changes in the future, or if you have colleagues who might be interested in nursing opportunities in Germany, please feel free to reach out. Wishing you all the best in your career!",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    question: {
      id: 'question_response',
      text: "Thanks for your question, {{name}}! As part of our international nursing recruitment program, we provide comprehensive support including language training, licensing assistance, and relocation services. For more specific details, could you let me know what aspect of the program you're most interested in learning about? We're here to help with all your questions about working as a nurse in Germany.",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    salary_question: {
      id: 'salary_question_response',
      text: "Great question about compensation, {{name}}! Nurses in Germany typically earn between €35,000-€50,000 annually depending on experience and specialization. This is complemented by excellent benefits including healthcare, pension contributions, paid vacation (25-30 days), and additional allowances. Would you like me to provide more specific salary information based on your nursing experience and specialization?",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    visa_question: {
      id: 'visa_question_response',
      text: "Thank you for asking about the visa process, {{name}}. We provide full support for your work visa application to Germany. Our team handles most of the paperwork, coordinates with German authorities, and guides you through each step. The process typically takes 2-3 months. We also assist with credential recognition and language certification. Would you like to know more specific details about your situation?",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    schedule: {
      id: 'schedule_response',
      text: "I'd be happy to schedule a call with you, {{name}}! Our nursing career consultants are available Monday through Friday from 9 AM to 7 PM CET. Please let me know what day and time works best for you, and I'll arrange a call to discuss the nursing opportunities in Germany in more detail. You can also share your specific questions in advance so we can prepare the most relevant information for you.",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    later: {
      id: 'later_response',
      text: "I understand timing is important, {{name}}. No problem at all! We'll reach out to you at a later time. In the meantime, if you'd like, I can send you some helpful resources about nursing careers in Germany, including information about the registration process, language requirements, and typical workplace expectations. Just let me know what interests you most!",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    confirmation: {
      id: 'confirmation_response',
      text: "Thank you for confirming, {{name}}. If you have any specific questions about nursing opportunities in Germany, such as qualification recognition, language requirements, or the application process, please don't hesitate to ask. We're here to support your international nursing career journey every step of the way.",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    neutral: {
      id: 'neutral_response',
      text: "Thank you for your message, {{name}}. We're here to provide you with information about exciting nursing opportunities in Germany. Would you like to learn more about the application process, salary expectations, or the support we provide for relocation? Feel free to ask any questions you might have!",
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    
    unclear: {
      id: 'unclear_response',
      text: "Thank you for reaching out, {{name}}. I'm not sure I completely understood your message. Could you please clarify what specific information you're looking for about nursing opportunities in Germany? We're happy to assist with details about the application process, salary expectations, work environment, or relocation support.",
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  };
  
  return templates[category] || templates.neutral;
};

/**
 * Get a random template from a specific category
 * @param {string} category - The template category to get
 * @returns {object} A randomly selected template
 */
export const getRandomTemplate = (category) => {
  // Template categories
  const templates = {
    initial: [
      {
        id: 'initial_template_1',
        text: "Hello {{name}}! This is Sophie from BorderPlus. We help international nurses find rewarding careers in Germany. I noticed your interest in {{interest}} and wanted to reach out. Are you interested in learning more about nursing opportunities in Germany with excellent pay and benefits?",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'initial_template_2',
        text: "Hi {{name}}! I'm Max from BorderPlus. We specialize in connecting talented nurses with high-paying positions in German hospitals. Given your background in {{interest}}, I thought you might be interested in exploring these opportunities. Would you like to know more about the benefits and support we offer?",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'initial_template_3',
        text: "Greetings {{name}}! This is Anna from BorderPlus. We help nurses build international careers in Germany's healthcare system. Based on your experience with {{interest}}, I wanted to share some exciting nursing opportunities with comprehensive relocation support. Would you be interested in learning more?",
        sandboxPrefix: "Hello! This is BorderPlus."
      }
    ],
    
    firstFollowUp: [
      {
        id: 'followup_template_1',
        text: "Hello again {{name}}! Just following up on my previous message about nursing opportunities in Germany. We offer full relocation support, language training, and starting salaries from €35,000-€45,000. Would you like to learn more about how we can help advance your nursing career internationally?",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'followup_template_2',
        text: "Hi {{name}}, I wanted to check if you received my earlier message about nursing careers in Germany. Our program includes visa assistance, free language courses, and accommodation support during your transition. Is this something you'd be interested in exploring further?",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'followup_template_3',
        text: "Hello {{name}}! I'm reaching out again regarding the nursing opportunities in Germany I mentioned earlier. Many nurses like yourself have successfully relocated with our support and are enjoying better work-life balance and professional growth. Would you have a few minutes to discuss if this might be a good fit for you?",
        sandboxPrefix: "Hello! This is BorderPlus."
      }
    ],
    
    secondFollowUp: [
      {
        id: 'second_followup_template_1',
        text: "Hi {{name}}, I wanted to make one final connection about the nursing opportunities in Germany. We're currently accepting applications for positions starting in the next few months, with full relocation packages. If you're interested, please let me know, and I'd be happy to provide more specific information tailored to your experience.",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'second_followup_template_2',
        text: "Hello {{name}}, this is my last follow-up regarding the nursing positions in Germany. These roles offer competitive salaries, excellent benefits, and professional development opportunities. If this isn't the right time, no problem - but please keep us in mind for the future. Would you like me to send some information you can review later?",
        sandboxPrefix: "Hello! This is BorderPlus."
      },
      {
        id: 'second_followup_template_3',
        text: "Hi {{name}}, I wanted to reach out one final time about our nursing recruitment program for Germany. We've helped hundreds of international nurses successfully relocate and advance their careers. If you'd like to learn more or discuss potential opportunities, I'm here to help. Otherwise, I wish you all the best in your nursing career!",
        sandboxPrefix: "Hello! This is BorderPlus."
      }
    ]
  };
  
  // Get templates for the specified category
  const categoryTemplates = templates[category];
  
  // If category doesn't exist or is empty, return a default template
  if (!categoryTemplates || categoryTemplates.length === 0) {
    return {
      id: 'default_template',
      text: "Hello {{name}}! This is BorderPlus. We help international nurses find rewarding careers in Germany. Would you like to learn more about our opportunities?",
      sandboxPrefix: "Hello! This is BorderPlus."
    };
  }
  
  // Select a random template from the category
  const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
  return categoryTemplates[randomIndex];
};

export default {
  classifyResponse,
  getResponseTemplate,
  getRandomTemplate
};
