// Advanced message template system with AI-powered response classification
// and personalized template selection based on BorderPlus international nursing services

// Initial message templates (first contact)
export const initialMessageTemplates = [
  {
    id: 'init1',
    name: 'Standard Introduction',
    text: "Hello {{name}}, this is Emma from BorderPlus. We help international nurses like you explore healthcare opportunities abroad, particularly in Germany. I noticed your interest in {{interest}}. Would you like to learn more about the process?",
    responseOptions: ["Yes, tell me more", "Not interested", "Call me"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'init2',
    name: 'Career Opportunity Focus',
    text: "Hi {{name}}, Emma from BorderPlus here. We specialize in connecting international nursing talent with premium healthcare positions in Germany. Based on your {{interest}} background, you might be perfect for several openings we have. Would you like to discuss these opportunities?",
    responseOptions: ["Yes, interested", "What are the requirements?", "What about salary?"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'init3',
    name: 'Benefit-Oriented Approach',
    text: "Hi {{name}}! This is Emma from BorderPlus International Nursing Network. Many nurses with your {{interest}} experience are earning 2-3x their current salary through our German placement program. Would you be interested in learning how this works?",
    responseOptions: ["Yes, interested", "Tell me about requirements", "Not right now"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'init4',
    name: 'Question-Based Approach',
    text: "Hello {{name}}, Emma from BorderPlus here. Have you ever considered using your {{interest}} skills to work in the German healthcare system? We have helped hundreds of nurses like you secure positions with excellent benefits and career growth.",
    responseOptions: ["Yes, I'm interested", "What's the process?", "What qualifications needed?"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'init5',
    name: 'Problem-Solution Approach',
    text: "Hi {{name}}, I'm Emma from BorderPlus. Many {{interest}} nurses face challenges with career advancement and compensation. Our program helps nurses secure positions in Germany with better pay, work-life balance, and professional growth. Would this interest you?",
    responseOptions: ["Yes, that sounds good", "Tell me more", "What's required?"],
    sandboxPrefix: "Hello! This is BorderPlus."
  }
];

// First follow-up templates (20 seconds/24 hours after initial message)
export const firstFollowUpTemplates = [
  {
    id: 'follow1',
    name: 'Gentle Reminder',
    text: "Hi {{name}}, Emma from BorderPlus again. I wanted to follow up on my message about international nursing opportunities in Germany. Many positions match your {{interest}} experience. Would you like to learn more?",
    responseOptions: ["Yes, interested now", "Not right now", "What are the requirements?"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'follow2',
    name: 'Value Proposition',
    text: "Hello {{name}}, just following up about the nursing opportunities in Germany. With your {{interest}} background, you could qualify for positions offering 50-70k EUR annually plus benefits. Interested in hearing more?",
    responseOptions: ["Yes, tell me more", "What's the application process?", "Not at this time"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'follow3',
    name: 'Scarcity Approach',
    text: "Hi {{name}}, Emma from BorderPlus here. We currently have several openings in German hospitals for nurses with {{interest}} experience. These positions tend to fill quickly. Would you like more information?",
    responseOptions: ["Yes, please", "What are the requirements?", "Not interested"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'follow4',
    name: 'Question-Based Follow-up',
    text: "Hello {{name}}, following up on my previous message. Was there any specific information about nursing opportunities in Germany that you were interested in? I'd be happy to address any questions about the {{interest}} positions available.",
    responseOptions: ["Tell me about requirements", "Salary information", "Work conditions"],
    sandboxPrefix: "Hello! This is BorderPlus."
  }
];

// Second follow-up templates (30 seconds/48 hours after first follow-up)
export const secondFollowUpTemplates = [
  {
    id: 'follow2_1',
    name: 'Final Opportunity',
    text: "Hi {{name}}, this is my final follow-up. BorderPlus has helped hundreds of nurses with {{interest}} experience secure rewarding positions in Germany. If you're interested, please let me know and I'll send you information on the next steps.",
    responseOptions: ["Yes, I'm interested", "Send information", "Not at this time"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'follow2_2',
    name: 'Resource Offering',
    text: "Hello {{name}}, I wanted to offer you a free resource on international nursing opportunities in Germany specifically for those with {{interest}} background. Would you like me to send it to you?",
    responseOptions: ["Yes, send it", "No thanks", "Tell me more first"],
    sandboxPrefix: "Hello! This is BorderPlus."
  },
  {
    id: 'follow2_3',
    name: 'Success Story',
    text: "Hi {{name}}, I wanted to share that a nurse with similar {{interest}} experience recently joined our program and is now working at a top German hospital with a 60% higher salary. Would you like to learn how we can help you achieve similar results?",
    responseOptions: ["Yes, interested", "What was their experience?", "Not right now"],
    sandboxPrefix: "Hello! This is BorderPlus."
  }
];

// Response handling templates - used to respond to common replies
export const responseHandlingTemplates = {
  // Positive interest responses
  interested: [
    {
      id: 'response_interested_1',
      text: "Great to hear you're interested, {{name}}! To work as a nurse in Germany, you'll need: 1) Nursing qualification verification 2) German language certification (B1/B2 level) 3) Work visa. BorderPlus helps with all of these. Would you like to know more about our process?",
      responseOptions: ["Yes, tell me more", "How long does it take?", "What about language?"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_interested_2',
      text: "Excellent, {{name}}! Here's how BorderPlus helps nurses move to Germany: We verify your qualifications, assist with language learning, help with visa applications, and connect you with employers. The process typically takes 6-12 months. Would you like to start with a free assessment?",
      responseOptions: ["Yes, assess my qualifications", "Tell me about language", "What about costs?"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ],
  
  // Requirement questions
  requirements: [
    {
      id: 'response_requirements_1',
      text: "Happy to explain the requirements, {{name}}. To work as a nurse in Germany you need: 1) Nursing qualification (BSc or equivalent) 2) German language certification (B1/B2) 3) Experience (preferred but not always required). BorderPlus helps with all requirements. Would you like assistance with any of these?",
      responseOptions: ["Language assistance", "Qualification verification", "Tell me about the process"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_requirements_2',
      text: "For German nursing positions, {{name}}, you'll need: Nursing qualification verification, German language proficiency (B1/B2), and work visa. Most {{interest}} specialists need 6-10 months to complete these requirements with our support. Would you like to know which hospitals are hiring?",
      responseOptions: ["Yes, which hospitals", "Tell me about language", "How much does it cost?"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ],
  
  // Salary/benefits questions
  salary: [
    {
      id: 'response_salary_1',
      text: "Great question about compensation, {{name}}. Nurses in Germany with {{interest}} specialization typically earn €42,000-€65,000 annually depending on experience and location. Benefits include 30 days paid vacation, health insurance, and pension contributions. Would you like to know more about specific positions?",
      responseOptions: ["Yes, show me positions", "What cities available?", "Tell me about the process"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_salary_2',
      text: "Regarding salary, {{name}}, German hospitals offer nursing positions with competitive compensation: €40,000-€60,000 based on experience and specialization. Your {{interest}} background would likely place you in the higher range. Benefits include comprehensive healthcare, retirement plans, and work-life balance. Interested in applying?",
      responseOptions: ["Yes, how to apply", "What about housing?", "Tell me about hospitals"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ],
  
  // Language questions
  language: [
    {
      id: 'response_language_1',
      text: "Regarding language requirements, {{name}}, you'll need German proficiency at B1/B2 level. BorderPlus offers specialized language courses for healthcare professionals. Many of our candidates reach B1 in 4-6 months with our program. Would you like information about our language courses?",
      responseOptions: ["Yes, language courses", "How much do they cost?", "Other requirements?"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_language_2',
      text: "For the language requirement, {{name}}, you need German B1/B2 level. Our specialized medical German courses are designed for healthcare professionals and have a 92% success rate. Many start with zero German knowledge. Would you like to take a free language assessment?",
      responseOptions: ["Yes, assess my level", "How long to learn?", "Tell me about costs"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ],
  
  // Process questions
  process: [
    {
      id: 'response_process_1',
      text: "The BorderPlus process has 5 steps, {{name}}: 1) Skills assessment 2) German language training 3) Document verification 4) Hospital matching 5) Visa application. Timeline: typically 6-12 months from start to working in Germany. Would you like to begin with a free assessment?",
      responseOptions: ["Yes, free assessment", "Which hospitals?", "What about costs?"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_process_2',
      text: "Our process at BorderPlus, {{name}}, includes: Qualification verification, language training, hospital matching, and relocation support. For {{interest}} specialists, we usually complete this in 6-10 months. We have partnerships with over 60 German healthcare facilities. Would you like to start the process?",
      responseOptions: ["Yes, let's start", "Tell me about costs", "Need to think about it"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ],
  
  // Negative responses
  notInterested: [
    {
      id: 'response_not_interested_1',
      text: "I understand, {{name}}. International relocation is a big decision. If you change your mind or have questions about nursing opportunities in Germany, feel free to reach out. Would you like me to send some information for future reference?",
      responseOptions: ["Yes, send information", "No thanks"],
      sandboxPrefix: "Hello! This is BorderPlus."
    },
    {
      id: 'response_not_interested_2',
      text: "Thank you for letting me know, {{name}}. If your circumstances change or you'd like to learn more about international nursing opportunities in the future, our team at BorderPlus is always here to help. Have a great day!",
      responseOptions: ["Maybe later", "Thank you"],
      sandboxPrefix: "Hello! This is BorderPlus."
    }
  ]
};

// Select a random template from the appropriate category
export const getRandomTemplate = (templateType) => {
  let templates;
  
  switch(templateType) {
    case 'initial':
      templates = initialMessageTemplates;
      break;
    case 'firstFollowUp':
      templates = firstFollowUpTemplates;
      break;
    case 'secondFollowUp':
      templates = secondFollowUpTemplates;
      break;
    default:
      templates = initialMessageTemplates;
  }
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

// Function to classify user responses into categories for appropriate replies
export const classifyResponse = (responseText) => {
  responseText = responseText.toLowerCase();
  
  // Positive interest patterns
  if (responseText.match(/yes|interested|tell me more|want to know|like to learn|sounds good|sign|join/)) {
    return 'interested';
  }
  
  // Requirement questions
  if (responseText.match(/requirement|qualify|qualification|need to have|eligible|how can i|what do i need/)) {
    return 'requirements';
  }
  
  // Salary/benefits questions
  if (responseText.match(/salary|pay|earn|money|income|benefit|compensation|how much/)) {
    return 'salary';
  }
  
  // Language questions
  if (responseText.match(/language|german|deutsch|speak|b1|b2|learn/)) {
    return 'language';
  }
  
  // Process questions
  if (responseText.match(/process|how|work|step|timeline|long|take|procedure|when/)) {
    return 'process';
  }
  
  // Negative responses
  if (responseText.match(/no|not interested|don't|do not|won't|will not|later|busy|another time|not now/)) {
    return 'notInterested';
  }
  
  // Default to interested if we can't classify
  return 'interested';
};

// Get appropriate response template based on user's reply
export const getResponseTemplate = (userReplyCategory) => {
  const templates = responseHandlingTemplates[userReplyCategory];
  if (!templates || templates.length === 0) {
    return responseHandlingTemplates.interested[0]; // Default fallback
  }
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};
