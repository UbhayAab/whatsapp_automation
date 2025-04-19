/**
 * Enhanced Message Templates for BorderPlus Nursing Recruitment
 * 
 * This file contains a comprehensive set of message templates for:
 * - Initial outreach messages (multiple variations)
 * - Follow-up messages (multiple variations)
 * - Second follow-up messages (multiple variations)
 * - Response handling templates for different types of responses
 * 
 * Each template has variations to ensure personalization and prevent repetition.
 */

// Sandbox prefix required for Twilio WhatsApp testing
const SANDBOX_PREFIX = "Hello! This is BorderPlus.";

// ============= INITIAL CONTACT TEMPLATES =============
const initialTemplates = [
  {
    id: 'initial_template_1',
    text: "Hello {{name}}! I'm Sophie from BorderPlus. We specialize in connecting qualified nurses like you with excellent opportunities in German hospitals. I noticed your interest in {{interest}} and wanted to reach out. Germany is actively recruiting international nurses with competitive salaries (€35,000-€50,000 annually) and comprehensive benefits. Would you be interested in learning more?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'initial_template_2',
    text: "Hi {{name}}! This is Max from BorderPlus. We help talented healthcare professionals find rewarding nursing careers in Germany. With your background in {{interest}}, you'd be a great fit for several positions we're currently staffing. German hospitals offer excellent work conditions, structured career advancement, and salaries of €35,000-€50,000. Would you like to explore these opportunities?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'initial_template_3',
    text: "Greetings {{name}}! Anna from BorderPlus here. We connect international nurses with premium positions in Germany's healthcare system. Your experience with {{interest}} is highly valued in German hospitals, which offer salaries of €35,000-€50,000, work-life balance, and professional growth opportunities. Are you interested in learning how we could help advance your nursing career in Germany?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'initial_template_4',
    text: "Hello {{name}}! I'm Thomas from BorderPlus, specializing in international nurse recruitment for German healthcare institutions. I came across your profile highlighting {{interest}} and thought you might be interested in opportunities in Germany. The German healthcare system offers nurses competitive compensation (€35,000-€50,000), excellent benefits, and professional development. Would you like to know more?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'initial_template_5',
    text: "Hi {{name}}! Laura from BorderPlus here. We're a specialized agency helping qualified nurses build successful careers in Germany. With your background in {{interest}}, there are several German hospitals that would value your expertise. These positions offer comprehensive benefits, professional growth, and salaries between €35,000-€50,000. Would you be interested in exploring this opportunity?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= FIRST FOLLOW-UP TEMPLATES =============
const firstFollowUpTemplates = [
  {
    id: 'followup_template_1',
    text: "Hello again {{name}}! I wanted to follow up on my previous message about nursing opportunities in Germany. We offer full support throughout the process including language training, credential recognition, visa assistance, and relocation help. Many nurses we've placed are enjoying better work conditions and higher salaries than they had previously. Would you have a few minutes to discuss if this might be a good fit for your career goals?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'followup_template_2',
    text: "Hi {{name}}, just checking if you received my earlier message about nursing positions in Germany. These roles offer not just competitive compensation (€35,000-€50,000) but also excellent work-life balance, continuous education opportunities, and a structured career path. We handle all aspects of the transition, including language training and accommodation arrangements. Is this something you'd like to learn more about?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'followup_template_3',
    text: "Hello {{name}}! I'm reaching out again regarding the nursing opportunities in Germany I mentioned earlier. Germany's healthcare system is actively recruiting international nursing professionals and offers a supportive environment for career development. We provide step-by-step assistance with relocation, including language courses, credential verification, and finding housing. Would this be something you're interested in exploring further?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'followup_template_4',
    text: "Hi {{name}}, I wanted to touch base about the German nursing opportunities I mentioned. Many nurses like yourself have successfully transitioned to Germany with our help and are enjoying better working conditions, professional respect, and higher compensation than in their home countries. We offer comprehensive support throughout the process. Would you be interested in having a brief conversation about how this might benefit your career?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'followup_template_5',
    text: "Hello {{name}}! Following up on my message about nursing careers in Germany. What sets our program apart is the extensive support we provide: free German language training, assistance with credential recognition, visa processing, relocation support, and ongoing mentorship once you're in Germany. Would you like to learn more about how we could help advance your nursing career internationally?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= SECOND FOLLOW-UP TEMPLATES =============
const secondFollowUpTemplates = [
  {
    id: 'second_followup_template_1',
    text: "Hi {{name}}, I wanted to make one final connection about the nursing opportunities in Germany. We're currently preparing nurses for positions starting in the coming months, all with comprehensive relocation packages and starting salaries of €35,000-€50,000. If you're interested in exploring international career options with full support throughout the process, please let me know, and I'd be happy to schedule a call to discuss the details.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'second_followup_template_2',
    text: "Hello {{name}}, this is my final follow-up regarding the nursing positions in Germany. These roles offer not just competitive compensation but also better work-life balance, professional growth opportunities, and a supportive environment. If this isn't the right time for you, I completely understand - but if you'd like to keep this option open for the future, I can send some information for you to review when it's more convenient.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'second_followup_template_3',
    text: "Hi {{name}}, I'm reaching out one last time about our nursing recruitment program for Germany. We've helped hundreds of international nurses successfully relocate and advance their careers with higher salaries, better working conditions, and excellent professional development. If you'd like to explore this opportunity further, I'm here to answer any questions. Otherwise, I wish you all the best in your nursing career!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'second_followup_template_4',
    text: "Hello {{name}}, I wanted to check in one final time regarding the nursing opportunities in Germany I've mentioned. Germany continues to seek qualified international nurses and offers a stable healthcare system with excellent compensation and benefits. If your circumstances change and you become interested in exploring these opportunities, please feel free to reach out. Best wishes for your professional journey!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'second_followup_template_5',
    text: "Hi {{name}}, this is my last message regarding the nursing positions in Germany. Many nurses have found these opportunities to be transformative for their careers and quality of life. The comprehensive support we provide makes the transition smooth and stress-free. If you'd like to discuss this further now or in the future, please don't hesitate to respond. I wish you continued success in your nursing career!",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= POSITIVE RESPONSE HANDLING TEMPLATES =============
const positiveResponseTemplates = [
  {
    id: 'positive_response_1',
    text: "That's great to hear, {{name}}! I'm excited about your interest. There are several pathways available depending on your experience and preferences. Would you like to: 1) Schedule a video call to discuss specific opportunities, 2) Receive detailed information about the application process, salary, and benefits, or 3) Learn more about the language requirements and support we provide? Let me know which you prefer and we can move forward accordingly.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'positive_response_2',
    text: "Wonderful, {{name}}! I'm delighted you're interested. To help you make an informed decision, I'd be happy to provide more information about specific hospitals, specialties in demand, the recognition process for your nursing qualifications, and our comprehensive relocation support. Would you prefer to schedule a call to discuss these details, or would you like me to send more information via message first?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'positive_response_3',
    text: "I'm thrilled to hear of your interest, {{name}}! To move forward, we'll need to understand your specific nursing background, preferences, and timeline. Would you have time for a brief call this week to discuss your experience and the opportunities that would be the best match? Alternatively, I can send you our detailed information package about the German nursing registration process and relocation support we provide.",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= QUESTION RESPONSE HANDLING TEMPLATES =============
const questionResponseTemplates = [
  {
    id: 'question_response_1',
    text: "Great question, {{name}}! As part of our international nursing recruitment program, we provide comprehensive support including language training, licensing assistance, relocation services, and ongoing mentorship. The German healthcare system values international nurses and offers excellent professional development opportunities. Could you share which specific aspects you're most interested in learning more about? I'd be happy to provide more detailed information.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'question_response_2',
    text: "Thank you for your question, {{name}}. Our program for international nurses includes several key components: 1) Free German language training to B1/B2 level, 2) Full assistance with credential recognition and licensing, 3) Visa application support, 4) Relocation assistance including finding accommodation, and 5) Ongoing support once you're in Germany. Is there a particular aspect you'd like me to elaborate on?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'question_response_3',
    text: "I appreciate your question, {{name}}. BorderPlus specializes in connecting qualified nurses with German healthcare institutions that offer competitive salaries, excellent benefits, and professional growth opportunities. Our comprehensive support includes assistance with language acquisition, credential recognition, visa processing, and relocation. Would you like me to explain any of these aspects in more detail?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= SALARY QUESTION TEMPLATES =============
const salaryQuestionTemplates = [
  {
    id: 'salary_question_1',
    text: "That's a great question about compensation, {{name}}. Nurses in Germany typically earn between €35,000-€50,000 annually depending on experience, specialization, and location. This is complemented by excellent benefits including comprehensive health insurance, pension contributions, 25-30 days of paid vacation, and additional allowances. Would you like me to provide more specific salary information based on your nursing experience and specialization?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'salary_question_2',
    text: "Regarding your question about salary, {{name}}, German hospitals offer competitive compensation packages for nurses. The base salary typically ranges from €35,000 to €50,000 per year before taxes, with additional pay for night shifts, weekends, and holidays. Benefits include health insurance, pension contributions, paid vacation (25-30 days), and often subsidized housing during your initial transition. Would you like more specific information based on your qualifications?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'salary_question_3',
    text: "Thank you for asking about compensation, {{name}}. In Germany, nursing salaries range from €35,000 to €50,000 annually depending on qualifications, specialization, and experience. In addition to the base salary, you receive comprehensive health insurance, pension benefits, paid vacation (typically 25-30 days), and often additional allowances for shift work. The cost of living varies by location, but generally allows for a comfortable lifestyle. Would you like more details on how your specific experience would translate to German compensation?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= VISA QUESTION TEMPLATES =============
const visaQuestionTemplates = [
  {
    id: 'visa_question_1',
    text: "Thank you for asking about the visa process, {{name}}. We provide full support for your work visa application to Germany. Our team handles most of the paperwork, coordinates with German authorities, and guides you through each step. The process typically takes 2-3 months. We also assist with credential recognition and language certification. Would you like more specific details about your situation?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'visa_question_2',
    text: "Regarding your visa question, {{name}}, as a qualified nurse, you're eligible for Germany's expedited skilled worker visa. We handle the entire process, including preparing and submitting documents, coordinating with employers and German authorities, and ensuring all requirements are met. The timeline is usually 2-3 months from application to approval. During this time, we also work on your nursing license recognition and help with language certification if needed. Is there a specific aspect of the visa process you'd like to know more about?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'visa_question_3',
    text: "Great question about the visa process, {{name}}. For nurses, Germany offers a streamlined visa pathway. Our service includes: 1) Document preparation and verification, 2) Application submission and tracking, 3) Communication with German immigration authorities, and 4) Guidance until approval. The process typically takes 2-3 months, and we handle all the complex parts. We also assist with credential recognition in parallel to minimize wait times. Would you like me to explain any specific part of this process in more detail?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= LANGUAGE QUESTION TEMPLATES =============
const languageQuestionTemplates = [
  {
    id: 'language_question_1',
    text: "Excellent question about language requirements, {{name}}. Nurses in Germany need to demonstrate German language proficiency at the B2 level. Don't worry if you don't speak German yet - our program includes comprehensive language training. We provide both online and in-person courses, specialized for medical terminology, and our success rate is outstanding. Many nurses complete the required level in 6-9 months while continuing to work in their home country. Would you like more details about our language program?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'language_question_2',
    text: "Regarding your language question, {{name}}, you'll need German proficiency at the B2 level to work as a nurse in Germany. Our program includes fully funded language training with specialized courses for healthcare professionals. We use a combination of online classes, self-study materials, and practice sessions with native speakers. Most nurses achieve the required level in 6-9 months. We also provide ongoing language support even after you begin working in Germany. Do you have any prior experience with German or other languages?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'language_question_3',
    text: "Thank you for asking about language requirements, {{name}}. To practice nursing in Germany, you'll need B2 level German proficiency. Our comprehensive language program is designed specifically for healthcare professionals and includes: 1) Structured online courses, 2) Live sessions with native speakers, 3) Medical terminology training, and 4) Test preparation. This training is provided at no cost to you, and most nurses reach the required level within 6-9 months. Would you like to know more about how our language program works?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= TIMELINE QUESTION TEMPLATES =============
const timelineQuestionTemplates = [
  {
    id: 'timeline_question_1',
    text: "Great question about the timeline, {{name}}. The process from application to working in Germany typically takes 10-14 months, broken down into: 1) Language acquisition (6-9 months to B2 level), 2) Credential recognition (2-3 months), 3) Visa processing (2-3 months), and 4) Relocation (1 month). These stages can overlap to reduce the total time. We support you throughout each phase, and you can continue working in your current position until the final stages. Would you like more details about any specific part of this timeline?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'timeline_question_2',
    text: "Regarding your question about timing, {{name}}, the journey to working as a nurse in Germany usually takes about 10-14 months total. This includes language learning (6-9 months), credential recognition (2-3 months), visa processing (2-3 months), and the actual relocation. We optimize the process by running several steps in parallel when possible. Our comprehensive support ensures you're never navigating this alone. Would you like to discuss how this timeline might work with your personal circumstances?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'timeline_question_3',
    text: "Thank you for asking about the timeline, {{name}}. The complete process typically takes 10-14 months from start to finish. The main phases include: language acquisition (6-9 months), document preparation and credential recognition (2-3 months), visa application (2-3 months), and relocation preparation (1 month). We structure the process efficiently, with some phases running concurrently. Throughout this journey, you'll have a dedicated coordinator guiding you every step of the way. Would you like to discuss how we might adapt this timeline to your specific situation?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= SCHEDULE CALL TEMPLATES =============
const scheduleCallTemplates = [
  {
    id: 'schedule_call_1',
    text: "I'd be happy to schedule a call with you, {{name}}! Our nursing career consultants are available Monday through Friday from 9 AM to 7 PM CET. Could you let me know a few time slots that would work well for you? Also, it would be helpful if you could share any specific questions or areas of interest you'd like to discuss during our call so we can prepare the most relevant information for you.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'schedule_call_2',
    text: "Great! I'd be delighted to arrange a call, {{name}}. Our team is available weekdays between 9 AM and 7 PM CET for consultations. Please suggest a few dates and times that would be convenient for you, and I'll confirm the appointment. To make our discussion as productive as possible, could you briefly share your nursing background and any specific aspects of working in Germany you're most interested in learning about?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'schedule_call_3',
    text: "I'm glad you're interested in scheduling a call, {{name}}! Our nursing recruitment specialists are available Monday-Friday, 9 AM-7 PM CET. Please provide a few preferred dates and times that work for you, and I'll arrange the call. To help us tailor the discussion to your needs, could you share your nursing specialty, years of experience, and any specific questions you have about working in Germany? This will allow us to prepare the most relevant information for you.",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= LATER RESPONSE TEMPLATES =============
const laterResponseTemplates = [
  {
    id: 'later_response_1',
    text: "I understand timing is important, {{name}}. No problem at all! We'll reach out to you at a later time. In the meantime, if you'd like, I can send you some resources about nursing careers in Germany, including information about the registration process, language requirements, and typical workplace expectations. Just let me know what interests you most!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'later_response_2',
    text: "I completely understand that now might not be the best time, {{name}}. Would you prefer that I contact you again in a few weeks? In the meantime, I'd be happy to send you some information about nursing in Germany that you can review at your convenience. Our opportunities are ongoing, so whenever you're ready to explore this option further, we'll be here to assist you.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'later_response_3',
    text: "No problem at all, {{name}}. I understand that timing is everything. Would you like me to follow up with you at a later date? Also, I'd be happy to send you some information about nursing opportunities in Germany that you can review whenever it's convenient. Many nurses take some time to consider these opportunities while continuing in their current positions. Just let me know how I can best support you.",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= NEGATIVE RESPONSE TEMPLATES =============
const negativeResponseTemplates = [
  {
    id: 'negative_response_1',
    text: "Thank you for your response, {{name}}. I understand that this opportunity might not be for you at the moment. If your situation changes in the future, or if you have colleagues who might be interested in nursing opportunities in Germany, please feel free to reach out. Wishing you all the best in your career!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'negative_response_2',
    text: "I appreciate your candid response, {{name}}. It's important to pursue opportunities that align with your career goals and personal circumstances. If things change in the future or if you know other nursing professionals who might be interested in positions in Germany, please don't hesitate to get in touch. I wish you continued success in your nursing career!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'negative_response_3',
    text: "Thank you for letting me know, {{name}}. I respect your decision and appreciate your consideration. Our door remains open should your professional goals or circumstances change in the future. Also, if you have colleagues or friends in nursing who might be interested in international opportunities in Germany, feel free to share my contact information. All the best in your professional endeavors!",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= NEUTRAL/UNCLEAR RESPONSE TEMPLATES =============
const neutralResponseTemplates = [
  {
    id: 'neutral_response_1',
    text: "Thank you for your message, {{name}}. We're here to provide you with information about exciting nursing opportunities in Germany. Would you like to learn more about the application process, salary expectations, or the support we provide for relocation? Feel free to ask any questions you might have!",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'neutral_response_2',
    text: "Thanks for your response, {{name}}. I'd be happy to provide more specific information about nursing careers in Germany. Many nurses are particularly interested in the salary structure, work environment, credential recognition process, and relocation support. Is there a particular aspect you'd like to know more about? I'm here to answer all your questions.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'neutral_response_3',
    text: "I appreciate your message, {{name}}. To best assist you with information about nursing opportunities in Germany, it would help if you could let me know what aspects interest you most. Some common areas of interest include: salary and benefits, work-life balance, career advancement, the credential recognition process, language requirements, or relocation support. What would you like to explore further?",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= CONFIRMATION RESPONSE TEMPLATES =============
const confirmationResponseTemplates = [
  {
    id: 'confirmation_response_1',
    text: "Thank you for confirming, {{name}}. If you have any specific questions about nursing opportunities in Germany, such as qualification recognition, language requirements, or the application process, please don't hesitate to ask. We're here to support your international nursing career journey every step of the way.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'confirmation_response_2',
    text: "Thank you, {{name}}. I'm here to provide any information you need about nursing careers in Germany. Many nurses ask about salary expectations, work conditions, the recognition process for foreign qualifications, and the support we provide throughout the relocation journey. Is there anything specific you'd like to know more about?",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'confirmation_response_3',
    text: "I appreciate your response, {{name}}. As you consider this opportunity, please feel free to ask about any aspect of nursing in Germany that interests you. Whether it's details about the healthcare system, professional development opportunities, or the practicalities of relocating, we're here to provide all the information you need to make an informed decision.",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// ============= UNCLEAR RESPONSE TEMPLATES =============
const unclearResponseTemplates = [
  {
    id: 'unclear_response_1',
    text: "Thank you for reaching out, {{name}}. I'm not sure I completely understood your message. Could you please clarify what specific information you're looking for about nursing opportunities in Germany? We're happy to assist with details about the application process, salary expectations, work environment, or relocation support.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'unclear_response_2',
    text: "Thanks for your message, {{name}}. To ensure I provide you with the most helpful information, could you please clarify what aspects of nursing in Germany you're interested in learning more about? We can discuss qualification recognition, language requirements, salary expectations, work conditions, or the application process – whatever is most relevant to you.",
    sandboxPrefix: SANDBOX_PREFIX
  },
  {
    id: 'unclear_response_3',
    text: "I received your message, {{name}}, but I'm not entirely sure what information would be most useful for you. Would you be interested in learning about: 1) The application process for nursing positions in Germany, 2) Salary and benefits details, 3) Language requirements and support, or 4) Our relocation assistance program? Please let me know, and I'll be happy to provide more specific information.",
    sandboxPrefix: SANDBOX_PREFIX
  }
];

// Function to get a random template from a specific category
export const getRandomTemplate = (category) => {
  // Template categories
  const templates = {
    initial: initialTemplates,
    firstFollowUp: firstFollowUpTemplates,
    secondFollowUp: secondFollowUpTemplates,
    positive: positiveResponseTemplates,
    question: questionResponseTemplates,
    salary_question: salaryQuestionTemplates,
    visa_question: visaQuestionTemplates,
    language_question: languageQuestionTemplates,
    timeline_question: timelineQuestionTemplates,
    schedule: scheduleCallTemplates,
    later: laterResponseTemplates,
    negative: negativeResponseTemplates,
    neutral: neutralResponseTemplates,
    confirmation: confirmationResponseTemplates,
    unclear: unclearResponseTemplates
  };
  
  // Get templates for the specified category
  const categoryTemplates = templates[category];
  
  // If category doesn't exist or is empty, return a default template
  if (!categoryTemplates || categoryTemplates.length === 0) {
    return {
      id: 'default_template',
      text: "Hello {{name}}! This is BorderPlus. We help international nurses find rewarding careers in Germany. Would you like to learn more about our opportunities?",
      sandboxPrefix: SANDBOX_PREFIX
    };
  }
  
  // Select a random template from the category
  const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
  return categoryTemplates[randomIndex];
};

// Function to get all templates for a specific category
export const getAllTemplatesForCategory = (category) => {
  // Template categories
  const templates = {
    initial: initialTemplates,
    firstFollowUp: firstFollowUpTemplates,
    secondFollowUp: secondFollowUpTemplates,
    positive: positiveResponseTemplates,
    question: questionResponseTemplates,
    salary_question: salaryQuestionTemplates,
    visa_question: visaQuestionTemplates,
    language_question: languageQuestionTemplates,
    timeline_question: timelineQuestionTemplates,
    schedule: scheduleCallTemplates,
    later: laterResponseTemplates,
    negative: negativeResponseTemplates,
    neutral: neutralResponseTemplates,
    confirmation: confirmationResponseTemplates,
    unclear: unclearResponseTemplates
  };
  
  return templates[category] || [];
};

// Function to get the entire template collection
export const getAllTemplates = () => {
  return {
    initial: initialTemplates,
    firstFollowUp: firstFollowUpTemplates,
    secondFollowUp: secondFollowUpTemplates,
    positive: positiveResponseTemplates,
    question: questionResponseTemplates,
    salary_question: salaryQuestionTemplates,
    visa_question: visaQuestionTemplates,
    language_question: languageQuestionTemplates,
    timeline_question: timelineQuestionTemplates,
    schedule: scheduleCallTemplates,
    later: laterResponseTemplates,
    negative: negativeResponseTemplates,
    neutral: neutralResponseTemplates,
    confirmation: confirmationResponseTemplates,
    unclear: unclearResponseTemplates
  };
};

export default {
  getRandomTemplate,
  getAllTemplatesForCategory,
  getAllTemplates,
  SANDBOX_PREFIX
};
